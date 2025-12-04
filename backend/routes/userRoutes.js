import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticateToken, authorizeRoles, allowFirstUserOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getUsers);
router.post('/', allowFirstUserOrAdmin, createUser);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

export default router;

