// controllers/userController.js
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// Get the current user's profile (read-only for Voters)
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
  

// Super Admin creates an Admin
export const createAdmin = async (req, res) => {
  const { fullName, universityId, Dept, email, password } = req.body;

  try {
    // Check if the email or universityId is already in use
    const existingUser = await User.findOne({ $or: [{ email }, { universityId }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or university ID already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Admin user
    const newAdmin = new User({
      fullName,
      universityId,
      Dept,
      email,
      password: hashedPassword,
      role: 'Admin',
      status: 'active'
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create admin', error: error.message });
  }
};
