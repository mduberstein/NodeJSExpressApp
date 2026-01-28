const { auth } = require('express-oauth2-jwt-bearer');
require('dotenv').config();

// Auth0 JWT verification middleware
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

// Optional: For development, you can bypass auth
const optionalAuth = (req, res, next) => {
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    // For development without Auth0 setup, use a mock user
    req.auth = {
      sub: req.headers['x-user-id'] || 'dev-user-001',
      payload: {}
    };
    return next();
  }
  
  return jwtCheck(req, res, next);
};

module.exports = { jwtCheck, optionalAuth };
