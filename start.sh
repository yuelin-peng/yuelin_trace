#!/bin/bash

# Root-level start script
# Usage: ./start.sh [frontend|backend|all|test|help]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BACKEND_DIR="$SCRIPT_DIR/backend"

show_help() {
  echo "Article Blog Platform"
  echo ""
  echo "Usage: $0 [command] [options]"
  echo ""
  echo "Commands:"
  echo "  frontend    Start frontend only (default)"
  echo "  backend     Start mock backend only"
  echo "  all         Start frontend and backend"
  echo "  test        Run tests"
  echo "  help        Show this help"
  echo ""
  echo "Frontend Options:"
  echo "  -p, --port <port>    Port (default: 3000)"
  echo ""
  echo "Examples:"
  echo "  $0                  # Start frontend"
  echo "  $0 all              # Start frontend + backend"
  echo "  $0 test             # Run tests"
  echo "  $0 frontend -p 8080 # Start on port 8080"
  echo ""
}

COMMAND=${1:-frontend}
shift 2>/dev/null || true

PORT=3000
BACKEND_METHOD="docker"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--port)
      PORT="$2"
      shift 2
      ;;
    --docker)
      BACKEND_METHOD="docker"
      shift
      ;;
    --go)
      BACKEND_METHOD="go"
      shift
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

case "$COMMAND" in
  frontend)
    cd "$FRONTEND_DIR"
    PORT=$PORT npm run dev
    ;;
  backend)
    if [ "$BACKEND_METHOD" = "docker" ]; then
      cd "$BACKEND_DIR"
      docker-compose up -d
    else
      cd "$BACKEND_DIR"
      go run ./cmd/mock-server
    fi
    ;;
  all)
    echo "Starting mock backend..."
    cd "$BACKEND_DIR"
    docker-compose up -d 2>/dev/null || echo "Docker not available, skipping backend"
    echo ""
    echo "Starting frontend..."
    cd "$FRONTEND_DIR"
    PORT=$PORT npm run dev
    ;;
  test)
    cd "$FRONTEND_DIR"
    npm test
    ;;
  help|-h)
    show_help
    ;;
  *)
    echo "Unknown command: $COMMAND"
    show_help
    exit 1
    ;;
esac