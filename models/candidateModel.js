// models/candidateModel.js
import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  faculty: { type: String, required: true },
  details: { type: String },
  manifesto: { type: String },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidateImage: { type: String, required: true } // Required field for candidate images
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
