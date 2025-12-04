import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';

export const getHopdong = async (req, res) => {
  try {
    const [hopdong] = await pool.execute(`
      SELECT h.*, 
             t.matram, t.diachi as tram_diachi, t.lat, t.lng, t.loaiproject,
             tt.ten as tinhthanh_ten, tt.ma as tinhthanh_ma
      FROM hopdong h
      LEFT JOIN tram t ON h.tram_id = t.id
      LEFT JOIN tinhthanh tt ON t.tinhthanh_id = tt.id
      WHERE h.daxoa = 0
      ORDER BY h.ngaytao DESC
    `);
    res.json(hopdong);
  } catch (error) {
    console.error('Lỗi lấy danh sách hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const createHopdong = async (req, res) => {
  try {
    const { tram_id, sohopdong, chudautu, ngayky, tonggiatri } = req.body;

    if (!tram_id || !sohopdong || !chudautu || !ngayky) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const [result] = await pool.execute(
      'INSERT INTO hopdong (tram_id, sohopdong, chudautu, ngayky, tonggiatri) VALUES (?, ?, ?, ?, ?)',
      [tram_id, sohopdong, chudautu, ngayky, tonggiatri || 0]
    );

    await logAction(req.user?.id || null, `Tạo hợp đồng mới: ${sohopdong}`, null, req.body);

    res.status(201).json({
      id: result.insertId,
      tram_id,
      sohopdong,
      chudautu,
      ngayky,
      tonggiatri: tonggiatri || 0
    });
  } catch (error) {
    console.error('Lỗi tạo hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const updateHopdong = async (req, res) => {
  try {
    const { id } = req.params;
    const { tram_id, sohopdong, chudautu, ngayky, tonggiatri, trangthai } = req.body;

    const [oldHopdong] = await pool.execute('SELECT * FROM hopdong WHERE id = ?', [id]);

    if (oldHopdong.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hợp đồng' });
    }

    const updates = {};
    const values = [];

    if (tram_id) {
      updates.tram_id = tram_id;
      values.push(tram_id);
    }
    if (sohopdong) {
      updates.sohopdong = sohopdong;
      values.push(sohopdong);
    }
    if (chudautu) {
      updates.chudautu = chudautu;
      values.push(chudautu);
    }
    if (ngayky) {
      updates.ngayky = ngayky;
      values.push(ngayky);
    }
    if (tonggiatri !== undefined) {
      updates.tonggiatri = tonggiatri;
      values.push(tonggiatri);
    }
    if (trangthai) {
      updates.trangthai = trangthai;
      values.push(trangthai);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Không có dữ liệu để cập nhật' });
    }

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    values.push(id);

    await pool.execute(`UPDATE hopdong SET ${setClause} WHERE id = ?`, values);

    await logAction(req.user?.id || null, `Cập nhật hợp đồng ID: ${id}`, oldHopdong[0], updates);

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const deleteHopdong = async (req, res) => {
  try {
    const { id } = req.params;

    const [hopdong] = await pool.execute('SELECT * FROM hopdong WHERE id = ?', [id]);

    if (hopdong.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hợp đồng' });
    }

    // Soft delete
    await pool.execute('UPDATE hopdong SET daxoa = 1 WHERE id = ?', [id]);

    await logAction(req.user?.id || null, `Xóa hợp đồng ID: ${id}`, hopdong[0], null);

    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    console.error('Lỗi xóa hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

