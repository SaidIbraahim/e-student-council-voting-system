import Vote from '../models/voteModel.js';
import Election from '../models/electionModel.js';
import Candidate from '../models/candidateModel.js'; // Assuming a Candidate model exists

// Cast a vote (Voter only)
export const castVote = async (req, res) => {
  const { candidateId, electionId } = req.body;
  const voterId = req.user._id;

  try {
    // Check if the election is ongoing
    const election = await Election.findById(electionId);
    if (!election || new Date() < new Date(election.startDate) || new Date() > new Date(election.endDate)) {
      return res.status(400).json({ message: 'Election is not ongoing' });
    }

    // Check if the voter has already voted in this election
    const existingVote = await Vote.findOne({ voterId, electionId });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    // Check if the candidate is approved
    const candidate = await Candidate.findById(candidateId);
    if (!candidate || candidate.approvalStatus !== 'approved') {
      return res.status(400).json({ message: 'Invalid or unapproved candidate' });
    }

    // Cast the vote
    const newVote = new Vote({ voterId, candidateId, electionId });
    await newVote.save();

    res.status(201).json({ message: 'Vote cast successfully', vote: newVote });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cast vote', error: error.message });
  }
};
