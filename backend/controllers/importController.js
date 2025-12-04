import XLSX from 'xlsx';
import multer from 'multer';
import pool from '../config/database.js';
import { logAction } from '../utils/logger.js';

// Cấu hình multer để upload file
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Import Excel hợp đồng
export const importHopdong = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Tìm hoặc tạo trạm
        let tramId = null;
        if (row.matram) {
          const [tram] = await pool.execute('SELECT id FROM tram WHERE matram = ?', [row.matram]);
          if (tram.length > 0) {
            tramId = tram[0].id;
          } else {
            // Tạo trạm mới nếu chưa có
            // Cần có tinhthanh_id, có thể lấy từ row hoặc mặc định
            if (row.tinhthanh_id) {
              const [result] = await pool.execute(
                'INSERT INTO tram (matram, tinhthanh_id, diachi, loaiproject) VALUES (?, ?, ?, ?)',
                [row.matram, row.tinhthanh_id, row.diachi || null, row.loaiproject || 'btsmoi']
              );
              tramId = result.insertId;
            } else {
              results.failed++;
              results.errors.push(`Dòng ${i + 2}: Thiếu tinhthanh_id cho trạm ${row.matram}`);
              continue;
            }
          }
        } else if (row.tram_id) {
          tramId = row.tram_id;
        } else {
          results.failed++;
          results.errors.push(`Dòng ${i + 2}: Thiếu matram hoặc tram_id`);
          continue;
        }

        // Tạo hợp đồng
        await pool.execute(
          'INSERT INTO hopdong (tram_id, sohopdong, chudautu, ngayky, tonggiatri) VALUES (?, ?, ?, ?, ?)',
          [
            tramId,
            row.sohopdong,
            row.chudautu,
            row.ngayky,
            row.tonggiatri || 0
          ]
        );

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Dòng ${i + 2}: ${error.message}`);
      }
    }

    await logAction(req.user?.id || null, `Import hợp đồng từ Excel`, null, results);

    res.json({
      message: 'Import hoàn tất',
      ...results
    });
  } catch (error) {
    console.error('Lỗi import Excel:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

