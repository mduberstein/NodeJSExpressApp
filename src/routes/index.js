const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Banking API',
    version: '1.0.0',
    description: 'RESTful API for banking operations',
    endpoints: {
      accounts: {
        create: 'POST /api/accounts',
        get: 'GET /api/accounts/:id',
        deposit: 'POST /api/accounts/:id/deposit',
        withdraw: 'POST /api/accounts/:id/withdraw',
        transactions: 'GET /api/accounts/:id/transactions'
      }
    },
    authentication: 'OAuth2/OIDC (Auth0)',
    documentation: 'See README.md for setup and usage'
  });
});

module.exports = router;
