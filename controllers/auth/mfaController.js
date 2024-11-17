import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import { verifySMSCode } from '../../utils/twilioVerify.js';

// Verify OTP for login
export const verifyLoginOTP = async (req, res) => {
  const { mobile, otpCode } = req.body;

  try {
    const verificationCheck = await verifySMSCode(mobile, otpCode);
    if (verificationCheck.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ mobile, role: 'Voter' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
  }
};
