import { useState, useEffect } from 'react';
import './TransactionHistory.css';

function TransactionHistory({ accountId, userId, refreshTrigger }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchTransactions();
  }, [accountId, refreshTrigger, limit]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/accounts/${accountId}/transactions?limit=${limit}`,
        {
          headers: {
            'X-User-Id': userId,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch transactions');
      }

      setTransactions(data.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="transaction-history">
      <div className="history-controls">
        <label htmlFor="limit">Show:</label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
        >
          <option value="5">Last 5</option>
          <option value="10">Last 10</option>
          <option value="20">Last 20</option>
          <option value="50">Last 50</option>
        </select>
      </div>

      {transactions.length === 0 ? (
        <p className="no-transactions">No transactions yet</p>
      ) : (
        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`transaction-item ${transaction.transaction_type}`}
            >
              <div className="transaction-icon">
                {transaction.transaction_type === 'deposit' ? '📥' : '📤'}
              </div>
              <div className="transaction-details">
                <div className="transaction-description">
                  {transaction.description}
                </div>
                <div className="transaction-date">
                  {new Date(transaction.created_at).toLocaleString()}
                </div>
              </div>
              <div className="transaction-amount">
                <span
                  className={`amount ${transaction.transaction_type}`}
                >
                  {transaction.transaction_type === 'deposit' ? '+' : '-'}
                  {parseFloat(transaction.amount).toFixed(2)}
                </span>
                <div className="balance-after">
                  Balance: {parseFloat(transaction.balance_after).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;
