// routes/electionRoutes.js
import express from 'express';
import { createElection } from '../controllers/electionController.js';
import { protect, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new election (Super Admin only)
router.post('/create', protect, superAdmin, createElection);

export default router;
