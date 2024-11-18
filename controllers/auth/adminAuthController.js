// controllers/auth/adminAuthController.js
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import User from '../../models/userModel.js';


// Create an Admin directly (Super Admin only)
export const createAdmin = async (req, res) => {
  const { name, email, password, department } = req.body;

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Admin user
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      department,
      role: 'Admin',
      status: 'active',
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create admin', error: error.message });
  }
};

// Invite Sub-Admin via Email (Super Admin only)
export const inviteSubAdmin = async (req, res) => {
  const { name, email, department } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate a temporary password for the invited sub-admin
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create sub-admin user entry with a temporary password
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      department,
      role: 'Admin',
      status: 'active',
    });

    await newAdmin.save();

    // Configure the email transport and send the invitation
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Admin Invitation - E-voting System',
      text: `You have been invited as an Admin. Your temporary password is ${tempPassword}. Please log in and change your password.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Sub-admin invited successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to invite sub-admin', error: error.message });
  }
};
