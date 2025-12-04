import express from 'express';
import { getTram, createTram, updateTram, deleteTram } from '../controllers/tramController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getTram);
router.post('/', authenticateToken, createTram);
router.put('/:id', authenticateToken, updateTram);
router.delete('/:id', authenticateToken, deleteTram);

export default router;

