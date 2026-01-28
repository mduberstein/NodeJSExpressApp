const pool = require('../config/database');

class Account {
  static async create(userId, accountNumber, currency = 'USD') {
    const query = `
      INSERT INTO accounts (user_id, account_number, balance, currency, status)
      VALUES ($1, $2, 0.00, $3, 'active')
      RETURNING *
    `;
    
    const result = await pool.query(query, [userId, accountNumber, currency]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM accounts WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM accounts WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByAccountNumber(accountNumber) {
    const query = 'SELECT * FROM accounts WHERE account_number = $1';
    const result = await pool.query(query, [accountNumber]);
    return result.rows[0];
  }

  static async deposit(accountId, amount, description = 'Deposit') {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update account balance
      const updateQuery = `
        UPDATE accounts 
        SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
      const result = await client.query(updateQuery, [amount, accountId]);
      const account = result.rows[0];

      // Record transaction
      const transactionQuery = `
        INSERT INTO transactions (account_id, transaction_type, amount, balance_after, description)
        VALUES ($1, 'deposit', $2, $3, $4)
        RETURNING *
      `;
      await client.query(transactionQuery, [
        accountId,
        amount,
        account.balance,
        description
      ]);

      await client.query('COMMIT');
      return account;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async withdraw(accountId, amount, description = 'Withdrawal') {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Check current balance
      const balanceQuery = 'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE';
      const balanceResult = await client.query(balanceQuery, [accountId]);
      
      if (!balanceResult.rows[0]) {
        throw new Error('Account not found');
      }

      const currentBalance = parseFloat(balanceResult.rows[0].balance);
      
      if (currentBalance < amount) {
        throw new Error('Insufficient funds');
      }

      // Update account balance
      const updateQuery = `
        UPDATE accounts 
        SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
      const result = await client.query(updateQuery, [amount, accountId]);
      const account = result.rows[0];

      // Record transaction
      const transactionQuery = `
        INSERT INTO transactions (account_id, transaction_type, amount, balance_after, description)
        VALUES ($1, 'withdrawal', $2, $3, $4)
        RETURNING *
      `;
      await client.query(transactionQuery, [
        accountId,
        amount,
        account.balance,
        description
      ]);

      await client.query('COMMIT');
      return account;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getTransactions(accountId, limit = 10) {
    const query = `
      SELECT * FROM transactions 
      WHERE account_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    const result = await pool.query(query, [accountId, limit]);
    return result.rows;
  }
}

module.exports = Account;
