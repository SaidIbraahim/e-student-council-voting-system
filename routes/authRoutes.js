// routes/authRoutes.js
import express from 'express';
import { registerVoter, loginVoter, verifyLoginOTP } from '../controllers/authController.js';


const router = express.Router();

// Registration endpoint
router.post('/register-voter', registerVoter);

// Login endpoint
router.post('/login-voter', loginVoter);
router.post('/verify-otp', verifyLoginOTP);

export default router;
