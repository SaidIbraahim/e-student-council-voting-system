// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, unique: true, sparse: true }, // Optional for Admins, required for Voters
  email: { type: String, unique: true, required: function() { return this.role !== 'Voter'; } }, // Required for Admins
  department: { type: String, required: true },
  academicYear: { type: String }, // Optional for Admins
  mobile: { type: String, unique: true, required: true }, // Required for Voter verification
  password: { type: String, required: true },
  role: { type: String, enum: ['Voter', 'Admin', 'Super Admin'], default: 'Voter' },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
  profileImage: { type: String }, // Optional for Admins
});

const User = mongoose.model('User', userSchema);

export default User;
