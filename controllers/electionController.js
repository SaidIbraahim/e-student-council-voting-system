// controllers/electionController.js
import Election from '../models/electionModel.js';

// Create a new election (Super Admin only)
export const createElection = async (req, res) => {
  const { name, startDate, endDate, candidateSubmissionDeadline } = req.body;

  try {
    const newElection = new Election({
      name,
      startDate,
      endDate,
      candidateSubmissionDeadline,
      status: new Date() < new Date(startDate) ? 'upcoming' : 'ongoing'
    });

    await newElection.save();
    res.status(201).json({ message: 'Election created successfully', election: newElection });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create election', error: error.message });
  }
};
