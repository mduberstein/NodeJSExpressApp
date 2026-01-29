import { useState } from 'react';
import './App.css';
import CreateAccount from './components/CreateAccount';
import AccountDashboard from './components/AccountDashboard';

function App() {
  const [accountId, setAccountId] = useState(null);
  const [userId, setUserId] = useState('demo-user-123');

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
        {!accountId ? (
          <CreateAccount userId={userId} onAccountCreated={setAccountId} />
        ) : (
          <AccountDashboard accountId={accountId} userId={userId} onLogout={() => setAccountId(null)} />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 Banking Application - Demo Version</p>
      </footer>
    </div>
  );
}

export default App;
