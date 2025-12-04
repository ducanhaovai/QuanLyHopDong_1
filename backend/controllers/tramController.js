import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';

export const getTram = async (req, res) => {
  try {
    const [tram] = await pool.execute(`
      SELECT t.*, tt.ten as tinhthanh_ten, tt.ma as tinhthanh_ma
      FROM tram t
      LEFT JOIN tinhthanh tt ON t.tinhthanh_id = tt.id
      ORDER BY t.ngaytao DESC
    `);
    res.json(tram);
  } catch (error) {
    console.error('Lỗi lấy danh sách trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const createTram = async (req, res) => {
  try {
    const { matram, tinhthanh_id, diachi, lat, lng, loaiproject } = req.body;

    if (!matram || !tinhthanh_id || !loaiproject) {
      return res.status(400).json({ error: 'Mã trạm, tỉnh thành và loại project là bắt buộc' });
    }

    const [result] = await pool.execute(
      'INSERT INTO tram (matram, tinhthanh_id, diachi, lat, lng, loaiproject) VALUES (?, ?, ?, ?, ?, ?)',
      [matram, tinhthanh_id, diachi || null, lat || null, lng || null, loaiproject]
    );

    await logAction(req.user?.id || null, `Tạo trạm mới: ${matram}`, null, req.body);

    res.status(201).json({
      id: result.insertId,
      matram,
      tinhthanh_id,
      diachi,
      lat,
      lng,
      loaiproject
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã trạm đã tồn tại' });
    }
    console.error('Lỗi tạo trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const updateTram = async (req, res) => {
  try {
    const { id } = req.params;
    const { matram, tinhthanh_id, diachi, lat, lng, loaiproject } = req.body;

    const [oldTram] = await pool.execute('SELECT * FROM tram WHERE id = ?', [id]);

    if (oldTram.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy trạm' });
    }

    const updates = {};
    const values = [];

    if (matram) {
      updates.matram = matram;
      values.push(matram);
    }
    if (tinhthanh_id) {
      updates.tinhthanh_id = tinhthanh_id;
      values.push(tinhthanh_id);
    }
    if (diachi !== undefined) {
      updates.diachi = diachi;
      values.push(diachi);
    }
    if (lat !== undefined) {
      updates.lat = lat;
      values.push(lat);
    }
    if (lng !== undefined) {
      updates.lng = lng;
      values.push(lng);
    }
    if (loaiproject) {
      updates.loaiproject = loaiproject;
      values.push(loaiproject);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Không có dữ liệu để cập nhật' });
    }

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    values.push(id);

    await pool.execute(`UPDATE tram SET ${setClause} WHERE id = ?`, values);

    await logAction(req.user?.id || null, `Cập nhật trạm ID: ${id}`, oldTram[0], updates);

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã trạm đã tồn tại' });
    }
    console.error('Lỗi cập nhật trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const deleteTram = async (req, res) => {
  try {
    const { id } = req.params;

    const [tram] = await pool.execute('SELECT * FROM tram WHERE id = ?', [id]);

    if (tram.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy trạm' });
    }

    await pool.execute('DELETE FROM tram WHERE id = ?', [id]);

    await logAction(req.user?.id || null, `Xóa trạm ID: ${id}`, tram[0], null);

    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'Không thể xóa trạm đang được sử dụng' });
    }
    console.error('Lỗi xóa trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

