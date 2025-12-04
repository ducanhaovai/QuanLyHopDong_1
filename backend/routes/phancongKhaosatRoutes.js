import express from 'express';
import { 
  getPhancongKhaosat, 
  getPhancongKhaosatById,
  createPhancongKhaosat, 
  updatePhancongKhaosat, 
  deletePhancongKhaosat,
  doiKTVKhaosat,
  huyLichKhaosat
} from '../controllers/phancongKhaosatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getPhancongKhaosat);
router.get('/:id', authenticateToken, getPhancongKhaosatById);
router.post('/', authenticateToken, createPhancongKhaosat);
router.put('/:id', authenticateToken, updatePhancongKhaosat);
router.put('/:id/doi-ktv', authenticateToken, doiKTVKhaosat);
router.put('/:id/huy', authenticateToken, huyLichKhaosat);
router.delete('/:id', authenticateToken, deletePhancongKhaosat);

export default router;

