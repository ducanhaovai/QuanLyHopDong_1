import pool from '../config/database.js';

// Lấy lịch sử hệ thống
export const getLichsu = async (req, res) => {
  try {
    const [lichsu] = await pool.execute(`
      SELECT l.*, 
             u.ten as nguoidung_ten, u.email as nguoidung_email
      FROM lichsu l
      LEFT JOIN nguoidung u ON l.nguoidung_id = u.id
      ORDER BY l.ngaytao DESC
      LIMIT 1000
    `);

    // Parse JSON fields
    const result = lichsu.map(item => ({
      ...item,
      dulieu_truoc: item.dulieu_truoc ? JSON.parse(item.dulieu_truoc) : null,
      dulieu_sau: item.dulieu_sau ? JSON.parse(item.dulieu_sau) : null
    }));

    res.json(result);
  } catch (error) {
    console.error('Lỗi lấy lịch sử:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Lấy lịch sử theo hợp đồng
export const getLichsuHopdong = async (req, res) => {
  try {
    const { id } = req.params;

    const [lichsu] = await pool.execute(`
      SELECT l.*, 
             u.ten as nguoidung_ten, u.email as nguoidung_email
      FROM lichsu l
      LEFT JOIN nguoidung u ON l.nguoidung_id = u.id
      WHERE l.hanhdong LIKE ? OR l.dulieu_truoc LIKE ? OR l.dulieu_sau LIKE ?
      ORDER BY l.ngaytao DESC
    `, [`%hợp đồng ${id}%`, `%"id":${id}%`, `%"id":${id}%`]);

    // Parse JSON fields
    const result = lichsu.map(item => ({
      ...item,
      dulieu_truoc: item.dulieu_truoc ? JSON.parse(item.dulieu_truoc) : null,
      dulieu_sau: item.dulieu_sau ? JSON.parse(item.dulieu_sau) : null
    }));

    res.json(result);
  } catch (error) {
    console.error('Lỗi lấy lịch sử hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

