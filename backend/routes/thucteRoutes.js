import express from 'express';
import { 
  getThucte, createThucte, updateThucte,
  getThucteVolumeOther, createThucteVolumeOther, updateThucteVolumeOther
} from '../controllers/thucteController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Cột
router.get('/:id/thucte', authenticateToken, getThucte);
router.post('/:id/thucte', authenticateToken, createThucte);
router.put('/:id/thucte/:cot_id', authenticateToken, updateThucte);

// Volume khác
router.get('/:id/thucte-volume-other', authenticateToken, getThucteVolumeOther);
router.post('/:id/thucte-volume-other', authenticateToken, createThucteVolumeOther);
router.put('/:id/thucte-volume-other/:volume_id', authenticateToken, updateThucteVolumeOther);

export default router;

