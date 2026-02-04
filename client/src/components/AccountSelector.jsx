import { useState, useEffect } from 'react';
import './AccountSelector.css';

function AccountSelector({ userId, onAccountSelected, onCreateNew }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/accounts', {
          headers: {
            'X-User-Id': userId,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch accounts');
        }

        setAccounts(data.data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAccounts();
    }
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading accounts...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => window.location.reload()} className="btn-secondary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="account-selector">
      <h2>Select an Account</h2>
      
      {accounts.length === 0 ? (
        <div className="no-accounts">
          <p>You don't have any accounts yet.</p>
          <p className="subtitle">Create your first account to get started.</p>
        </div>
      ) : (
        <div className="accounts-list">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="account-card"
              onClick={() => onAccountSelected(account.id)}
            >
              <div className="account-card-header">
                <h3>Account #{account.accountNumber}</h3>
                <span className={`status-badge status-${account.status}`}>
                  {account.status}
                </span>
              </div>
              <div className="account-card-body">
                <div className="balance-info">
                  <span className="balance-label">Balance:</span>
                  <span className="balance-amount">
                    {account.currency} {parseFloat(account.balance).toFixed(2)}
                  </span>
                </div>
                <div className="account-meta">
                  <span className="created-date">
                    Created: {new Date(account.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="account-card-footer">
                <span className="select-hint">Click to select →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={onCreateNew} className="btn-primary btn-create-account">
        + Create New Account
      </button>
    </div>
  );
}

export default AccountSelector;
