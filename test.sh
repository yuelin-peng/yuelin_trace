#!/bin/bash

# Quick Test Script - Run all tests quickly
# Usage: ./test.sh [unit|e2e|all]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

TEST_TYPE=${1:-unit}

show_help() {
  echo "Quick Test Runner"
  echo ""
  echo "Usage: $0 [unit|e2e|all|quick]"
  echo ""
  echo "  unit    Run unit tests (default)"
  echo "  e2e     Run E2E tests"
  echo "  all     Run all tests"
  echo "  quick   Run quick E2E checks only"
  echo ""
}

start_server() {
  echo "Starting frontend server..."
  cd "$FRONTEND_DIR"
  npm run dev > /dev/null 2>&1 &
  DEV_PID=$!
  
  # Wait for server
  for i in {1..30}; do
    if curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
      echo "Server ready on port 3000"
      return 0
    fi
    sleep 1
  done
  echo "Warning: Server may not be ready"
  return 1
}

stop_server() {
  echo "Stopping server..."
  kill $DEV_PID 2>/dev/null || true
  pkill -f "next dev" 2>/dev/null || true
}

DEV_PID=""

cleanup() {
  if [ -n "$DEV_PID" ]; then
    kill $DEV_PID 2>/dev/null || true
  fi
  pkill -f "next dev" 2>/dev/null || true
}

trap cleanup EXIT

case "$TEST_TYPE" in
  unit)
    echo "Running unit tests..."
    echo ""
    cd "$FRONTEND_DIR"
    npm test
    ;;
  e2e)
    echo "Running E2E tests..."
    echo ""
    start_server
    sleep 5
    cd "$FRONTEND_DIR"
    npx playwright test --project=chromium --reporter=list
    ;;
  all)
    echo "Running all tests..."
    echo ""
    cd "$FRONTEND_DIR"
    npm test
    echo ""
    echo "========================================"
    echo "Running E2E tests..."
    echo "========================================"
    echo ""
    start_server
    sleep 5
    npx playwright test --project=chromium --reporter=list
    ;;
  quick)
    echo "Running quick checks..."
    echo ""
    cd "$FRONTEND_DIR"
    npx tsc --noEmit
    npm test -- --testPathPattern="services" --reporter=list
    echo ""
    echo "Quick checks passed!"
    ;;
  help|-h|--help)
    show_help
    ;;
  *)
    echo "Unknown option: $TEST_TYPE"
    show_help
    exit 1
    ;;
esac

echo ""
echo "Tests completed!"