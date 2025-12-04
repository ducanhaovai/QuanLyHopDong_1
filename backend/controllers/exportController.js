import XLSX from 'xlsx';
import pool from '../config/database.js';

// Xuất Excel hợp đồng
export const exportHopdong = async (req, res) => {
  try {
    const [hopdong] = await pool.execute(`
      SELECT 
        h.id,
        h.sohopdong,
        h.chudautu,
        h.ngayky,
        h.tonggiatri,
        h.trangthai,
        t.matram,
        t.diachi as tram_diachi,
        tt.ten as tinhthanh_ten,
        tt.ma as tinhthanh_ma
      FROM hopdong h
      LEFT JOIN tram t ON h.tram_id = t.id
      LEFT JOIN tinhthanh tt ON t.tinhthanh_id = tt.id
      WHERE h.daxoa = 0
      ORDER BY h.ngaytao DESC
    `);

    const worksheet = XLSX.utils.json_to_sheet(hopdong);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hợp đồng');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=hopdong.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Lỗi xuất Excel hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Xuất Excel tiến độ
export const exportTiendo = async (req, res) => {
  try {
    const [tiendo] = await pool.execute(`
      SELECT 
        h.id,
        h.sohopdong,
        h.chudautu,
        t.matram,
        tt.ten as tinhthanh_ten,
        td.ngayks,
        td.ngaytk,
        td.ngaydutoan,
        td.ngaypheduyet,
        td.ngaynhan_dhtc,
        td.trangthai_tc,
        td.phantram_ht
      FROM hopdong h
      LEFT JOIN tram t ON h.tram_id = t.id
      LEFT JOIN tinhthanh tt ON t.tinhthanh_id = tt.id
      LEFT JOIN tiendotc td ON h.id = td.hopdong_id
      WHERE h.daxoa = 0
      ORDER BY h.ngaytao DESC
    `);

    const worksheet = XLSX.utils.json_to_sheet(tiendo);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tiến độ');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=tiendo.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Lỗi xuất Excel tiến độ:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

