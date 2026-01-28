const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/accountController');
const { body, validationResult } = require('express-validator');
const { cacheMiddleware } = require('../middleware/cache');

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

// Routes
router.post('/', validateCreateAccount, AccountController.createAccount);
router.get('/:id', cacheMiddleware(300), AccountController.getAccount);
router.post('/:id/deposit', validateDeposit, AccountController.deposit);
router.post('/:id/withdraw', validateWithdraw, AccountController.withdraw);
router.get('/:id/transactions', cacheMiddleware(60), AccountController.getTransactions);

module.exports = router;
