// models/invitedUserModel.js
import mongoose from 'mongoose';

const invitedUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String },
  tempPassword: { type: String, required: true },
  invitedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 } // Expires in 24 hours
});

export default mongoose.model('InvitedUser', invitedUserSchema);
