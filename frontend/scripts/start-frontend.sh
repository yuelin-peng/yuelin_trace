#!/bin/bash

# Frontend Start Script
# Usage: ./scripts/start-frontend.sh [environment]

set -e

ENV=${1:-development}
PORT=${PORT:-3000}

FRONTEND_DIR="$(cd "$(dirname "$0")/.." && pwd)"

check_and_setup_node() {
  local required_version="18.17.0"
  local current_version=$(node -v 2>/dev/null | sed 's/v//')
  
  if [ -z "$current_version" ]; then
    echo "Error: Node.js is not installed or not in PATH"
    exit 1
  fi
  
  # Compare versions
  if ! printf '%s\n%s\n' "$current_version" "$required_version" | sort -V -C; then
    echo "=============================================="
    echo "Node.js version is too old"
    echo "=============================================="
    echo ""
    echo "Current:  v$current_version"
    echo "Required: v$required_version+"
    echo ""
    echo "Installing compatible Next.js version (13.5.6)..."
    echo ""
    
    cd "$FRONTEND_DIR"
    npm install next@13.5.6 --save-exact
    echo ""
    echo "Done! Next.js 13.5.6 is compatible with Node.js v$current_version"
    echo ""
  else
    echo "Node.js version: v$current_version ✓"
    echo ""
  fi
}

echo "Starting frontend in $ENV mode..."
echo "Port: $PORT"
echo ""

cd "$FRONTEND_DIR"
check_and_setup_node

case "$ENV" in
  development)
    echo "Running development server..."
    PORT=$PORT npm run dev
    ;;
  production)
    echo "Building for production..."
    npm run build
    echo "Starting production server..."
    PORT=$PORT npm start
    ;;
  test)
    echo "Running tests..."
    npm test
    ;;
  e2e)
    echo "Running E2E tests..."
    npm run test:e2e
    ;;
  integration)
    echo "Running integration tests..."
    npm run test:integration
    ;;
  *)
    echo "Unknown environment: $ENV"
    echo "Usage: $0 [development|production|test|e2e|integration]"
    exit 1
    ;;
esac