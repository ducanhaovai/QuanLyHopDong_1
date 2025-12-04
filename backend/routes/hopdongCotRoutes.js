import express from 'express';
import { getHopdongCot, addCotToHopdong, updateHopdongCot, deleteHopdongCot } from '../controllers/hopdongCotController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id/cot', authenticateToken, getHopdongCot);
router.post('/:id/cot', authenticateToken, addCotToHopdong);
router.put('/:id/cot/:cot_id', authenticateToken, updateHopdongCot);
router.delete('/:id/cot/:cot_id', authenticateToken, deleteHopdongCot);

export default router;

