import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';

export const getTinh = async (req, res) => {
  try {
    const [tinh] = await pool.execute('SELECT * FROM tinhthanh ORDER BY ten');
    res.json(tinh);
  } catch (error) {
    console.error('Lỗi lấy danh sách tỉnh:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const createTinh = async (req, res) => {
  try {
    const { ma, ten } = req.body;

    if (!ma || !ten) {
      return res.status(400).json({ error: 'Mã và tên tỉnh là bắt buộc' });
    }

    const [result] = await pool.execute(
      'INSERT INTO tinhthanh (ma, ten) VALUES (?, ?)',
      [ma, ten]
    );

    await logAction(req.user?.id || null, `Tạo tỉnh mới: ${ten}`, null, { ma, ten });

    res.status(201).json({
      id: result.insertId,
      ma,
      ten
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã tỉnh đã tồn tại' });
    }
    console.error('Lỗi tạo tỉnh:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const updateTinh = async (req, res) => {
  try {
    const { id } = req.params;
    const { ma, ten } = req.body;

    const [oldTinh] = await pool.execute('SELECT * FROM tinhthanh WHERE id = ?', [id]);

    if (oldTinh.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tỉnh' });
    }

    const updates = {};
    const values = [];

    if (ma) {
      updates.ma = ma;
      values.push(ma);
    }
    if (ten) {
      updates.ten = ten;
      values.push(ten);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Không có dữ liệu để cập nhật' });
    }

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    values.push(id);

    await pool.execute(`UPDATE tinhthanh SET ${setClause} WHERE id = ?`, values);

    await logAction(req.user?.id || null, `Cập nhật tỉnh ID: ${id}`, oldTinh[0], updates);

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã tỉnh đã tồn tại' });
    }
    console.error('Lỗi cập nhật tỉnh:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const deleteTinh = async (req, res) => {
  try {
    const { id } = req.params;

    const [tinh] = await pool.execute('SELECT * FROM tinhthanh WHERE id = ?', [id]);

    if (tinh.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tỉnh' });
    }

    await pool.execute('DELETE FROM tinhthanh WHERE id = ?', [id]);

    await logAction(req.user?.id || null, `Xóa tỉnh ID: ${id}`, tinh[0], null);

    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'Không thể xóa tỉnh đang được sử dụng' });
    }
    console.error('Lỗi xóa tỉnh:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

