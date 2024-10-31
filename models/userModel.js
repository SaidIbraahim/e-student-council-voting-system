// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  universityId: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Voter', 'Admin', 'Super Admin'], default: 'Voter' },
  Dept: { type: String, required: true },
  academicYear: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  profileImage: { type: String } // Optional field for Admins
});

const User = mongoose.model('User', userSchema);

export default User;
