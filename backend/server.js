const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/ngos', require('./routes/ngoRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Bhojan Setu API is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Bhojan Setu API',
    version: '1.0.0',
    endpoints: {
      donors: '/api/donors',
      ngos: '/api/ngos',
      donations: '/api/donations'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});

// Handle port already in use error
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use!`);
    console.log(`\n💡 Solutions:`);
    console.log(`   1. Kill the process using port ${PORT}:`);
    console.log(`      Windows: netstat -ano | findstr :${PORT}`);
    console.log(`      Then: taskkill /PID <PID> /F`);
    console.log(`   2. Or change the port in .env file: PORT=5001`);
    console.log(`\n🔍 Finding process on port ${PORT}...\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

module.exports = app;

