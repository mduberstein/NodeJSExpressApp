const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details
    });
  }

  // Handle JWT authentication errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token'
    });
  }

  // Handle database errors
  if (err.code === '23505') { // Unique violation
    return res.status(409).json({
      error: 'Conflict',
      message: 'Resource already exists'
    });
  }

  // Handle insufficient funds
  if (err.message === 'Insufficient funds') {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
};

module.exports = errorHandler;
