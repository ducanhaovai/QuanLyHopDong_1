import express from 'express';
import { getLichsu, getLichsuHopdong } from '../controllers/lichsuController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getLichsu);

export default router;

