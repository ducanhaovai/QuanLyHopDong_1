import pool from '../config/database.js';

// Dashboard tổng quan
export const getOverview = async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM hopdong WHERE daxoa = 0) as tong_hopdong,
        (SELECT COUNT(*) FROM tram) as tong_tram,
        (SELECT COUNT(*) FROM tinhthanh) as tong_tinh,
        (SELECT COUNT(*) FROM thuviencot) as tong_cot,
        (SELECT COUNT(*) FROM nguoidung) as tong_nguoidung,
        (SELECT SUM(tonggiatri) FROM hopdong WHERE daxoa = 0) as tong_giatri,
        (SELECT COUNT(*) FROM hopdong WHERE trangthai = 'hoanthanh' AND daxoa = 0) as hopdong_hoanthanh,
        (SELECT COUNT(*) FROM hopdong WHERE trangthai = 'dangxuly' AND daxoa = 0) as hopdong_dangxuly,
        (SELECT COUNT(*) FROM hopdong WHERE trangthai = 'tretien_do' AND daxoa = 0) as hopdong_tretien_do
    `);

    res.json(stats[0]);
  } catch (error) {
    console.error('Lỗi lấy dashboard tổng quan:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Thống kê doanh thu
export const getDoanhthu = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT 
        DATE_FORMAT(ngayky, '%Y-%m') as thang,
        SUM(tonggiatri) as tong_doanhthu,
        COUNT(*) as so_hopdong
      FROM hopdong
      WHERE daxoa = 0
    `;

    const params = [];

    if (startDate) {
      query += ' AND ngayky >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND ngayky <= ?';
      params.push(endDate);
    }

    query += ' GROUP BY DATE_FORMAT(ngayky, "%Y-%m") ORDER BY thang DESC LIMIT 12';

    const [doanhthu] = await pool.execute(query, params);

    res.json(doanhthu);
  } catch (error) {
    console.error('Lỗi lấy thống kê doanh thu:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Tiến độ theo tỉnh
export const getTiendoTinh = async (req, res) => {
  try {
    const [tiendo] = await pool.execute(`
      SELECT 
        tt.id,
        tt.ma,
        tt.ten,
        COUNT(DISTINCT h.id) as tong_hopdong,
        COUNT(DISTINCT CASE WHEN h.trangthai = 'hoanthanh' THEN h.id END) as hoanthanh,
        COUNT(DISTINCT CASE WHEN h.trangthai = 'dangxuly' THEN h.id END) as dangxuly,
        COUNT(DISTINCT CASE WHEN h.trangthai = 'tretien_do' THEN h.id END) as tretien_do,
        AVG(td.phantram_ht) as phantram_tb
      FROM tinhthanh tt
      LEFT JOIN tram t ON tt.id = t.tinhthanh_id
      LEFT JOIN hopdong h ON t.id = h.tram_id AND h.daxoa = 0
      LEFT JOIN tiendotc td ON h.id = td.hopdong_id
      GROUP BY tt.id, tt.ma, tt.ten
      ORDER BY tt.ten
    `);

    res.json(tiendo);
  } catch (error) {
    console.error('Lỗi lấy tiến độ theo tỉnh:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

