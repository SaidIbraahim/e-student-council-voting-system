// controllers/auth/adminAuthController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../../models/userModel.js';
import InvitedUser from '../../models/invitedUserModel.js';

export const inviteSubAdmin = async (req, res) => {
  const { name, email, department } = req.body;

  try {
    // Check if the email is already registered in Users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if the email already has a pending invitation
    const existingInvite = await InvitedUser.findOne({ email });
    if (existingInvite && existingInvite.expiresAt > Date.now()) {
      return res.status(400).json({ message: 'An active invitation already exists for this email' });
    }

    // Generate a temporary password for the invited sub-admin
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Save invitation details in the InvitedUser collection
    const newInvite = new InvitedUser({
      name,
      email,
      department,
      tempPassword: hashedPassword
    });
    await newInvite.save();

    // Configure the email transport using Gmail
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER, // Gmail address from .env
        pass: process.env.EMAIL_PASS, // App Password from .env
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Admin Invitation - E-voting System',
      text: `Dear ${name},
    
    You have been invited to join the E-voting System as an Admin.
    
    Your login credentials are as follows:
    - Username: ${email}
    - Temporary password: ${tempPassword}
    
    To activate your account and log in, please visit: http://eau-student-e-voting-system.com/login
    
    This invitation is valid for 24 hours. After that, it will expire.
    
    Best regards,
    E-voting System Team`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Sub-admin invited successfully. The invitation is valid for 24 hours.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to invite sub-admin', error: error.message });
  }
};

//login admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the InvitedUsers collection
    const invitedUser = await InvitedUser.findOne({ email });
    if (invitedUser) {
      if (invitedUser.expiresAt < Date.now()) {
        // If the invitation has expired
        await InvitedUser.deleteOne({ email });
        return res.status(403).json({ message: 'Invitation expired. Please contact the admin for a new invitation.' });
      }

      // Check if the provided password matches the temporary password
      const isPasswordMatch = await bcrypt.compare(password, invitedUser.tempPassword);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Activate the invited user by creating a new entry in the User collection
      const newUser = new User({
        name: invitedUser.name,
        email: invitedUser.email,
        department: invitedUser.department,
        password: invitedUser.tempPassword,
        role: 'Admin',
        status: 'active',
      });
      await newUser.save();

      // Delete the entry from InvitedUsers
      await InvitedUser.deleteOne({ email });

      return res.status(201).json({ message: 'Account activated successfully. Please log in with your credentials.' });
    }

    // If the user is already an active Admin/Super Admin
    const admin = await User.findOne({ email, role: { $in: ['Admin', 'Super Admin'] } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a token
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Failed to log in', error: error.message });
  }
};
