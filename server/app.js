import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import githubRoutes from './routes/githubRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();

// Standard middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/github', githubRoutes);

// Catch-all route for unmatched API requests
app.use('*', (req, res, next) => {
  const err = new Error('Resource not found');
  err.status = 404;
  next(err);
});

// Centralized error handling
app.use(errorHandler);

export default app;
