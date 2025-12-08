import express from 'express';
import { getAllTiendo, getKTVContracts, getTiendo, updateTiendo } from '../controllers/tiendoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Lấy danh sách tất cả hợp đồng với tiến độ (cho trang Progress)
// Phải đặt trước route /:id để tránh conflict
router.get('/tiendo/list', authenticateToken, getAllTiendo);
// Lấy danh sách hợp đồng được gán cho KTV
router.get('/ktv/contracts', authenticateToken, getKTVContracts);
// Lấy tiến độ của một hợp đồng cụ thể
router.get('/:id/tiendo', authenticateToken, getTiendo);
// Cập nhật tiến độ
router.put('/:id/tiendo', authenticateToken, updateTiendo);

export default router;

