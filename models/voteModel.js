// models/voteModel.js
import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  voterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  voteTimestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
