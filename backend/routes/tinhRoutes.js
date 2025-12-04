import express from 'express';
import { getTinh, createTinh, updateTinh, deleteTinh } from '../controllers/tinhController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getTinh);
router.post('/', authenticateToken, createTinh);
router.put('/:id', authenticateToken, updateTinh);
router.delete('/:id', authenticateToken, deleteTinh);

export default router;

