import { useState, useEffect } from 'react';
import './AccountDashboard.css';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';
import TransactionHistory from './TransactionHistory';

function AccountDashboard({ accountId, userId, onLogout }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchAccount();
  }, [accountId, refreshTrigger]);

  const fetchAccount = async () => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        headers: {
          'X-User-Id': userId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch account');
      }

      setAccount(data.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return <div className="loading">Loading account...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={onLogout} className="btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="account-dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Account Dashboard</h2>
          <p className="account-number">Account #{account.accountNumber}</p>
        </div>
        <button onClick={onLogout} className="btn-logout">
          Switch Account
        </button>
      </div>

      <div className="balance-card">
        <div className="balance-label">Current Balance</div>
        <div className="balance-amount">
          {account.currency} {parseFloat(account.balance).toFixed(2)}
        </div>
        <div className="balance-status">
          Status: <span className="status-badge">{account.status}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h3>💰 Deposit Money</h3>
          <DepositForm
            accountId={accountId}
            userId={userId}
            onSuccess={handleTransactionSuccess}
          />
        </div>

        <div className="dashboard-section">
          <h3>💸 Withdraw Money</h3>
          <WithdrawForm
            accountId={accountId}
            userId={userId}
            onSuccess={handleTransactionSuccess}
          />
        </div>
      </div>

      <div className="transactions-section">
        <h3>📊 Transaction History</h3>
        <TransactionHistory
          accountId={accountId}
          userId={userId}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
}

export default AccountDashboard;
