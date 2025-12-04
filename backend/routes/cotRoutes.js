import express from 'express';
import { getCot, createCot, updateCot, deleteCot } from '../controllers/cotController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getCot);
router.post('/', authenticateToken, createCot);
router.put('/:id', authenticateToken, updateCot);
router.delete('/:id', authenticateToken, deleteCot);

export default router;

