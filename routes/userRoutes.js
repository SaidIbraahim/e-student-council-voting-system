// routes/userRoutes.js
import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { protect, superAdmin } from '../middleware/authMiddleware.js';


const router = express.Router();

// Get the current user's profile (read-only access for Voters)
router.get('/profile', protect, getUserProfile);

export default router;
