// controllers/candidateController.js
import Candidate from '../models/candidateModel.js';

// Add a new candidate
export const addCandidate = async (req, res) => {
  const { fullName, faculty, details, manifesto } = req.body;
  const candidateImage = req.file ? req.file.path : null; // Get the uploaded file path

  if (!candidateImage) {
    return res.status(400).json({ message: 'Candidate image is required' });
  }

  try {
    const newCandidate = new Candidate({
      fullName,
      faculty,
      details,
      manifesto,
      approvalStatus: 'pending',
      submittedByAdminId: req.user._id,
      candidateImage
    });

    await newCandidate.save();
    res.status(201).json({ message: 'Candidate added successfully', candidate: newCandidate });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add candidate', error: error.message });
  }
};


// Approve or reject a candidate
export const approveCandidate = async (req, res) => {
    const { candidateId, approvalStatus } = req.body; // approvalStatus should be 'approved' or 'rejected'
  
    if (!['approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({ message: 'Invalid approval status' });
    }
  
    try {
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
  
      candidate.approvalStatus = approvalStatus;
      await candidate.save();
  
      res.status(200).json({ message: `Candidate ${approvalStatus} successfully`, candidate });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update candidate status', error: error.message });
    }
  };
  
// Get all candidates
export const getAllCandidates = async (req, res) => {
    const { approvalStatus } = req.query;
  
    try {
      let query = {};
      if (approvalStatus) {
        query.approvalStatus = approvalStatus;
      }
  
      const candidates = await Candidate.find(query);
      res.status(200).json(candidates);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch candidates', error: error.message });
    }
  };
  