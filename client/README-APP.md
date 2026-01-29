# Banking Application - React Frontend

A modern, responsive React application for managing banking operations including account creation, deposits, and withdrawals.

## Features

- 🏦 **Create Account**: Set up a new banking account with your preferred currency
- 💰 **Deposit Money**: Add funds to your account with optional descriptions
- 💸 **Withdraw Money**: Withdraw funds from your account
- 📊 **Transaction History**: View all your transactions with real-time balance updates
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Prerequisites

- Node.js (v14 or higher)
- Backend API running on port 3000

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

### 4. Preview Production Build

```bash
npm run preview
```

## Development

The application uses:
- **React 19**: Latest React framework
- **Vite**: Fast build tool and development server
- **Fetch API**: For backend communication

## API Integration

The app connects to the backend API running at `http://localhost:3000`. The Vite development server is configured to proxy API requests:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

## Usage

### Demo Mode

For development/demo purposes, you can set a User ID in the input field at the top. This ID is sent with all API requests via the `X-User-Id` header (when `BYPASS_AUTH=true` in backend).

### Account Creation

1. Select your preferred currency from the dropdown
2. Click "Create Account"
3. Your account will be created with a unique account number

### Making Deposits

1. Enter the amount to deposit
2. Optionally add a description
3. Click "Deposit"
4. Your balance and transaction history will update instantly

### Making Withdrawals

1. Enter the amount to withdraw
2. Optionally add a description
3. Click "Withdraw"
4. Your balance and transaction history will update instantly

### Viewing Transactions

The transaction history section shows:
- Transaction type (deposit/withdrawal) with icons
- Description and timestamp
- Amount (positive for deposits, negative for withdrawals)
- Balance after each transaction
- Configurable number of transactions to display (5, 10, 20, or 50)

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── AccountDashboard.jsx    # Main dashboard component
│   │   ├── AccountDashboard.css    # Dashboard styles
│   │   ├── CreateAccount.jsx       # Account creation form
│   │   ├── CreateAccount.css       # Account creation styles
│   │   ├── DepositForm.jsx         # Deposit form component
│   │   ├── WithdrawForm.jsx        # Withdrawal form component
│   │   ├── TransactionForm.css     # Transaction form styles
│   │   ├── TransactionHistory.jsx  # Transaction list component
│   │   └── TransactionHistory.css  # Transaction history styles
│   ├── App.jsx                     # Main application component
│   ├── App.css                     # Global app styles
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Base styles
├── public/                         # Static assets
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
└── package.json                    # Dependencies and scripts
```

## Screenshots

### Create Account Page
![Create Account](https://github.com/user-attachments/assets/754a7131-7e3a-4183-a4db-2006865d94be)

### Account Dashboard
![Account Dashboard](https://github.com/user-attachments/assets/d7062509-9c95-4974-943a-944fd60854ed)

### After Deposit
![After Deposit](https://github.com/user-attachments/assets/a21db68f-32dd-4e15-a051-39137f972b17)

### After Withdrawal
![After Withdrawal](https://github.com/user-attachments/assets/93f7141e-03a2-446e-97e5-bce1b9cb848d)

## Error Handling

The application includes comprehensive error handling:
- Network errors are caught and displayed to users
- Validation errors from the API are shown in user-friendly messages
- Loading states prevent duplicate submissions
- Success messages confirm completed operations

## Styling

The application features:
- Gradient purple background
- White content cards with rounded corners
- Color-coded buttons (green for deposits, orange for withdrawals)
- Responsive design that works on all screen sizes
- Smooth animations and hover effects
- Modern, clean typography

## License

ISC
