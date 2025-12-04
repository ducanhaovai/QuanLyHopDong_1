import express from 'express';
import { exportHopdong, exportTiendo } from '../controllers/exportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/hopdong', authenticateToken, exportHopdong);
router.get('/tiendo', authenticateToken, exportTiendo);

export default router;

