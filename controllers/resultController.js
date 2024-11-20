// controllers/resultController.js
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Vote from '../models/voteModel.js';
import Candidate from '../models/candidateModel.js';
import Election from '../models/electionModel.js';
import { createObjectCsvWriter } from 'csv-writer';

//calculate results
export const calculateResults = async (req, res) => {
  const { electionId } = req.params;

  try {
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    if (new Date() < new Date(election.endDate)) {
      return res.status(400).json({ message: 'Election is still ongoing. Results cannot be calculated yet.' });
    }

    const results = await Vote.aggregate([
      { $match: { electionId: new mongoose.Types.ObjectId(election._id) } },
      { $group: { _id: "$candidateId", totalVotes: { $sum: 1 } } },
      { $sort: { totalVotes: -1 } }
    ]);

    const detailedResults = await Promise.all(
      results.map(async (result) => {
        const candidate = await Candidate.findById(result._id);
        return {
          candidateId: result._id,
          fullName: candidate ? candidate.fullName : 'Unknown Candidate',
          department: candidate ? candidate.department : 'Unknown Department', // Include department
          totalVotes: result.totalVotes
        };
      })
    );

    const winner = detailedResults[0] || null;

    req.io.emit('liveResults', {
      electionId,
      results: detailedResults,
      winner,
    });

    res.status(200).json({
      electionId,
      results: detailedResults,
      winner,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to calculate results', error: error.message });
  }
};


// Generate Report API
// Generate Report API
export const generateReport = async (req, res) => {
  let { electionId } = req.params;
  electionId = electionId.trim(); // Sanitize the electionId to remove any unexpected characters or whitespace

  try {
    // Check if the election exists
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Aggregate votes for the given election
    const results = await Vote.aggregate([
      { $match: { electionId: new mongoose.Types.ObjectId(election._id) } },
      { $group: { _id: "$candidateId", totalVotes: { $sum: 1 } } },
      { $sort: { totalVotes: -1 } }
    ]);

    // Ensure the reports directory exists
    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
    }

    // Define the path for the report file
    const reportPath = path.join(reportDir, `election_${electionId}_results.csv`);

    // Configure the CSV writer
    const csvWriter = createObjectCsvWriter({
      path: reportPath,
      header: [
        { id: 'candidateName', title: 'Candidate Name' },
        { id: 'department', title: 'Department' },
        { id: 'electionName', title: 'Election Name' },
        { id: 'electionDate', title: 'Election Date' },
        { id: 'totalVotes', title: 'Total Votes' }
      ]
    });

    // Prepare candidate data for the CSV
    const candidateResults = await Promise.all(
      results.map(async (result) => {
        const candidate = await Candidate.findById(result._id);
        return {
          candidateName: candidate ? candidate.fullName : 'Unknown Candidate',
          department: candidate ? candidate.department : 'Unknown Department',
          electionName: election.name,
          electionDate: election.startDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
          totalVotes: result.totalVotes
        };
      })
    );

    // Write data to the CSV file
    await csvWriter.writeRecords(candidateResults);

    // Emit a real-time report notification
    req.io.emit('reportGenerated', {
      electionId,
      reportPath: `/reports/election_${electionId}_results.csv`
    });

    // Send the report file for download
    res.download(reportPath, `election_${electionId}_results.csv`, (err) => {
      if (err) {
        console.error('Error sending report file:', err);
        res.status(500).json({ message: 'Failed to send report file' });
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
};
