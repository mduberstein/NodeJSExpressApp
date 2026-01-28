const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/accountController');
const { body } = require('express-validator');
const { cacheMiddleware } = require('../middleware/cache');

// Validation middleware
const validateDeposit = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().isString().trim()
];

const validateWithdraw = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().isString().trim()
];

const validateCreateAccount = [
  body('currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters')
];

// Routes
router.post('/', validateCreateAccount, AccountController.createAccount);
router.get('/:id', cacheMiddleware(300), AccountController.getAccount);
router.post('/:id/deposit', validateDeposit, AccountController.deposit);
router.post('/:id/withdraw', validateWithdraw, AccountController.withdraw);
router.get('/:id/transactions', cacheMiddleware(60), AccountController.getTransactions);

module.exports = router;
