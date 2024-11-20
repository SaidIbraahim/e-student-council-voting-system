// controllers/auth/voterAuthController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import { sendSMSVerification } from '../../utils/twilioVerify.js';
import StudentRecord from '../../models/studentRecordModel.js';

export function formatSomaliaMobileNumber(mobile) {
  // Remove any non-digit characters
  const digitsOnly = mobile.replace(/\D/g, '');

  // Check if the number starts with the country code
  if (digitsOnly.startsWith('252')) {
    // If it starts with 252, ensure it has 12 digits in total
    return digitsOnly.length === 12 ? `+${digitsOnly}` : null;
  } else {
    // If it doesn't start with 252, assume it's a local number and add the country code
    return digitsOnly.length === 9 ? `+252${digitsOnly}` : null;
  }
}

// Voter Registration
export const registerVoter = async (req, res) => {
  const { studentId, name, gender, department, year, mobile, password } = req.body;

  try {
    // Step 1: Validate student ID eligibility
    const student = await StudentRecord.findOne({ studentId, status: 'active' });
    console.log('Student Record Query Result:', student);

    if (!student) {
      // Return an error if the student ID is not found or inactive
      return res.status(400).json({ message: 'Student ID not eligible for registration' });
    }

    // Format the mobile number
    const formattedMobile = formatSomaliaMobileNumber(mobile);

    // Check if the formatted number is valid
    if (!formattedMobile) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    // Step 2: Check if the mobile number is already registered
    const existingUser = await User.findOne({ mobile: formattedMobile });
    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    // Step 3: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      studentId,
      name,
      gender,
      department,
      year,
      mobile: formattedMobile, // Use the formatted mobile number
      password: hashedPassword,
      role: 'Voter',
      status: 'pending', // Initial status set to pending until verification
    });

    // Step 4: Send SMS verification to the provided mobile number
    await sendSMSVerification(formattedMobile);

    // Step 5: Save the new user to the database
    await newUser.save();

    // Step 6: Respond with a success message
    res.status(201).json({ message: 'Voter registered successfully. Verify your mobile number to complete registration.' });
  } catch (error) {
    // Handle any errors during the registration process
    console.error('Error during voter registration:', error);
    res.status(500).json({ message: 'Failed to register voter', error: error.message });
  }
};

// Voter Login
export const loginVoter = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const formattedMobile = formatSomaliaMobileNumber(mobile);
    if (!formattedMobile) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    // Step 1: Find user by mobile number and role
    const user = await User.findOne({ mobile: formattedMobile, role: 'Voter' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    // Step 2: Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    // Step 3: Send SMS verification for login
    await sendSMSVerification(formattedMobile);
    res.status(200).json({ 
      message: 'OTP sent to your registered mobile number. Verify to complete login.',
      mobile: formattedMobile // Send the formatted mobile number back to the client
    });
  } catch (error) {
    console.error('Error during voter login:', error);
    res.status(500).json({ message: 'Failed to log in', error: error.message });
  }
};