import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';

// Lấy tiến độ hợp đồng
export const getTiendo = async (req, res) => {
  try {
    const { id } = req.params;

    const [tiendo] = await pool.execute(`
      SELECT t.*, 
             u.ten as nguoiks_ten
      FROM tiendotc t
      LEFT JOIN nguoidung u ON t.nguoiks_id = u.id
      WHERE t.hopdong_id = ?
    `, [id]);

    if (tiendo.length === 0) {
      return res.json(null);
    }

    res.json(tiendo[0]);
  } catch (error) {
    console.error('Lỗi lấy tiến độ:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Cập nhật tiến độ
export const updateTiendo = async (req, res) => {
  try {
    const { id } = req.params;
    const { ngayks, ngaytk, ngaydutoan, ngaypheduyet, ngaynhan_dhtc, trangthai_tc, nguoiks_id } = req.body;

    // Kiểm tra hợp đồng tồn tại
    const [hopdong] = await pool.execute('SELECT id FROM hopdong WHERE id = ?', [id]);
    if (hopdong.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hợp đồng' });
    }

    // Kiểm tra tiến độ đã tồn tại chưa
    const [existing] = await pool.execute('SELECT * FROM tiendotc WHERE hopdong_id = ?', [id]);

    let phantram_ht = 0;
    const milestones = [
      { date: ngayks, weight: 10 },
      { date: ngaytk, weight: 20 },
      { date: ngaydutoan, weight: 20 },
      { date: ngaypheduyet, weight: 20 },
      { date: ngaynhan_dhtc, weight: 20 },
      { status: trangthai_tc, weight: 10 }
    ];

    milestones.forEach(milestone => {
      if (milestone.date || milestone.status) {
        phantram_ht += milestone.weight;
      }
    });

    if (existing.length === 0) {
      // Tạo mới
      const [result] = await pool.execute(
        'INSERT INTO tiendotc (hopdong_id, ngayks, nguoiks_id, ngaytk, ngaydutoan, ngaypheduyet, ngaynhan_dhtc, trangthai_tc, phantram_ht) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, ngayks || null, nguoiks_id || null, ngaytk || null, ngaydutoan || null, ngaypheduyet || null, ngaynhan_dhtc || null, trangthai_tc || null, phantram_ht]
      );

      await logAction(req.user?.id || null, `Tạo tiến độ hợp đồng ${id}`, null, req.body);

      res.status(201).json({
        id: result.insertId,
        hopdong_id: id,
        ngayks,
        nguoiks_id,
        ngaytk,
        ngaydutoan,
        ngaypheduyet,
        ngaynhan_dhtc,
        trangthai_tc,
        phantram_ht
      });
    } else {
      // Cập nhật
      const oldData = existing[0];
      const updates = {};
      const values = [];

      if (ngayks !== undefined) {
        updates.ngayks = ngayks;
        values.push(ngayks);
      }
      if (nguoiks_id !== undefined) {
        updates.nguoiks_id = nguoiks_id;
        values.push(nguoiks_id);
      }
      if (ngaytk !== undefined) {
        updates.ngaytk = ngaytk;
        values.push(ngaytk);
      }
      if (ngaydutoan !== undefined) {
        updates.ngaydutoan = ngaydutoan;
        values.push(ngaydutoan);
      }
      if (ngaypheduyet !== undefined) {
        updates.ngaypheduyet = ngaypheduyet;
        values.push(ngaypheduyet);
      }
      if (ngaynhan_dhtc !== undefined) {
        updates.ngaynhan_dhtc = ngaynhan_dhtc;
        values.push(ngaynhan_dhtc);
      }
      if (trangthai_tc !== undefined) {
        updates.trangthai_tc = trangthai_tc;
        values.push(trangthai_tc);
      }

      updates.phantram_ht = phantram_ht;
      values.push(phantram_ht);
      values.push(id);

      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');

      await pool.execute(
        `UPDATE tiendotc SET ${setClause} WHERE hopdong_id = ?`,
        values
      );

      await logAction(req.user?.id || null, `Cập nhật tiến độ hợp đồng ${id}`, oldData, updates);

      res.json({ message: 'Cập nhật thành công' });
    }
  } catch (error) {
    console.error('Lỗi cập nhật tiến độ:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

