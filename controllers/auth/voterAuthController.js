import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import { sendSMSVerification } from '../../utils/twilioVerify.js';
import StudentRecord from '../../models/studentRecordModel.js';

// Voter Registration
export const registerVoter = async (req, res) => {
  const { studentId, name, gender, department, year, mobile, password } = req.body;

  try {
    // Check if the student is eligible by querying the StudentRecord collection
    const student = await StudentRecord.findOne({ studentId, status: 'active' });
    if (!student) {
      // Return an error if the student ID is not found or not active
      return res.status(400).json({ message: 'Student ID not eligible for registration' });
    }

    // Check if the mobile number is already registered in the User collection
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    // Hash the password before storing the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      studentId,
      name,
      gender,
      department,
      year,
      mobile,
      password: hashedPassword,
      role: 'Voter',
      status: 'pending', // Set initial status to pending until verification
    });

    // Save the new user to the database
    await newUser.save();

    // Send SMS verification to the provided mobile number
    await sendSMSVerification(mobile);

    // Respond with a success message
    res.status(201).json({ message: 'Voter registered successfully. Verify your mobile number to complete registration.' });
  } catch (error) {
    // Handle any errors during the registration process
    res.status(500).json({ message: 'Failed to register voter', error: error.message });
  }
};
