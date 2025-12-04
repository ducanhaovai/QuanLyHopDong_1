import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';

// Lấy danh sách volume khác theo hợp đồng
export const getHopdongVolumeOther = async (req, res) => {
  try {
    const { id } = req.params;

    const [volumes] = await pool.execute(`
      SELECT hdv.*, 
             v.mavolume, v.tenvolume, v.giadonvi
      FROM hopdong_volume_khac hdv
      LEFT JOIN thuvien_volume_khac v ON hdv.volume_id = v.id
      WHERE hdv.hopdong_id = ?
      ORDER BY hdv.ngaytao DESC
    `, [id]);

    res.json(volumes);
  } catch (error) {
    console.error('Lỗi lấy danh sách volume khác hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Thêm volume khác vào hợp đồng
export const addVolumeOtherToHopdong = async (req, res) => {
  try {
    const { id } = req.params;
    const { volume_id, soluong } = req.body;

    if (!volume_id || !soluong) {
      return res.status(400).json({ error: 'volume_id và soluong là bắt buộc' });
    }

    // Lấy giá đơn vị của volume
    const [volume] = await pool.execute('SELECT giadonvi FROM thuvien_volume_khac WHERE id = ?', [volume_id]);
    if (volume.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy loại volume' });
    }

    const tongtien = (volume[0].giadonvi || 0) * soluong;

    const [result] = await pool.execute(
      'INSERT INTO hopdong_volume_khac (hopdong_id, volume_id, soluong, tongtien) VALUES (?, ?, ?, ?)',
      [id, volume_id, soluong, tongtien]
    );

    // Cập nhật tổng giá trị hợp đồng (bao gồm cả cột và volume khác)
    await pool.execute(
      `UPDATE hopdong SET tonggiatri = (
        SELECT COALESCE(SUM(tongtien), 0) FROM (
          SELECT tongtien FROM hopdong_cot WHERE hopdong_id = ?
          UNION ALL
          SELECT tongtien FROM hopdong_volume_khac WHERE hopdong_id = ?
        ) AS total
      ) WHERE id = ?`,
      [id, id, id]
    );

    await logAction(req.user?.id || null, `Thêm volume khác vào hợp đồng ${id}`, null, { volume_id, soluong, tongtien });

    res.status(201).json({
      id: result.insertId,
      hopdong_id: id,
      volume_id,
      soluong,
      tongtien
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Volume đã tồn tại trong hợp đồng' });
    }
    console.error('Lỗi thêm volume khác vào hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Cập nhật số lượng volume khác
export const updateHopdongVolumeOther = async (req, res) => {
  try {
    const { id, volume_id } = req.params;
    const { soluong } = req.body;

    if (!soluong) {
      return res.status(400).json({ error: 'soluong là bắt buộc' });
    }

    const [oldData] = await pool.execute(
      'SELECT * FROM hopdong_volume_khac WHERE hopdong_id = ? AND volume_id = ?',
      [id, volume_id]
    );

    if (oldData.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy volume trong hợp đồng' });
    }

    // Lấy giá đơn vị
    const [volume] = await pool.execute('SELECT giadonvi FROM thuvien_volume_khac WHERE id = ?', [volume_id]);
    const tongtien = (volume[0].giadonvi || 0) * soluong;

    await pool.execute(
      'UPDATE hopdong_volume_khac SET soluong = ?, tongtien = ? WHERE hopdong_id = ? AND volume_id = ?',
      [soluong, tongtien, id, volume_id]
    );

    // Cập nhật tổng giá trị hợp đồng
    await pool.execute(
      `UPDATE hopdong SET tonggiatri = (
        SELECT COALESCE(SUM(tongtien), 0) FROM (
          SELECT tongtien FROM hopdong_cot WHERE hopdong_id = ?
          UNION ALL
          SELECT tongtien FROM hopdong_volume_khac WHERE hopdong_id = ?
        ) AS total
      ) WHERE id = ?`,
      [id, id, id]
    );

    await logAction(req.user?.id || null, `Cập nhật số lượng volume khác hợp đồng ${id}`, oldData[0], { soluong, tongtien });

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật volume khác hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Xóa volume khác khỏi hợp đồng
export const deleteHopdongVolumeOther = async (req, res) => {
  try {
    const { id, volume_id } = req.params;

    const [oldData] = await pool.execute(
      'SELECT * FROM hopdong_volume_khac WHERE hopdong_id = ? AND volume_id = ?',
      [id, volume_id]
    );

    if (oldData.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy volume trong hợp đồng' });
    }

    await pool.execute(
      'DELETE FROM hopdong_volume_khac WHERE hopdong_id = ? AND volume_id = ?',
      [id, volume_id]
    );

    // Cập nhật tổng giá trị hợp đồng
    await pool.execute(
      `UPDATE hopdong SET tonggiatri = (
        SELECT COALESCE(SUM(tongtien), 0) FROM (
          SELECT tongtien FROM hopdong_cot WHERE hopdong_id = ?
          UNION ALL
          SELECT tongtien FROM hopdong_volume_khac WHERE hopdong_id = ?
        ) AS total
      ) WHERE id = ?`,
      [id, id, id]
    );

    await logAction(req.user?.id || null, `Xóa volume khác khỏi hợp đồng ${id}`, oldData[0], null);

    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    console.error('Lỗi xóa volume khác hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

