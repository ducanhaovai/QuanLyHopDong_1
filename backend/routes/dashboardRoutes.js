import express from 'express';
import { getOverview, getDoanhthu, getTiendoTinh } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', authenticateToken, getOverview);
router.get('/doanhthu', authenticateToken, getDoanhthu);
router.get('/tiendo', authenticateToken, getTiendoTinh);

export default router;

