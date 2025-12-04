import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';

export const getVolumeOther = async (req, res) => {
  try {
    const [volumes] = await pool.execute('SELECT * FROM thuvien_volume_khac ORDER BY ngaytao DESC');
    res.json(volumes);
  } catch (error) {
    console.error('Lỗi lấy danh sách volume khác:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const createVolumeOther = async (req, res) => {
  try {
    const { mavolume, tenvolume, giadonvi, mota } = req.body;

    if (!mavolume || !tenvolume) {
      return res.status(400).json({ error: 'Mã volume và tên volume là bắt buộc' });
    }

    const [result] = await pool.execute(
      'INSERT INTO thuvien_volume_khac (mavolume, tenvolume, giadonvi, mota) VALUES (?, ?, ?, ?)',
      [mavolume, tenvolume, giadonvi || 0, mota || null]
    );

    await logAction(req.user?.id || null, `Tạo volume khác mới: ${tenvolume}`, null, req.body);

    res.status(201).json({
      id: result.insertId,
      mavolume,
      tenvolume,
      giadonvi: giadonvi || 0,
      mota
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã volume đã tồn tại' });
    }
    console.error('Lỗi tạo volume khác:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const updateVolumeOther = async (req, res) => {
  try {
    const { id } = req.params;
    const { mavolume, tenvolume, giadonvi, mota } = req.body;

    const [oldVolume] = await pool.execute('SELECT * FROM thuvien_volume_khac WHERE id = ?', [id]);

    if (oldVolume.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy volume' });
    }

    const updates = {};
    const values = [];

    if (mavolume) {
      updates.mavolume = mavolume;
      values.push(mavolume);
    }
    if (tenvolume) {
      updates.tenvolume = tenvolume;
      values.push(tenvolume);
    }
    if (giadonvi !== undefined) {
      updates.giadonvi = giadonvi;
      values.push(giadonvi);
    }
    if (mota !== undefined) {
      updates.mota = mota;
      values.push(mota);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Không có dữ liệu để cập nhật' });
    }

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    values.push(id);

    await pool.execute(`UPDATE thuvien_volume_khac SET ${setClause} WHERE id = ?`, values);

    await logAction(req.user?.id || null, `Cập nhật volume khác ID: ${id}`, oldVolume[0], updates);

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã volume đã tồn tại' });
    }
    console.error('Lỗi cập nhật volume khác:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const deleteVolumeOther = async (req, res) => {
  try {
    const { id } = req.params;

    const [volume] = await pool.execute('SELECT * FROM thuvien_volume_khac WHERE id = ?', [id]);

    if (volume.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy volume' });
    }

    await pool.execute('DELETE FROM thuvien_volume_khac WHERE id = ?', [id]);

    await logAction(req.user?.id || null, `Xóa volume khác ID: ${id}`, volume[0], null);

    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'Không thể xóa volume đang được sử dụng' });
    }
    console.error('Lỗi xóa volume khác:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

