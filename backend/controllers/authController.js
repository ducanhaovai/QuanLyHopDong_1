import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const login = async (req, res) => {
  try {
    const { email, matkhau } = req.body;

    if (!email || !matkhau) {
      return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc' });
    }

    const [users] = await pool.execute(
      'SELECT id, ten, email, matkhau_hash, la_admin FROM nguoidung WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(matkhau, user.matkhau_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, la_admin: user.la_admin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        ten: user.ten,
        email: user.email,
        la_admin: user.la_admin
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

