const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/accountController');
const { body, validationResult } = require('express-validator');
const { cacheMiddleware } = require('../middleware/cache');
const { strictLimiter, createAccountLimiter } = require('../middleware/rateLimiter');

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details: errors.array()
    });
  }
  next();
};

// Validation middleware
const validateDeposit = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().isString().trim(),
  handleValidationErrors
];

const validateWithdraw = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().isString().trim(),
  handleValidationErrors
];

const validateCreateAccount = [
  body('currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  handleValidationErrors
];

// Routes with rate limiting
router.get('/', cacheMiddleware(60), AccountController.getAllAccounts);
router.post('/', createAccountLimiter, validateCreateAccount, AccountController.createAccount);
router.get('/:id', cacheMiddleware(300), AccountController.getAccount);
router.post('/:id/deposit', strictLimiter, validateDeposit, AccountController.deposit);
router.post('/:id/withdraw', strictLimiter, validateWithdraw, AccountController.withdraw);
router.get('/:id/transactions', cacheMiddleware(60), AccountController.getTransactions);

module.exports = router;
