import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { Server } from 'socket.io';
import http from 'http';

// Load environment variables
dotenv.config();

// Import route files
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Initialize app
const app = express();
const PORT =  5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST'],
  },
});



// socket.io
global.io = io;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId); // Join room by user ID for direct messaging
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cors());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// API documentation route
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Freelance Platform API',
    version: '1.0.0',
    documentation: {
      endpoints: [
        { path: '/api/auth', description: 'Authentication endpoints' },
        { path: '/api/users', description: 'User management endpoints' },
        { path: '/api/jobs', description: 'Job posting and management endpoints' },
        { path: '/api/bids', description: 'Bid submission and management endpoints' },
        { path: '/api/reviews', description: 'Review creation and management endpoints' },
        { path: '/api/messages', description: 'Messaging system endpoints' },
        { path: '/api/payments', description: 'Payment processing endpoints' },
        { path: '/api/categories', description: 'Job categories endpoints' },
        { path: '/api/admin', description: 'Admin only endpoints' }
      ]
    }
  });
});

// API health route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    time: new Date()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ 
    success: false, 
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;