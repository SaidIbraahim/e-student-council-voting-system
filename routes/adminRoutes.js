// routes/adminRoutes.js
import express from 'express';
import {inviteSubAdmin, loginAdmin } from '../controllers/auth/adminAuthController.js';
import { protect, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for Super Admin to create Admin accounts
router.post('/create-admin', protect, superAdmin);

// Route for Super Admin to invite Sub-admins via email
router.post('/invite-sub-admin', protect, superAdmin, inviteSubAdmin);

// Route for admin login
router.post('/login-admin', loginAdmin);

export default router;
