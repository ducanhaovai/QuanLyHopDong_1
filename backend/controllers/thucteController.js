import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';
import { recalculateProgress } from './tiendoController.js';

// Lấy dữ liệu thực tế
export const getThucte = async (req, res) => {
  try {
    const { id } = req.params;

    const [thucte] = await pool.execute(`
      SELECT kt.*, 
             c.macot, c.tencot, c.vitri,
             hc.soluong as soluong_hopdong
      FROM kstk_thucte kt
      LEFT JOIN thuviencot c ON kt.cot_id = c.id
      LEFT JOIN hopdong_cot hc ON kt.hopdong_id = hc.hopdong_id AND kt.cot_id = hc.cot_id
      WHERE kt.hopdong_id = ?
      ORDER BY kt.ngaytao DESC
    `, [id]);

    res.json(thucte);
  } catch (error) {
    console.error('Lỗi lấy dữ liệu thực tế:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Nhập dữ liệu thực tế
export const createThucte = async (req, res) => {
  try {
    const { id } = req.params;
    const { cot_id, soluong_thucte } = req.body;

    if (!cot_id || soluong_thucte === undefined) {
      return res.status(400).json({ error: 'cot_id và soluong_thucte là bắt buộc' });
    }

    // Lấy số lượng trong hợp đồng
    const [hopdongCot] = await pool.execute(
      'SELECT soluong FROM hopdong_cot WHERE hopdong_id = ? AND cot_id = ?',
      [id, cot_id]
    );

    if (hopdongCot.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy cột trong hợp đồng' });
    }

    const soluong_hopdong = hopdongCot[0].soluong;
    const chenhlech = soluong_thucte - soluong_hopdong;
    const phantram_chenhlech = soluong_hopdong > 0 ? (chenhlech / soluong_hopdong) * 100 : 0;

    // Kiểm tra đã tồn tại chưa
    const [existing] = await pool.execute(
      'SELECT id FROM kstk_thucte WHERE hopdong_id = ? AND cot_id = ?',
      [id, cot_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Dữ liệu thực tế đã tồn tại, vui lòng cập nhật' });
    }

    const [result] = await pool.execute(
      'INSERT INTO kstk_thucte (hopdong_id, cot_id, soluong_thucte, chenhlech, phantram_chenhlech, nguoinhap_id) VALUES (?, ?, ?, ?, ?, ?)',
      [id, cot_id, soluong_thucte, chenhlech, phantram_chenhlech, req.user.id]
    );

    await logAction(req.user.id, `Nhập dữ liệu thực tế hợp đồng ${id}`, null, { cot_id, soluong_thucte, chenhlech });

    // Tự động tính lại phần trăm hoàn thành khi có bản ghi KSTK mới
    await recalculateProgress(id);

    res.status(201).json({
      id: result.insertId,
      hopdong_id: id,
      cot_id,
      soluong_thucte,
      chenhlech,
      phantram_chenhlech
    });
  } catch (error) {
    console.error('Lỗi nhập dữ liệu thực tế:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Cập nhật dữ liệu thực tế
export const updateThucte = async (req, res) => {
  try {
    const { id, cot_id } = req.params;
    const { soluong_thucte } = req.body;

    if (soluong_thucte === undefined) {
      return res.status(400).json({ error: 'soluong_thucte là bắt buộc' });
    }

    const [oldData] = await pool.execute(
      'SELECT * FROM kstk_thucte WHERE hopdong_id = ? AND cot_id = ?',
      [id, cot_id]
    );

    if (oldData.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy dữ liệu thực tế' });
    }

    // Lấy số lượng trong hợp đồng
    const [hopdongCot] = await pool.execute(
      'SELECT soluong FROM hopdong_cot WHERE hopdong_id = ? AND cot_id = ?',
      [id, cot_id]
    );

    const soluong_hopdong = hopdongCot[0].soluong;
    const chenhlech = soluong_thucte - soluong_hopdong;
    const phantram_chenhlech = soluong_hopdong > 0 ? (chenhlech / soluong_hopdong) * 100 : 0;

    await pool.execute(
      'UPDATE kstk_thucte SET soluong_thucte = ?, chenhlech = ?, phantram_chenhlech = ?, nguoinhap_id = ? WHERE hopdong_id = ? AND cot_id = ?',
      [soluong_thucte, chenhlech, phantram_chenhlech, req.user.id, id, cot_id]
    );

    await logAction(req.user.id, `Cập nhật dữ liệu thực tế hợp đồng ${id}`, oldData[0], { soluong_thucte, chenhlech });

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật dữ liệu thực tế:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// ========== VOLUME KHÁC ==========

// Lấy dữ liệu thực tế volume khác
export const getThucteVolumeOther = async (req, res) => {
  try {
    const { id } = req.params;

    const [thucte] = await pool.execute(`
      SELECT ktv.*, 
             v.mavolume, v.tenvolume,
             hdv.soluong as soluong_hopdong
      FROM kstk_thucte_volume_khac ktv
      LEFT JOIN thuvien_volume_khac v ON ktv.volume_id = v.id
      LEFT JOIN hopdong_volume_khac hdv ON ktv.hopdong_id = hdv.hopdong_id AND ktv.volume_id = hdv.volume_id
      WHERE ktv.hopdong_id = ?
      ORDER BY ktv.ngaytao DESC
    `, [id]);

    res.json(thucte);
  } catch (error) {
    console.error('Lỗi lấy dữ liệu thực tế volume khác:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Nhập dữ liệu thực tế volume khác
export const createThucteVolumeOther = async (req, res) => {
  try {
    const { id } = req.params;
    const { volume_id, soluong_thucte } = req.body;

    if (!volume_id || soluong_thucte === undefined) {
      return res.status(400).json({ error: 'volume_id và soluong_thucte là bắt buộc' });
    }

    // Lấy số lượng trong hợp đồng
    const [hopdongVolume] = await pool.execute(
      'SELECT soluong FROM hopdong_volume_khac WHERE hopdong_id = ? AND volume_id = ?',
      [id, volume_id]
    );

    if (hopdongVolume.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy volume trong hợp đồng' });
    }

    const soluong_hopdong = hopdongVolume[0].soluong;
    const chenhlech = soluong_thucte - soluong_hopdong;
    const phantram_chenhlech = soluong_hopdong > 0 ? (chenhlech / soluong_hopdong) * 100 : 0;

    // Kiểm tra đã tồn tại chưa
    const [existing] = await pool.execute(
      'SELECT id FROM kstk_thucte_volume_khac WHERE hopdong_id = ? AND volume_id = ?',
      [id, volume_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Dữ liệu thực tế đã tồn tại, vui lòng cập nhật' });
    }

    const [result] = await pool.execute(
      'INSERT INTO kstk_thucte_volume_khac (hopdong_id, volume_id, soluong_thucte, chenhlech, phantram_chenhlech, nguoinhap_id) VALUES (?, ?, ?, ?, ?, ?)',
      [id, volume_id, soluong_thucte, chenhlech, phantram_chenhlech, req.user.id]
    );

    await logAction(req.user.id, `Nhập dữ liệu thực tế volume khác hợp đồng ${id}`, null, { volume_id, soluong_thucte, chenhlech });

    // Tự động tính lại phần trăm hoàn thành khi có bản ghi KSTK mới
    await recalculateProgress(id);

    res.status(201).json({
      id: result.insertId,
      hopdong_id: id,
      volume_id,
      soluong_thucte,
      chenhlech,
      phantram_chenhlech
    });
  } catch (error) {
    console.error('Lỗi nhập dữ liệu thực tế volume khác:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Cập nhật dữ liệu thực tế volume khác
export const updateThucteVolumeOther = async (req, res) => {
  try {
    const { id, volume_id } = req.params;
    const { soluong_thucte } = req.body;

    if (soluong_thucte === undefined) {
      return res.status(400).json({ error: 'soluong_thucte là bắt buộc' });
    }

    const [oldData] = await pool.execute(
      'SELECT * FROM kstk_thucte_volume_khac WHERE hopdong_id = ? AND volume_id = ?',
      [id, volume_id]
    );

    if (oldData.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy dữ liệu thực tế' });
    }

    // Lấy số lượng trong hợp đồng
    const [hopdongVolume] = await pool.execute(
      'SELECT soluong FROM hopdong_volume_khac WHERE hopdong_id = ? AND volume_id = ?',
      [id, volume_id]
    );

    const soluong_hopdong = hopdongVolume[0].soluong;
    const chenhlech = soluong_thucte - soluong_hopdong;
    const phantram_chenhlech = soluong_hopdong > 0 ? (chenhlech / soluong_hopdong) * 100 : 0;

    await pool.execute(
      'UPDATE kstk_thucte_volume_khac SET soluong_thucte = ?, chenhlech = ?, phantram_chenhlech = ?, nguoinhap_id = ? WHERE hopdong_id = ? AND volume_id = ?',
      [soluong_thucte, chenhlech, phantram_chenhlech, req.user.id, id, volume_id]
    );

    await logAction(req.user.id, `Cập nhật dữ liệu thực tế volume khác hợp đồng ${id}`, oldData[0], { soluong_thucte, chenhlech });

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật dữ liệu thực tế volume khác:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

