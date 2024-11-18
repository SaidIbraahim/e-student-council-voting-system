// controllers/userController.js
import User from '../models/userModel.js';

// Get the current user's profile (read-only for Voters and Admins)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user profile', error: error.message });
  }
};
