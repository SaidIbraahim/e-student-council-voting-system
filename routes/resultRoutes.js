// routes/resultRoutes.js
import express from 'express';
import { calculateResults, generateReport } from '../controllers/resultController.js';
import { protect, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Calculate results for a specific election (Super Admin only)
router.get('/calculate/:electionId', protect, superAdmin, calculateResults);

// Generate report for a specific election (Super Admin only)
router.get('/report/:electionId', protect, superAdmin, generateReport);


export default router;

