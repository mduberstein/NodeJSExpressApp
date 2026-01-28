# Banking API - Node.js Express Application

A secure RESTful banking API built with Node.js, Express, PostgreSQL, and Redis, featuring OAuth2/OIDC authentication.

## Features

- 🏦 **Banking Operations**: Create accounts, deposit, and withdraw funds
- 🔐 **OAuth2/OIDC Authentication**: Secure API endpoints using Auth0
- 🗄️ **PostgreSQL Database**: Persistent storage for accounts and transactions
- ⚡ **Redis Caching**: Fast data retrieval with caching layer
- 🛡️ **Security**: Helmet.js for security headers, input validation
- 📝 **Transaction History**: Complete audit trail of all operations
- 🔄 **ACID Transactions**: Database transactions ensure data consistency

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose (for running PostgreSQL and Redis)
- Auth0 account (optional for development, required for production)

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd NodeJSExpressApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

For development without Auth0, update `.env`:

```env
NODE_ENV=development
BYPASS_AUTH=true
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=banking_db
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

For production with Auth0, sign up at [auth0.com](https://auth0.com) and configure:

```env
NODE_ENV=production
BYPASS_AUTH=false
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
```

### 4. Start PostgreSQL and Redis

```bash
docker-compose up -d
```

Verify containers are running:

```bash
docker-compose ps
```

### 5. Initialize the database

```bash
npm run init-db
```

### 6. Start the application

For development with auto-reload:

```bash
npm run dev
```

For production:

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Public Endpoints

- `GET /` - API information
- `GET /health` - Health check

### Protected Endpoints (Requires Authentication)

#### Create Account
```http
POST /api/accounts
Content-Type: application/json
Authorization: Bearer <token>  # or X-User-Id header in dev mode

{
  "currency": "USD"  // optional, defaults to USD
}
```

#### Get Account Details
```http
GET /api/accounts/:id
Authorization: Bearer <token>  # or X-User-Id header in dev mode
```

#### Deposit Money
```http
POST /api/accounts/:id/deposit
Content-Type: application/json
Authorization: Bearer <token>  # or X-User-Id header in dev mode

{
  "amount": 100.50,
  "description": "Salary deposit"  // optional
}
```

#### Withdraw Money
```http
POST /api/accounts/:id/withdraw
Content-Type: application/json
Authorization: Bearer <token>  # or X-User-Id header in dev mode

{
  "amount": 50.25,
  "description": "ATM withdrawal"  // optional
}
```

#### Get Transaction History
```http
GET /api/accounts/:id/transactions?limit=10
Authorization: Bearer <token>  # or X-User-Id header in dev mode
```

## Development Mode

In development mode with `BYPASS_AUTH=true`, you can use the `X-User-Id` header instead of OAuth2 tokens:

```bash
# Create account
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user123" \
  -d '{"currency": "USD"}'

# Get account (replace :id with actual account ID)
curl http://localhost:3000/api/accounts/1 \
  -H "X-User-Id: user123"

# Deposit
curl -X POST http://localhost:3000/api/accounts/1/deposit \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user123" \
  -d '{"amount": 100.00, "description": "Initial deposit"}'

# Withdraw
curl -X POST http://localhost:3000/api/accounts/1/withdraw \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user123" \
  -d '{"amount": 50.00, "description": "Cash withdrawal"}'

# Get transactions
curl http://localhost:3000/api/accounts/1/transactions \
  -H "X-User-Id: user123"
```

## Production Setup with Auth0

### 1. Create Auth0 Application

1. Sign up at [auth0.com](https://auth0.com)
2. Create a new API in Auth0 Dashboard
3. Note down the Domain, Audience, and Issuer Base URL
4. Update your `.env` file with these values

### 2. Get Access Token

To test protected endpoints in production, obtain an access token:

```bash
curl --request POST \
  --url 'https://YOUR_DOMAIN/oauth/token' \
  --header 'content-type: application/json' \
  --data '{
    "client_id":"YOUR_CLIENT_ID",
    "client_secret":"YOUR_CLIENT_SECRET",
    "audience":"YOUR_API_AUDIENCE",
    "grant_type":"client_credentials"
  }'
```

### 3. Use the Token

```bash
curl http://localhost:3000/api/accounts/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Architecture

```
src/
├── config/          # Configuration files (database, redis, initialization)
├── controllers/     # Business logic and request handlers
├── middleware/      # Authentication, caching, error handling
├── models/          # Data models and database queries
├── routes/          # API route definitions
└── server.js        # Application entry point
```

## Database Schema

### Accounts Table
- `id`: Primary key
- `user_id`: OAuth2 user identifier (unique)
- `account_number`: Unique account number
- `balance`: Current balance (with CHECK constraint >= 0)
- `currency`: Currency code (default: USD)
- `status`: Account status (active/inactive)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Transactions Table
- `id`: Primary key
- `account_id`: Foreign key to accounts
- `transaction_type`: deposit/withdrawal
- `amount`: Transaction amount
- `balance_after`: Balance after transaction
- `description`: Transaction description
- `created_at`: Transaction timestamp

## Security Features

- **OAuth2/OIDC Authentication**: Token-based authentication using Auth0
- **Helmet.js**: Security headers to protect against common vulnerabilities
- **Input Validation**: Request validation using express-validator
- **Rate Limiting**: Protects against brute force and DDoS attacks
  - General API: 100 requests per 15 minutes per IP
  - Write operations (deposit/withdraw): 20 requests per 15 minutes per IP
  - Account creation: 5 requests per hour per IP
- **CORS**: Configurable cross-origin resource sharing
- **SQL Injection Protection**: Parameterized queries
- **Transaction Isolation**: Database transactions prevent race conditions
- **Balance Constraints**: Database-level checks prevent negative balances

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors, insufficient funds)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (accessing other user's account)
- `404`: Not Found
- `409`: Conflict (duplicate account)
- `500`: Internal Server Error

## Caching Strategy

- Account details are cached for 5 minutes (300 seconds)
- Transaction history is cached for 1 minute (60 seconds)
- Cache is automatically invalidated on deposits/withdrawals
- Redis caching improves performance for read-heavy operations

## Future Development

This application is designed for easy extension:

1. **Additional Features**:
   - Account-to-account transfers
   - Multi-currency support with exchange rates
   - Account statements and reports
   - Transaction search and filtering
   - Account limits and notifications

2. **Infrastructure**:
   - Add unit and integration tests
   - Implement rate limiting
   - Add monitoring and logging (Winston, Morgan)
   - API documentation with Swagger/OpenAPI
   - Docker containerization for the app itself
   - CI/CD pipeline

3. **Scalability**:
   - Database read replicas
   - Redis cluster for caching
   - Load balancing
   - Horizontal scaling

## Troubleshooting

### Database connection errors

Ensure PostgreSQL is running:
```bash
docker-compose ps
```

Check database logs:
```bash
docker-compose logs postgres
```

### Redis connection errors

Verify Redis is running:
```bash
docker-compose ps
docker-compose logs redis
```

### Authentication errors

In development, ensure `BYPASS_AUTH=true` in `.env`

In production, verify Auth0 configuration and token validity

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.