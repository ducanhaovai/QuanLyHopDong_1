import express from 'express';
import { getTiendo, updateTiendo } from '../controllers/tiendoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id/tiendo', authenticateToken, getTiendo);
router.put('/:id/tiendo', authenticateToken, updateTiendo);

export default router;

