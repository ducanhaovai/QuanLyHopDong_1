import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';

// Lấy danh sách cột theo hợp đồng
export const getHopdongCot = async (req, res) => {
  try {
    const { id } = req.params;

    const [cot] = await pool.execute(`
      SELECT hc.*, 
             c.macot, c.tencot, c.vitri, c.cao, c.giadonvi
      FROM hopdong_cot hc
      LEFT JOIN thuviencot c ON hc.cot_id = c.id
      WHERE hc.hopdong_id = ?
      ORDER BY hc.ngaytao DESC
    `, [id]);

    res.json(cot);
  } catch (error) {
    console.error('Lỗi lấy danh sách cột hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Thêm cột vào hợp đồng
export const addCotToHopdong = async (req, res) => {
  try {
    const { id } = req.params;
    const { cot_id, soluong } = req.body;

    if (!cot_id || !soluong) {
      return res.status(400).json({ error: 'cot_id và soluong là bắt buộc' });
    }

    // Lấy giá đơn vị của cột
    const [cot] = await pool.execute('SELECT giadonvi FROM thuviencot WHERE id = ?', [cot_id]);
    if (cot.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy loại cột' });
    }

    const tongtien = (cot[0].giadonvi || 0) * soluong;

    const [result] = await pool.execute(
      'INSERT INTO hopdong_cot (hopdong_id, cot_id, soluong, tongtien) VALUES (?, ?, ?, ?)',
      [id, cot_id, soluong, tongtien]
    );

    // Cập nhật tổng giá trị hợp đồng
    await pool.execute(
      'UPDATE hopdong SET tonggiatri = (SELECT SUM(tongtien) FROM hopdong_cot WHERE hopdong_id = ?) WHERE id = ?',
      [id, id]
    );

    await logAction(req.user?.id || null, `Thêm cột vào hợp đồng ${id}`, null, { cot_id, soluong, tongtien });

    res.status(201).json({
      id: result.insertId,
      hopdong_id: id,
      cot_id,
      soluong,
      tongtien
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Cột đã tồn tại trong hợp đồng' });
    }
    console.error('Lỗi thêm cột vào hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Cập nhật số lượng cột
export const updateHopdongCot = async (req, res) => {
  try {
    const { id, cot_id } = req.params;
    const { soluong } = req.body;

    if (!soluong) {
      return res.status(400).json({ error: 'soluong là bắt buộc' });
    }

    const [oldData] = await pool.execute(
      'SELECT * FROM hopdong_cot WHERE hopdong_id = ? AND cot_id = ?',
      [id, cot_id]
    );

    if (oldData.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy cột trong hợp đồng' });
    }

    // Lấy giá đơn vị
    const [cot] = await pool.execute('SELECT giadonvi FROM thuviencot WHERE id = ?', [cot_id]);
    const tongtien = (cot[0].giadonvi || 0) * soluong;

    await pool.execute(
      'UPDATE hopdong_cot SET soluong = ?, tongtien = ? WHERE hopdong_id = ? AND cot_id = ?',
      [soluong, tongtien, id, cot_id]
    );

    // Cập nhật tổng giá trị hợp đồng
    await pool.execute(
      'UPDATE hopdong SET tonggiatri = (SELECT SUM(tongtien) FROM hopdong_cot WHERE hopdong_id = ?) WHERE id = ?',
      [id, id]
    );

    await logAction(req.user?.id || null, `Cập nhật số lượng cột hợp đồng ${id}`, oldData[0], { soluong, tongtien });

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật cột hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Xóa cột khỏi hợp đồng
export const deleteHopdongCot = async (req, res) => {
  try {
    const { id, cot_id } = req.params;

    const [oldData] = await pool.execute(
      'SELECT * FROM hopdong_cot WHERE hopdong_id = ? AND cot_id = ?',
      [id, cot_id]
    );

    if (oldData.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy cột trong hợp đồng' });
    }

    await pool.execute(
      'DELETE FROM hopdong_cot WHERE hopdong_id = ? AND cot_id = ?',
      [id, cot_id]
    );

    // Cập nhật tổng giá trị hợp đồng
    await pool.execute(
      'UPDATE hopdong SET tonggiatri = (SELECT COALESCE(SUM(tongtien), 0) FROM hopdong_cot WHERE hopdong_id = ?) WHERE id = ?',
      [id, id]
    );

    await logAction(req.user?.id || null, `Xóa cột khỏi hợp đồng ${id}`, oldData[0], null);

    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    console.error('Lỗi xóa cột hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

