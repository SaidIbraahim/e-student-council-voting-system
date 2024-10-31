// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Mock function to check against student records (replace with actual implementation)
const verifyStudentRecord = async (universityId) => {
    // In a real scenario, this function should check the "Student Records" collection
    // Here, we assume all students are eligible for demo purposes
    return true; // Replace with actual check
  };

// Register a new user
export const registerUser = async (req, res) => {
  const { fullName, universityId, Dept, academicYear, email, password } = req.body;

  try {
    // Check if the university ID is already registered
    const existingUser = await User.findOne({ universityId });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with status "active" since verification passed
    const newUser = new User({
      fullName,
      universityId,
      Dept,
      academicYear,
      email,
      password: hashedPassword,
      role: 'Voter',
      status: 'active'
    });

    await newUser.save();

    // Create a token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};



// Login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Create a token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  };
  