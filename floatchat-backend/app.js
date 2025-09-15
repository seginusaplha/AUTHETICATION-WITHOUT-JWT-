const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/database');
//const routes = require('./src/routes');
const authRoutes =require("./src/routes/authRoutes.js");
const errorHandler = require('./src/middleware/errorHandler');
const rateLimit = require('./src/middleware/rateLimit');
const security = require('./src/middleware/security');
const logger = require('./src/config/logger');

const app = express();

// Trust proxy for rate limiting in Replit environment
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(security);

// CORS configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'https://0b4dfc6a-92d5-4e3d-9786-ec5904e7c26f-00-1s00ap00vc9p7.pike.replit.dev',
  'http://localhost:5000',
  'http://0.0.0.0:5000'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
app.use(rateLimit);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', require('./src/routes/chatRoutes'));

// Catch 404 and forward to error handler
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
