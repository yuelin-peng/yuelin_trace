#!/bin/bash

# Quick E2E Test Script
# Runs a subset of E2E tests quickly

set -e

FRONTEND_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT=${PORT:-3000}

echo "========================================"
echo "Quick E2E Test Runner"
echo "========================================"
echo ""

# Start frontend in background
echo "Starting frontend on port $PORT..."
cd "$FRONTEND_DIR"
npm run dev > /dev/null 2>&1 &
DEV_PID=$!

# Wait for server to be ready
echo "Waiting for server..."
for i in {1..30}; do
  if curl -s -o /dev/null http://localhost:$PORT; then
    echo "Server ready!"
    break
  fi
  sleep 1
done

# Run quick E2E tests
echo ""
echo "Running E2E tests..."
npx playwright test tests/e2e/homepage.spec.ts --project=chromium --reporter=list

# Cleanup
echo ""
echo "Cleaning up..."
kill $DEV_PID 2>/dev/null || true

echo ""
echo "Done!"