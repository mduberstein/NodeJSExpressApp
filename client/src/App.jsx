import { useState } from 'react';
import './App.css';
import CreateAccount from './components/CreateAccount';
import AccountDashboard from './components/AccountDashboard';
import AccountSelector from './components/AccountSelector';

function App() {
  const [view, setView] = useState('selector'); // 'selector', 'create', 'dashboard'
  const [accountId, setAccountId] = useState(null);
  const [userId, setUserId] = useState('demo-user-123');

  const handleAccountCreated = (newAccountId) => {
    setAccountId(newAccountId);
    setView('dashboard');
  };

  const handleAccountSelected = (selectedAccountId) => {
    setAccountId(selectedAccountId);
    setView('dashboard');
  };

  const handleBackToSelector = () => {
    setAccountId(null);
    setView('selector');
  };

  const renderView = () => {
    switch (view) {
      case 'create':
        return (
          <CreateAccount
            userId={userId}
            onAccountCreated={handleAccountCreated}
            onCancel={handleBackToSelector}
          />
        );
      case 'dashboard':
        return (
          <AccountDashboard
            accountId={accountId}
            userId={userId}
            onLogout={handleBackToSelector}
          />
        );
      case 'selector':
      default:
        return (
          <AccountSelector
            userId={userId}
            onAccountSelected={handleAccountSelected}
            onCreateNew={() => setView('create')}
          />
        );
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏦 Banking Application</h1>
        <p className="subtitle">Manage your accounts with ease</p>
      </header>

      <div className="user-info">
        <label htmlFor="userId">User ID (for demo): </label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
        />
      </div>

      <main className="main-content">
        {renderView()}
      </main>

      <footer className="app-footer">
        <p>© 2024 Banking Application - Demo Version</p>
      </footer>
    </div>
  );
}

export default App;
