import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';

// Kiểm tra xem hợp đồng đã có bản ghi KSTK thực tế chưa
// Trả về true nếu có ít nhất 1 bản ghi trong kstk_thucte hoặc kstk_thucte_volume_khac
const hasKstkThucte = async (hopdongId) => {
  try {
    const [kstkCot] = await pool.execute(
      'SELECT COUNT(*) as count FROM kstk_thucte WHERE hopdong_id = ?',
      [hopdongId]
    );
    
    const [kstkVolume] = await pool.execute(
      'SELECT COUNT(*) as count FROM kstk_thucte_volume_khac WHERE hopdong_id = ?',
      [hopdongId]
    );
    
    return (kstkCot[0].count > 0) || (kstkVolume[0].count > 0);
  } catch (error) {
    console.error('Lỗi kiểm tra KSTK thực tế:', error);
    return false;
  }
};

// Tính lại và cập nhật phần trăm hoàn thành cho hợp đồng
// Hàm này được gọi khi có bản ghi KSTK mới được tạo
export const recalculateProgress = async (hopdongId) => {
  try {
    // Lấy thông tin tiến độ hiện tại
    const [tiendo] = await pool.execute(
      'SELECT * FROM tiendotc WHERE hopdong_id = ?',
      [hopdongId]
    );

    if (tiendo.length === 0) {
      // Chưa có tiến độ, không cần tính lại
      return;
    }

    const currentTiendo = tiendo[0];
    
    // Kiểm tra xem đã có bản ghi KSTK thực tế chưa
    const hasKstk = await hasKstkThucte(hopdongId);

    let phantram_ht = 0;
    
    // Ngày khảo sát (10%) chỉ được tính khi đã có bản ghi KSTK thực tế
    if (currentTiendo.ngayks && hasKstk) {
      phantram_ht += 10;
    }
    
    // Các mốc khác tính bình thường
    if (currentTiendo.ngaytk) {
      phantram_ht += 20;
    }
    if (currentTiendo.ngaydutoan) {
      phantram_ht += 20;
    }
    if (currentTiendo.ngaypheduyet) {
      phantram_ht += 20;
    }
    if (currentTiendo.ngaynhan_dhtc) {
      phantram_ht += 20;
    }
    if (currentTiendo.trangthai_tc) {
      phantram_ht += 10;
    }

    // Cập nhật phần trăm hoàn thành
    await pool.execute(
      'UPDATE tiendotc SET phantram_ht = ? WHERE hopdong_id = ?',
      [phantram_ht, hopdongId]
    );

    console.log(`Đã cập nhật phần trăm hoàn thành cho hợp đồng ${hopdongId}: ${phantram_ht}%`);
  } catch (error) {
    console.error('Lỗi tính lại tiến độ:', error);
    // Không throw error để không ảnh hưởng đến flow chính
  }
};

// Map trạng thái từ database sang frontend
const mapTrangThai = (trangthai_tc, phantram_ht) => {
  // Nếu có trạng thái thi công, ưu tiên dùng nó
  if (trangthai_tc) {
    const statusMap = {
      'khaosat': 'Khảo sát',
      'thietke': 'Thiết kế',
      'dutoan': 'Thiết kế',
      'pheduyet': 'Thiết kế',
      'dhtc': 'ĐHTC',
      'hoanthanh': 'Hoàn thành',
      'dangtc': 'Đang thi công'
    };
    return statusMap[trangthai_tc] || 'Khảo sát';
  }
  
  // Nếu không có trạng thái, dựa vào phần trăm hoàn thành
  if (phantram_ht >= 100) return 'Hoàn thành';
  if (phantram_ht >= 70) return 'Đang thi công';
  if (phantram_ht >= 40) return 'Thiết kế';
  return 'Khảo sát';
};

// Lấy danh sách hợp đồng với tiến độ (cho trang Progress)
export const getAllTiendo = async (req, res) => {
  try {
    const { search, status, province } = req.query;

    let query = `
      SELECT 
        h.id,
        h.sohopdong,
        h.chudautu,
        h.ngayky,
        h.tonggiatri,
        h.trangthai,
        t.matram,
        tt.ten as tinhthanh_ten,
        td.phantram_ht,
        td.trangthai_tc,
        td.ngayks,
        td.ngaytk,
        td.ngaydutoan,
        td.ngaypheduyet,
        td.ngaynhan_dhtc
      FROM hopdong h
      LEFT JOIN tram t ON h.tram_id = t.id
      LEFT JOIN tinhthanh tt ON t.tinhthanh_id = tt.id
      LEFT JOIN tiendotc td ON h.id = td.hopdong_id
      WHERE h.daxoa = 0
    `;

    const params = [];

    // Filter theo search
    if (search) {
      query += ` AND (
        t.matram LIKE ? OR 
        h.sohopdong LIKE ? OR 
        tt.ten LIKE ? OR 
        h.chudautu LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Filter theo tỉnh thành
    if (province && province !== 'all') {
      query += ` AND tt.ten = ?`;
      params.push(province);
    }

    query += ` ORDER BY h.ngaytao DESC`;

    const [results] = await pool.execute(query, params);

    // Map dữ liệu để phù hợp với frontend
    const contracts = results.map(row => {
      const statusDisplay = mapTrangThai(row.trangthai_tc, row.phantram_ht || 0);
      
      return {
        id: row.id,
        code: row.matram || '',
        contractNo: row.sohopdong,
        province: row.tinhthanh_ten || 'Chưa xác định',
        status: statusDisplay,
        progress: Math.round(row.phantram_ht || 0),
        value: parseFloat(row.tonggiatri || 0),
        investor: row.chudautu,
        date: row.ngayky,
        // Thêm thông tin tiến độ chi tiết
        tiendo: {
          ngayks: row.ngayks,
          ngaytk: row.ngaytk,
          ngaydutoan: row.ngaydutoan,
          ngaypheduyet: row.ngaypheduyet,
          ngaynhan_dhtc: row.ngaynhan_dhtc,
          trangthai_tc: row.trangthai_tc,
          phantram_ht: row.phantram_ht || 0
        }
      };
    });

    // Filter theo status sau khi map (vì status được tính từ nhiều nguồn)
    let filteredContracts = contracts;
    if (status && status !== 'all') {
      filteredContracts = contracts.filter(c => c.status === status);
    }

    res.json(filteredContracts);
  } catch (error) {
    console.error('Lỗi lấy danh sách tiến độ:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Lấy danh sách hợp đồng được gán cho KTV (dựa trên nguoiks_id)
export const getKTVContracts = async (req, res) => {
  try {
    const ktvId = req.user.id; // Lấy từ token

    const query = `
      SELECT 
        h.id,
        h.sohopdong,
        h.chudautu,
        h.ngayky,
        h.tonggiatri,
        t.matram,
        tt.ten as tinhthanh_ten,
        td.ngayks,
        td.nguoiks_id,
        u.ten as nguoiks_ten,
        -- Kiểm tra xem đã có bản ghi KSTK chưa
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM kstk_thucte WHERE hopdong_id = h.id
          ) OR EXISTS (
            SELECT 1 FROM kstk_thucte_volume_khac WHERE hopdong_id = h.id
          ) THEN 1
          ELSE 0
        END as da_khaosat
      FROM hopdong h
      INNER JOIN tiendotc td ON h.id = td.hopdong_id
      LEFT JOIN tram t ON h.tram_id = t.id
      LEFT JOIN tinhthanh tt ON t.tinhthanh_id = tt.id
      LEFT JOIN nguoidung u ON td.nguoiks_id = u.id
      WHERE h.daxoa = 0
        AND td.nguoiks_id = ?
        AND td.ngayks IS NOT NULL
      ORDER BY h.ngaytao DESC
    `;

    const [results] = await pool.execute(query, [ktvId]);

    const contracts = results.map(row => ({
      id: row.id,
      contractNo: row.sohopdong,
      code: row.matram || '',
      province: row.tinhthanh_ten || 'Chưa xác định',
      investor: row.chudautu,
      date: row.ngayky,
      value: parseFloat(row.tonggiatri || 0),
      ngayks: row.ngayks,
      nguoiks_ten: row.nguoiks_ten,
      daKhaosat: row.da_khaosat === 1
    }));

    res.json(contracts);
  } catch (error) {
    console.error('Lỗi lấy danh sách hợp đồng KTV:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

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

    // Kiểm tra xem đã có bản ghi KSTK thực tế chưa
    const hasKstk = await hasKstkThucte(id);

    let phantram_ht = 0;
    
    // Ngày khảo sát (10%) chỉ được tính khi đã có bản ghi KSTK thực tế
    if (ngayks && hasKstk) {
      phantram_ht += 10;
    }
    
    // Các mốc khác tính bình thường
    if (ngaytk) {
      phantram_ht += 20;
    }
    if (ngaydutoan) {
      phantram_ht += 20;
    }
    if (ngaypheduyet) {
      phantram_ht += 20;
    }
    if (ngaynhan_dhtc) {
      phantram_ht += 20;
    }
    if (trangthai_tc) {
      phantram_ht += 10;
    }

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

