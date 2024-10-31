// routes/voteRoutes.js
import express from 'express';
import { castVote } from '../controllers/voteController.js';
import { protect, voter } from '../middleware/authMiddleware.js';

const router = express.Router();

// Cast a vote (Voter only)
router.post('/cast', protect, voter, castVote);

export default router;
