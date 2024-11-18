// routes/adminRoutes.js
import express from 'express';
import { createAdmin, inviteSubAdmin } from '../controllers/auth/adminAuthController.js';
import { protect, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for Super Admin to create Admin accounts
router.post('/create-admin', protect, superAdmin, createAdmin);

// Route for Super Admin to invite Sub-admins via email
router.post('/invite-sub-admin', protect, superAdmin, inviteSubAdmin);

export default router;
