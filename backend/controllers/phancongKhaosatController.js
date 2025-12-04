import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';

// Lấy danh sách phân công khảo sát
export const getPhancongKhaosat = async (req, res) => {
  try {
    const { hopdong_id, ktv_id, trangthai } = req.query;

    let query = `
      SELECT 
        pc.id,
        pc.hopdong_id,
        hd.sohopdong,
        hd.chudautu,
        t.matram,
        t.diachi,
        tt.ten AS tinhthanh_ten,
        pc.ktv_id,
        ktv.ten AS ktv_ten,
        ktv.email AS ktv_email,
        pc.admin_id,
        admin.ten AS admin_ten,
        pc.trangthai,
        pc.ngay_phan_cong,
        pc.ngay_bat_dau,
        pc.ngay_hoan_thanh,
        pc.ghichu,
        pc.ghichu_ktv,
        pc.ngaytao,
        pc.ngaysua
      FROM phancong_khaosat pc
      INNER JOIN hopdong hd ON pc.hopdong_id = hd.id
      INNER JOIN tram t ON hd.tram_id = t.id
      INNER JOIN tinhthanh tt ON t.tinhthanh_id = tt.id
      INNER JOIN nguoidung ktv ON pc.ktv_id = ktv.id
      INNER JOIN nguoidung admin ON pc.admin_id = admin.id
      WHERE hd.daxoa = 0
    `;

    const params = [];

    if (hopdong_id) {
      query += ' AND pc.hopdong_id = ?';
      params.push(hopdong_id);
    }

    if (ktv_id) {
      query += ' AND pc.ktv_id = ?';
      params.push(ktv_id);
    }

    if (trangthai) {
      query += ' AND pc.trangthai = ?';
      params.push(trangthai);
    }

    query += ' ORDER BY pc.ngay_phan_cong DESC';

    const [results] = await pool.execute(query, params);
    res.json(results);
  } catch (error) {
    console.error('Lỗi lấy danh sách phân công khảo sát:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Lấy chi tiết phân công khảo sát
export const getPhancongKhaosatById = async (req, res) => {
  try {
    const { id } = req.params;

    const [results] = await pool.execute(`
      SELECT 
        pc.id,
        pc.hopdong_id,
        hd.sohopdong,
        hd.chudautu,
        t.matram,
        t.diachi,
        tt.ten AS tinhthanh_ten,
        pc.ktv_id,
        ktv.ten AS ktv_ten,
        ktv.email AS ktv_email,
        pc.admin_id,
        admin.ten AS admin_ten,
        pc.trangthai,
        pc.ngay_phan_cong,
        pc.ngay_bat_dau,
        pc.ngay_hoan_thanh,
        pc.ghichu,
        pc.ghichu_ktv,
        pc.ngaytao,
        pc.ngaysua
      FROM phancong_khaosat pc
      INNER JOIN hopdong hd ON pc.hopdong_id = hd.id
      INNER JOIN tram t ON hd.tram_id = t.id
      INNER JOIN tinhthanh tt ON t.tinhthanh_id = tt.id
      INNER JOIN nguoidung ktv ON pc.ktv_id = ktv.id
      INNER JOIN nguoidung admin ON pc.admin_id = admin.id
      WHERE pc.id = ? AND hd.daxoa = 0
    `, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy phân công khảo sát' });
    }

    res.json(results[0]);
  } catch (error) {
    console.error('Lỗi lấy chi tiết phân công khảo sát:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Phân công KTV khảo sát (Admin only)
export const createPhancongKhaosat = async (req, res) => {
  try {
    const { hopdong_id, ktv_id, ghichu } = req.body;
    const admin_id = req.user.id;

    if (!hopdong_id || !ktv_id) {
      return res.status(400).json({ error: 'hopdong_id và ktv_id là bắt buộc' });
    }

    // Kiểm tra user có phải admin không
    const [user] = await pool.execute('SELECT la_admin FROM nguoidung WHERE id = ?', [admin_id]);
    if (user.length === 0 || !user[0].la_admin) {
      return res.status(403).json({ error: 'Chỉ admin mới được phân công khảo sát' });
    }

    // Kiểm tra KTV có phải là KTV không (la_admin = 0)
    const [ktv] = await pool.execute('SELECT la_admin FROM nguoidung WHERE id = ?', [ktv_id]);
    if (ktv.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy KTV' });
    }
    if (ktv[0].la_admin === 1) {
      return res.status(400).json({ error: 'Người được phân công phải là KTV (không phải admin)' });
    }

    // Kiểm tra hợp đồng có tồn tại không
    const [hopdong] = await pool.execute('SELECT id, daxoa FROM hopdong WHERE id = ?', [hopdong_id]);
    if (hopdong.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hợp đồng' });
    }
    if (hopdong[0].daxoa === 1) {
      return res.status(400).json({ error: 'Hợp đồng đã bị xóa' });
    }

    // Kiểm tra đã có phân công chưa (chưa hoàn thành hoặc chưa hủy)
    const [existing] = await pool.execute(
      'SELECT id FROM phancong_khaosat WHERE hopdong_id = ? AND trangthai NOT IN ("hoan_thanh", "da_huy")',
      [hopdong_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Hợp đồng đã có phân công khảo sát chưa hoàn thành' });
    }

    const [result] = await pool.execute(
      'INSERT INTO phancong_khaosat (hopdong_id, ktv_id, admin_id, ghichu, trangthai) VALUES (?, ?, ?, ?, "chua_ks")',
      [hopdong_id, ktv_id, admin_id, ghichu || null]
    );

    await logAction(admin_id, `Phân công KTV khảo sát hợp đồng ${hopdong_id}`, null, { ktv_id, ghichu });

    res.status(201).json({
      id: result.insertId,
      hopdong_id,
      ktv_id,
      admin_id,
      trangthai: 'chua_ks',
      message: 'Phân công khảo sát thành công'
    });
  } catch (error) {
    console.error('Lỗi phân công khảo sát:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Cập nhật phân công khảo sát
export const updatePhancongKhaosat = async (req, res) => {
  try {
    const { id } = req.params;
    const { ngay_bat_dau, ngay_hoan_thanh, ghichu, ghichu_ktv, trangthai } = req.body;

    const [oldData] = await pool.execute('SELECT * FROM phancong_khaosat WHERE id = ?', [id]);

    if (oldData.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy phân công khảo sát' });
    }

    const updates = {};
    const values = [];

    if (ngay_bat_dau !== undefined) {
      updates.ngay_bat_dau = ngay_bat_dau;
      values.push(ngay_bat_dau);
    }
    if (ngay_hoan_thanh !== undefined) {
      updates.ngay_hoan_thanh = ngay_hoan_thanh;
      values.push(ngay_hoan_thanh);
    }
    if (ghichu !== undefined) {
      updates.ghichu = ghichu;
      values.push(ghichu);
    }
    if (ghichu_ktv !== undefined) {
      updates.ghichu_ktv = ghichu_ktv;
      values.push(ghichu_ktv);
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

    await pool.execute(`UPDATE phancong_khaosat SET ${setClause} WHERE id = ?`, values);

    await logAction(req.user.id, `Cập nhật phân công khảo sát ID: ${id}`, oldData[0], updates);

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật phân công khảo sát:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Đổi nhân viên khảo sát (Admin only)
export const doiKTVKhaosat = async (req, res) => {
  try {
    const { id } = req.params;
    const { ktv_id, ghichu } = req.body;
    const admin_id = req.user.id;

    if (!ktv_id) {
      return res.status(400).json({ error: 'ktv_id là bắt buộc' });
    }

    // Kiểm tra user có phải admin không
    const [user] = await pool.execute('SELECT la_admin FROM nguoidung WHERE id = ?', [admin_id]);
    if (user.length === 0 || !user[0].la_admin) {
      return res.status(403).json({ error: 'Chỉ admin mới được đổi nhân viên khảo sát' });
    }

    // Kiểm tra phân công có tồn tại không
    const [oldData] = await pool.execute('SELECT * FROM phancong_khaosat WHERE id = ?', [id]);
    if (oldData.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy phân công khảo sát' });
    }

    // Kiểm tra trạng thái (không cho đổi nếu đã hoàn thành)
    if (oldData[0].trangthai === 'hoan_thanh') {
      return res.status(400).json({ error: 'Không thể đổi KTV khi đã hoàn thành khảo sát' });
    }

    // Kiểm tra KTV mới có phải là KTV không
    const [ktv] = await pool.execute('SELECT la_admin FROM nguoidung WHERE id = ?', [ktv_id]);
    if (ktv.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy KTV' });
    }
    if (ktv[0].la_admin === 1) {
      return res.status(400).json({ error: 'Người được phân công phải là KTV (không phải admin)' });
    }

    // Cập nhật KTV và reset trạng thái về chua_ks nếu đang ở trạng thái khác
    const newTrangthai = oldData[0].trangthai === 'da_huy' ? 'chua_ks' : oldData[0].trangthai;
    const newGhichu = ghichu || oldData[0].ghichu;

    await pool.execute(
      'UPDATE phancong_khaosat SET ktv_id = ?, admin_id = ?, trangthai = ?, ghichu = ?, ngay_bat_dau = NULL, ngay_hoan_thanh = NULL WHERE id = ?',
      [ktv_id, admin_id, newTrangthai, newGhichu, id]
    );

    await logAction(admin_id, `Đổi KTV khảo sát ID: ${id}`, oldData[0], { ktv_id_moi: ktv_id, ktv_id_cu: oldData[0].ktv_id, ghichu });

    res.json({ 
      message: 'Đổi KTV khảo sát thành công',
      ktv_id_moi: ktv_id,
      ktv_id_cu: oldData[0].ktv_id
    });
  } catch (error) {
    console.error('Lỗi đổi KTV khảo sát:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Hủy lịch khảo sát (Admin only)
export const huyLichKhaosat = async (req, res) => {
  try {
    const { id } = req.params;
    const { ghichu } = req.body;
    const admin_id = req.user.id;

    // Kiểm tra user có phải admin không
    const [user] = await pool.execute('SELECT la_admin FROM nguoidung WHERE id = ?', [admin_id]);
    if (user.length === 0 || !user[0].la_admin) {
      return res.status(403).json({ error: 'Chỉ admin mới được hủy lịch khảo sát' });
    }

    // Kiểm tra phân công có tồn tại không
    const [oldData] = await pool.execute('SELECT * FROM phancong_khaosat WHERE id = ?', [id]);
    if (oldData.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy phân công khảo sát' });
    }

    // Kiểm tra trạng thái (không cho hủy nếu đã hoàn thành)
    if (oldData[0].trangthai === 'hoan_thanh') {
      return res.status(400).json({ error: 'Không thể hủy khi đã hoàn thành khảo sát' });
    }

    // Kiểm tra đã hủy chưa
    if (oldData[0].trangthai === 'da_huy') {
      return res.status(400).json({ error: 'Lịch khảo sát đã được hủy trước đó' });
    }

    // Cập nhật trạng thái thành da_huy
    const newGhichu = ghichu || oldData[0].ghichu;

    await pool.execute(
      'UPDATE phancong_khaosat SET trangthai = "da_huy", ghichu = ? WHERE id = ?',
      [newGhichu, id]
    );

    await logAction(admin_id, `Hủy lịch khảo sát ID: ${id}`, oldData[0], { ghichu });

    res.json({ message: 'Hủy lịch khảo sát thành công' });
  } catch (error) {
    console.error('Lỗi hủy lịch khảo sát:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Xóa phân công khảo sát (Admin only - chỉ khi chưa bắt đầu)
export const deletePhancongKhaosat = async (req, res) => {
  try {
    const { id } = req.params;
    const admin_id = req.user.id;

    // Kiểm tra user có phải admin không
    const [user] = await pool.execute('SELECT la_admin FROM nguoidung WHERE id = ?', [admin_id]);
    if (user.length === 0 || !user[0].la_admin) {
      return res.status(403).json({ error: 'Chỉ admin mới được xóa phân công khảo sát' });
    }

    const [oldData] = await pool.execute('SELECT * FROM phancong_khaosat WHERE id = ?', [id]);

    if (oldData.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy phân công khảo sát' });
    }

    // Chỉ cho phép xóa khi chưa bắt đầu khảo sát
    if (oldData[0].trangthai === 'dang_ks' || oldData[0].trangthai === 'hoan_thanh') {
      return res.status(400).json({ error: 'Không thể xóa phân công đã bắt đầu hoặc hoàn thành' });
    }

    await pool.execute('DELETE FROM phancong_khaosat WHERE id = ?', [id]);

    await logAction(admin_id, `Xóa phân công khảo sát ID: ${id}`, oldData[0], null);

    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    console.error('Lỗi xóa phân công khảo sát:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

