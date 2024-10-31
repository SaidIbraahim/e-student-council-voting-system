// index.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import electionRoutes from './routes/electionRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);          // Authentication routes
app.use('/api/elections', electionRoutes);  // Election routes
app.use('/api/candidates', candidateRoutes); // Candidate routes
app.use('/api/votes', voteRoutes);          // Voting routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/results', resultRoutes); // Result Routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
