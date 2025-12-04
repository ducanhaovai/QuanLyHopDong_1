import express from 'express';
import { getHopdongVolumeOther, addVolumeOtherToHopdong, updateHopdongVolumeOther, deleteHopdongVolumeOther } from '../controllers/hopdongVolumeOtherController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id/volume-other', authenticateToken, getHopdongVolumeOther);
router.post('/:id/volume-other', authenticateToken, addVolumeOtherToHopdong);
router.put('/:id/volume-other/:volume_id', authenticateToken, updateHopdongVolumeOther);
router.delete('/:id/volume-other/:volume_id', authenticateToken, deleteHopdongVolumeOther);

export default router;

