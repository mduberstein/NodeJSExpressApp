const Account = require('../models/Account');
const { clearCache } = require('../middleware/cache');

class AccountController {
  // Create a new account
  static async createAccount(req, res, next) {
    try {
      const userId = req.auth.sub; // Get user ID from JWT token
      const { currency } = req.body;

      // Generate account number
      const accountNumber = AccountController.generateAccountNumber();

      // Create account
      const account = await Account.create(userId, accountNumber, currency || 'USD');

      // Clear cache
      await clearCache(`cache:/api/accounts/${account.id}*`);

      res.status(201).json({
        message: 'Account created successfully',
        data: {
          id: account.id,
          accountNumber: account.account_number,
          balance: account.balance,
          currency: account.currency,
          status: account.status,
          createdAt: account.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all accounts for the authenticated user
  static async getAllAccounts(req, res, next) {
    try {
      const userId = req.auth.sub;

      const accounts = await Account.findAllByUserId(userId);

      res.json({
        data: accounts.map(account => ({
          id: account.id,
          accountNumber: account.account_number,
          balance: account.balance,
          currency: account.currency,
          status: account.status,
          createdAt: account.created_at,
          updatedAt: account.updated_at
        }))
      });
    } catch (error) {
      next(error);
    }
  }

  // Get account details
  static async getAccount(req, res, next) {
    try {
      const accountId = parseInt(req.params.id);
      const userId = req.auth.sub;

      const account = await Account.findById(accountId);

      if (!account) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Account not found'
        });
      }

      // Ensure user can only access their own account
      if (account.user_id !== userId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have access to this account'
        });
      }

      res.json({
        data: {
          id: account.id,
          accountNumber: account.account_number,
          balance: account.balance,
          currency: account.currency,
          status: account.status,
          createdAt: account.created_at,
          updatedAt: account.updated_at
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Deposit money
  static async deposit(req, res, next) {
    try {
      const accountId = parseInt(req.params.id);
      const userId = req.auth.sub;
      const { amount, description } = req.body;

      // Get account and verify ownership
      const account = await Account.findById(accountId);

      if (!account) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Account not found'
        });
      }

      if (account.user_id !== userId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have access to this account'
        });
      }

      if (account.status !== 'active') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Account is not active'
        });
      }

      // Perform deposit
      const updatedAccount = await Account.deposit(
        accountId,
        parseFloat(amount),
        description || 'Deposit'
      );

      // Clear cache
      await clearCache(`cache:/api/accounts/${accountId}*`);

      res.json({
        message: 'Deposit successful',
        data: {
          id: updatedAccount.id,
          accountNumber: updatedAccount.account_number,
          balance: updatedAccount.balance,
          currency: updatedAccount.currency,
          updatedAt: updatedAccount.updated_at
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Withdraw money
  static async withdraw(req, res, next) {
    try {
      const accountId = parseInt(req.params.id);
      const userId = req.auth.sub;
      const { amount, description } = req.body;

      // Get account and verify ownership
      const account = await Account.findById(accountId);

      if (!account) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Account not found'
        });
      }

      if (account.user_id !== userId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have access to this account'
        });
      }

      if (account.status !== 'active') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Account is not active'
        });
      }

      // Perform withdrawal
      const updatedAccount = await Account.withdraw(
        accountId,
        parseFloat(amount),
        description || 'Withdrawal'
      );

      // Clear cache
      await clearCache(`cache:/api/accounts/${accountId}*`);

      res.json({
        message: 'Withdrawal successful',
        data: {
          id: updatedAccount.id,
          accountNumber: updatedAccount.account_number,
          balance: updatedAccount.balance,
          currency: updatedAccount.currency,
          updatedAt: updatedAccount.updated_at
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get account transactions
  static async getTransactions(req, res, next) {
    try {
      const accountId = parseInt(req.params.id);
      const userId = req.auth.sub;
      const limit = parseInt(req.query.limit) || 10;

      // Get account and verify ownership
      const account = await Account.findById(accountId);

      if (!account) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Account not found'
        });
      }

      if (account.user_id !== userId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have access to this account'
        });
      }

      const transactions = await Account.getTransactions(accountId, limit);

      res.json({
        data: transactions
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper function to generate account numbers
  static generateAccountNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ACC${timestamp.slice(-8)}${random}`;
  }
}

module.exports = AccountController;
