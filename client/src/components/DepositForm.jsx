import { useState } from 'react';
import './TransactionForm.css';

function DepositForm({ accountId, userId, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/accounts/${accountId}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: description || 'Deposit',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to deposit');
      }

      setSuccess(`Successfully deposited ${amount}!`);
      setAmount('');
      setDescription('');
      onSuccess();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="form-group">
        <label htmlFor="deposit-amount">Amount</label>
        <input
          id="deposit-amount"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="deposit-description">Description (optional)</label>
        <input
          id="deposit-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Salary deposit"
          disabled={loading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button type="submit" disabled={loading} className="btn-deposit">
        {loading ? 'Processing...' : 'Deposit'}
      </button>
    </form>
  );
}

export default DepositForm;
