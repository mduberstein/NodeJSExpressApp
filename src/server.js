const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { optionalAuth } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const { connectRedis, closeRedis } = require('./config/redis');
const pool = require('./config/database');
const indexRoutes = require('./routes/index');
const accountRoutes = require('./routes/accounts');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Public routes (no authentication required)
app.use('/', indexRoutes);

// Protected routes (authentication required)
app.use('/api/accounts', optionalAuth, accountRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received, shutting down gracefully...`);
  
  try {
    // Close Redis connection
    await closeRedis();
    
    // Close database pool
    await pool.end();
    console.log('Database connection closed');
    
    console.log('Shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Initialize connections and start server
const startServer = async () => {
  try {
    // Connect to Redis
    await connectRedis();
    console.log('Connected to Redis');

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                    Banking API Server                      ║
║                                                            ║
║  Server is running on port ${PORT}                           ║
║  Environment: ${process.env.NODE_ENV || 'development'}                                ║
║                                                            ║
║  Endpoints:                                                ║
║  - GET  /                  - API information               ║
║  - GET  /health            - Health check                  ║
║  - POST /api/accounts      - Create account                ║
║  - GET  /api/accounts/:id  - Get account details           ║
║  - POST /api/accounts/:id/deposit   - Deposit money        ║
║  - POST /api/accounts/:id/withdraw  - Withdraw money       ║
║  - GET  /api/accounts/:id/transactions - Get transactions  ║
║                                                            ║
║  Documentation: http://localhost:${PORT}                       ║
╚════════════════════════════════════════════════════════════╝
      `);

      if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
        console.log('\n⚠️  WARNING: Authentication is bypassed in development mode');
        console.log('   Set BYPASS_AUTH=false or configure AUTH0 for production\n');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();

module.exports = app;
