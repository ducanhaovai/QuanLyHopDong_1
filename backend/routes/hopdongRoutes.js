import express from 'express';
import { getHopdong, createHopdong, updateHopdong, deleteHopdong } from '../controllers/hopdongController.js';
import { getLichsuHopdong } from '../controllers/lichsuController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getHopdong);
router.post('/', authenticateToken, createHopdong);
router.put('/:id', authenticateToken, updateHopdong);
router.delete('/:id', authenticateToken, deleteHopdong);
router.get('/:id/lichsu', authenticateToken, getLichsuHopdong);

export default router;

