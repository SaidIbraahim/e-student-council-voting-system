// models/electionModel.js
import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  candidateSubmissionDeadline: { type: Date, required: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' }
}, { timestamps: true });

const Election = mongoose.model('Election', electionSchema);

export default Election;
