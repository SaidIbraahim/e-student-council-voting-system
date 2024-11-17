import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import User from '../../models/userModel.js';

// Invite Sub-Admin
export const inviteSubAdmin = async (req, res) => {
  const { name, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'Admin',
      status: 'active',
    });

    await newAdmin.save();

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
      subject: 'Admin Invitation',
      text: `You have been invited as an Admin. Your temporary password is ${tempPassword}. Please log in and change your password.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Sub-admin invited successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to invite sub-admin', error: error.message });
  }
};
