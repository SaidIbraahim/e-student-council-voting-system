// index.js
import express from 'express';
import http from 'http'; // Import HTTP module to create a server
import { Server } from 'socket.io'; // Import Socket.IO
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import electionRoutes from './routes/electionRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity; adjust for production as needed
  },
});

// Middleware to parse JSON
app.use(express.json());

// API Routes

app.use('/api/admin', adminRoutes);      // Admin routes
app.use('/api/auth', authRoutes);          // Authentication routes
app.use('/api/elections', electionRoutes);  // Election routes
app.use('/api/candidates', candidateRoutes); // Candidate routes
app.use('/api/votes', voteRoutes);          // Voting routes
app.use('/api/users', userRoutes);          // User routes


// Pass `io` to your result routes
app.use('/api/results', (req, res, next) => {
  console.log(`API hit: ${req.method} ${req.originalUrl}`);
  req.io = io;
  next();
}, resultRoutes); // Result routes

// Socket.IO setup for real-time result updates
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for result update events from the server-side logic
  socket.on('newVote', (data) => {
    // Broadcast the new vote or result update to all connected clients
    io.emit('liveResults', data);
    console.log('Live result update broadcasted:', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
