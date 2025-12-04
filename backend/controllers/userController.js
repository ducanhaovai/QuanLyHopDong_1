import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';

export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, ten, email, vaitro, ngaytao, ngaysua FROM nguoidung ORDER BY ngaytao DESC'
    );
    res.json(users);
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { ten, email, matkhau, vaitro } = req.body;

    if (!ten || !email || !matkhau || !vaitro) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Kiểm tra email đã tồn tại
    const [existing] = await pool.execute(
      'SELECT id FROM nguoidung WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(matkhau, 10);

    const [result] = await pool.execute(
      'INSERT INTO nguoidung (ten, email, matkhau_hash, vaitro) VALUES (?, ?, ?, ?)',
      [ten, email, hashedPassword, vaitro]
    );

    // Log action nếu có user (từ middleware authenticateToken)
    if (req.user && req.user.id) {
      await logAction(req.user.id, `Tạo người dùng mới: ${email}`, null, { ten, email, vaitro });
    }

    res.status(201).json({
      id: result.insertId,
      ten,
      email,
      vaitro
    });
  } catch (error) {
    console.error('Lỗi tạo người dùng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten, email, matkhau, vaitro } = req.body;

    // Lấy dữ liệu cũ
    const [oldUsers] = await pool.execute(
      'SELECT * FROM nguoidung WHERE id = ?',
      [id]
    );

    if (oldUsers.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    const oldUser = oldUsers[0];
    const updates = {};
    const values = [];

    if (ten) {
      updates.ten = ten;
      values.push(ten);
    }
    if (email) {
      updates.email = email;
      values.push(email);
    }
    if (matkhau) {
      updates.matkhau_hash = await bcrypt.hash(matkhau, 10);
      values.push(updates.matkhau_hash);
    }
    if (vaitro) {
      updates.vaitro = vaitro;
      values.push(vaitro);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Không có dữ liệu để cập nhật' });
    }

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    values.push(id);

    await pool.execute(
      `UPDATE nguoidung SET ${setClause} WHERE id = ?`,
      values
    );

    // Log action nếu có user (từ middleware authenticateToken)
    if (req.user && req.user.id) {
      await logAction(req.user.id, `Cập nhật người dùng ID: ${id}`, oldUser, updates);
    }

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật người dùng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.execute(
      'SELECT * FROM nguoidung WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    // Soft delete - có thể thêm trường daxoa vào bảng nguoidung nếu cần
    // Hiện tại xóa thật
    await pool.execute('DELETE FROM nguoidung WHERE id = ?', [id]);

    // Log action nếu có user (từ middleware authenticateToken)
    if (req.user && req.user.id) {
      await logAction(req.user.id, `Xóa người dùng ID: ${id}`, users[0], null);
    }

    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    console.error('Lỗi xóa người dùng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

