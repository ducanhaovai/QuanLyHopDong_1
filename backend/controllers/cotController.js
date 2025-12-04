import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';

export const getCot = async (req, res) => {
  try {
    const [cot] = await pool.execute('SELECT * FROM thuviencot ORDER BY ngaytao DESC');
    res.json(cot);
  } catch (error) {
    console.error('Lỗi lấy danh sách cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const createCot = async (req, res) => {
  try {
    const { macot, tencot, vitri, cao, giadonvi, mota } = req.body;

    if (!macot || !tencot) {
      return res.status(400).json({ error: 'Mã cột và tên cột là bắt buộc' });
    }

    const [result] = await pool.execute(
      'INSERT INTO thuviencot (macot, tencot, vitri, cao, giadonvi, mota) VALUES (?, ?, ?, ?, ?, ?)',
      [macot, tencot, vitri || null, cao || null, giadonvi || 0, mota || null]
    );

    await logAction(req.user?.id || null, `Tạo cột mới: ${tencot}`, null, req.body);

    res.status(201).json({
      id: result.insertId,
      macot,
      tencot,
      vitri,
      cao,
      giadonvi: giadonvi || 0,
      mota
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã cột đã tồn tại' });
    }
    console.error('Lỗi tạo cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const updateCot = async (req, res) => {
  try {
    const { id } = req.params;
    const { macot, tencot, vitri, cao, giadonvi, mota } = req.body;

    const [oldCot] = await pool.execute('SELECT * FROM thuviencot WHERE id = ?', [id]);

    if (oldCot.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy cột' });
    }

    const updates = {};
    const values = [];

    if (macot) {
      updates.macot = macot;
      values.push(macot);
    }
    if (tencot) {
      updates.tencot = tencot;
      values.push(tencot);
    }
    if (vitri !== undefined) {
      updates.vitri = vitri;
      values.push(vitri);
    }
    if (cao !== undefined) {
      updates.cao = cao;
      values.push(cao);
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

    await pool.execute(`UPDATE thuviencot SET ${setClause} WHERE id = ?`, values);

    await logAction(req.user?.id || null, `Cập nhật cột ID: ${id}`, oldCot[0], updates);

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã cột đã tồn tại' });
    }
    console.error('Lỗi cập nhật cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const deleteCot = async (req, res) => {
  try {
    const { id } = req.params;

    const [cot] = await pool.execute('SELECT * FROM thuviencot WHERE id = ?', [id]);

    if (cot.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy cột' });
    }

    await pool.execute('DELETE FROM thuviencot WHERE id = ?', [id]);

    await logAction(req.user?.id || null, `Xóa cột ID: ${id}`, cot[0], null);

    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'Không thể xóa cột đang được sử dụng' });
    }
    console.error('Lỗi xóa cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

