const pool = require('./database');

const initializeDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Creating database tables...');
    
    // Create accounts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        account_number VARCHAR(20) UNIQUE NOT NULL,
        balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
        status VARCHAR(20) DEFAULT 'active' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (balance >= 0)
      )
    `);
    
    // Create transactions table for audit trail
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
        transaction_type VARCHAR(20) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        balance_after DECIMAL(15, 2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create index for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id)
    `);
    
    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
