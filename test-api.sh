#!/bin/bash

# Banking API Test Script
# This script demonstrates all the API endpoints

echo "========================================="
echo "Banking API - Test Script"
echo "========================================="
echo ""

BASE_URL="http://localhost:3000"
USER_ID="test-user-$(date +%s)"

echo "1. Testing Health Check..."
echo "-------------------------------------------"
curl -s "$BASE_URL/health" | python3 -m json.tool
echo ""
echo ""

echo "2. Creating an Account..."
echo "-------------------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/accounts" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: $USER_ID" \
  -d '{"currency": "USD"}')

echo "$RESPONSE" | python3 -m json.tool
ACCOUNT_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])")
echo ""
echo "Account ID: $ACCOUNT_ID"
echo ""
echo ""

echo "3. Getting Account Details..."
echo "-------------------------------------------"
curl -s "$BASE_URL/api/accounts/$ACCOUNT_ID" \
  -H "X-User-Id: $USER_ID" | python3 -m json.tool
echo ""
echo ""

echo "4. Depositing $500..."
echo "-------------------------------------------"
curl -s -X POST "$BASE_URL/api/accounts/$ACCOUNT_ID/deposit" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: $USER_ID" \
  -d '{"amount": 500.00, "description": "Initial deposit"}' | python3 -m json.tool
echo ""
echo ""

echo "5. Depositing $250..."
echo "-------------------------------------------"
curl -s -X POST "$BASE_URL/api/accounts/$ACCOUNT_ID/deposit" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: $USER_ID" \
  -d '{"amount": 250.00, "description": "Second deposit"}' | python3 -m json.tool
echo ""
echo ""

echo "6. Withdrawing $150..."
echo "-------------------------------------------"
curl -s -X POST "$BASE_URL/api/accounts/$ACCOUNT_ID/withdraw" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: $USER_ID" \
  -d '{"amount": 150.00, "description": "ATM withdrawal"}' | python3 -m json.tool
echo ""
echo ""

echo "7. Getting Updated Account Details..."
echo "-------------------------------------------"
curl -s "$BASE_URL/api/accounts/$ACCOUNT_ID" \
  -H "X-User-Id: $USER_ID" | python3 -m json.tool
echo ""
echo ""

echo "8. Getting Transaction History..."
echo "-------------------------------------------"
curl -s "$BASE_URL/api/accounts/$ACCOUNT_ID/transactions" \
  -H "X-User-Id: $USER_ID" | python3 -m json.tool
echo ""
echo ""

echo "9. Testing Insufficient Funds (should fail)..."
echo "-------------------------------------------"
curl -s -X POST "$BASE_URL/api/accounts/$ACCOUNT_ID/withdraw" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: $USER_ID" \
  -d '{"amount": 10000.00, "description": "Exceeds balance"}' | python3 -m json.tool
echo ""
echo ""

echo "10. Testing Unauthorized Access (should fail)..."
echo "-------------------------------------------"
curl -s "$BASE_URL/api/accounts/$ACCOUNT_ID" \
  -H "X-User-Id: different-user" | python3 -m json.tool
echo ""
echo ""

echo "========================================="
echo "Test Complete!"
echo "========================================="
