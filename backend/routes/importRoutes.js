import express from 'express';
import { importHopdong, upload } from '../controllers/importController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/hopdong', authenticateToken, upload.single('file'), importHopdong);

export default router;

