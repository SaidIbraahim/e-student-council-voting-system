// controllers/resultController.js
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Vote from '../models/voteModel.js';
import Candidate from '../models/candidateModel.js';
import Election from '../models/electionModel.js';
import { createObjectCsvWriter } from 'csv-writer';

export const calculateResults = async (req, res) => {
  const { electionId } = req.params;

  try {
    // Check if the election exists and is completed
    const election = await Election.findById(electionId);
    if (!election || new Date() < new Date(election.endDate)) {
      return res.status(400).json({ message: 'Election is either ongoing or does not exist' });
    }

    // Count votes for each candidate in the election
    const results = await Vote.aggregate([
      { $match: { electionId: new mongoose.Types.ObjectId(election._id) } },
      { $group: { _id: "$candidateId", totalVotes: { $sum: 1 } } },
      { $sort: { totalVotes: -1 } }
    ]);

    // Find the winner (candidate with the highest votes)
    const winnerId = results[0]?._id || null;
    const winner = winnerId ? await Candidate.findById(winnerId) : null;

    res.status(200).json({
      electionId,
      results,
      winner: winner ? { fullName: winner.fullName, totalVotes: results[0].totalVotes } : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to calculate results', error: error.message });
  }
};


//Generate report


export const generateReport = async (req, res) => {
  const { electionId } = req.params;

  try {
    // Check if the election exists
    const election = await Election.findById(electionId);
    if (!election) {
      console.log('Election not found');
      return res.status(404).json({ message: 'Election not found' });
    }

    console.log('Election found:', election);

    // Aggregate votes for each candidate in the specified election
    const results = await Vote.aggregate([
      { $match: { electionId: new mongoose.Types.ObjectId(election._id) } },
      { $group: { _id: "$candidateId", totalVotes: { $sum: 1 } } },
      { $sort: { totalVotes: -1 } }
    ]);

    console.log('Aggregated vote results:', results);

    // Create reports directory if it doesn't exist
    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
      console.log('Reports directory created:', reportDir);
    } else {
      console.log('Reports directory already exists:', reportDir);
    }

    // Define file path for CSV report
    const reportPath = path.join(reportDir, `election_${electionId}_results.csv`);
    console.log('Report file path:', reportPath);

    // Prepare CSV data with additional information
    const csvWriter = createObjectCsvWriter({
      path: reportPath,
      header: [
        { id: 'candidateName', title: 'Candidate Name' },
        { id: 'electionName', title: 'Election Name' },
        { id: 'electionDate', title: 'Election Date' },
        { id: 'totalVotes', title: 'Total Votes' }
      ]
    });

    const candidateResults = await Promise.all(results.map(async (result) => {
      const candidate = await Candidate.findById(result._id);
      return {
        candidateName: candidate ? candidate.fullName : 'Unknown',
        electionName: election.name,
        electionDate: election.startDate.toISOString().split('T')[0],  // Format date as YYYY-MM-DD
        totalVotes: result.totalVotes
      };
    }));

    console.log('Candidate results data:', candidateResults);

    // Write data to CSV
    await csvWriter.writeRecords(candidateResults);
    console.log('CSV file written successfully at', reportPath);

    // Verify if the file exists before attempting download
    if (fs.existsSync(reportPath)) {
      console.log('Report file exists. Ready for download.');
      res.download(reportPath, `election_${electionId}_results.csv`, (err) => {
        if (err) {
          console.error('Error sending the file:', err);
          res.status(500).json({ message: 'Error downloading the file' });
        }
      });
    } else {
      console.error('Report file was not found after write operation.');
      res.status(500).json({ message: 'Report file was not created successfully' });
    }
  } catch (error) {
    console.error('Error in generateReport function:', error);
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
};
