import express from 'express';
import { getHopdong, getHopdongById, createHopdong, updateHopdong, deleteHopdong } from '../controllers/hopdongController.js';
import { getLichsuHopdong } from '../controllers/lichsuController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getHopdong);
router.post('/', authenticateToken, createHopdong);
// Route cụ thể phải đặt trước route chung
router.get('/:id/lichsu', authenticateToken, getLichsuHopdong);
router.get('/:id', authenticateToken, getHopdongById);
router.put('/:id', authenticateToken, updateHopdong);
router.delete('/:id', authenticateToken, deleteHopdong);

export default router;

