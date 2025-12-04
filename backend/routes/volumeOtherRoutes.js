import express from 'express';
import { getVolumeOther, createVolumeOther, updateVolumeOther, deleteVolumeOther } from '../controllers/volumeOtherController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getVolumeOther);
router.post('/', authenticateToken, createVolumeOther);
router.put('/:id', authenticateToken, updateVolumeOther);
router.delete('/:id', authenticateToken, deleteVolumeOther);

export default router;

