// routes/userRoutes.js
import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { protect, voter, superAdmin } from '../middleware/authMiddleware.js';
import { createAdmin } from '../controllers/userController.js';


const router = express.Router();

// Get the current user's profile (read-only access for Voters)
router.get('/profile', protect, voter, getUserProfile);

// Super Admin creates an Admin
router.post('/create-admin', protect, superAdmin, createAdmin);

export default router;
