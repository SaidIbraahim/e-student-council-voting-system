// routes/candidateRoutes.js
import express from 'express';
import { addCandidate, approveCandidate, getAllCandidates } from '../controllers/candidateController.js';
import upload from '../config/multerConfig.js';
import { protect, admin, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Candidate registration with image upload (only admins can add candidates)
router.post('/add', protect, admin, upload.single('candidateImage'), addCandidate);

// Approve or reject a candidate (Super Admin only)
router.post('/approve', protect, superAdmin, approveCandidate);

// Get all candidates (accessible to all roles)
router.get('/', protect, getAllCandidates);

export default router;
