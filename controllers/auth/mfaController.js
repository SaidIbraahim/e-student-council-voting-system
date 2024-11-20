// controllers/auth/mfaController.js
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import { verifySMSCode } from '../../utils/twilioVerify.js';

// Import the formatSomaliaMobileNumber function
import { formatSomaliaMobileNumber } from './voterAuthController.js';

// Verify OTP for login
export const verifyLoginOTP = async (req, res) => {
  const { mobile, otpCode } = req.body;

  try {
    const formattedMobile = formatSomaliaMobileNumber(mobile);
    if (!formattedMobile) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    // Verify the OTP code with Twilio or any OTP verification service
    const verificationCheck = await verifySMSCode(formattedMobile, otpCode);
    if (verificationCheck.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Find the user by mobile number and update their status to active
    const user = await User.findOneAndUpdate(
      { mobile: formattedMobile, role: 'Voter' },
      { status: 'active' },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
  }
};