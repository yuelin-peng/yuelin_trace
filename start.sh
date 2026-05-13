#!/bin/bash

# Root-level start script to run the entire project
# Usage: ./start.sh [frontend|backend|all] [options]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BACKEND_DIR="$SCRIPT_DIR/backend"

show_help() {
  echo "Article Blog Platform - Start Script"
  echo ""
  echo "Usage: $0 [command] [options]"
  echo ""
  echo "Commands:"
  echo "  frontend   Start frontend only (default)"
  echo "  backend    Start mock backend only"
  echo "  all        Start frontend and backend together"
  echo ""
  echo "Frontend Options:"
  echo "  -p, --port <port>  Port for frontend (default: 3000)"
  echo ""
  echo "Backend Options:"
  echo "  --docker           Use Docker (default)"
  echo "  --go               Use Go (requires Go 1.19+)"
  echo ""
  echo "Examples:"
  echo "  $0                  # Start frontend only"
  echo "  $0 frontend         # Start frontend only"
  echo "  $0 all --docker     # Start both with Docker"
  echo "  $0 frontend -p 8080 # Frontend on port 8080"
  echo ""
  echo "For more options, see:"
  echo "  ./frontend/scripts/start-frontend.sh --help"
  echo "  ./frontend/scripts/start-all.sh --help"
}

COMMAND=${1:-frontend}
shift || true

FRONTEND_PORT=3000
BACKEND_METHOD="docker"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--port)
      FRONTEND_PORT="$2"
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
    echo "Starting frontend..."
    cd "$FRONTEND_DIR"
    PORT=$FRONTEND_PORT npm run dev
    ;;
  backend)
    echo "Starting mock backend..."
    if [ "$BACKEND_METHOD" = "docker" ]; then
      cd "$BACKEND_DIR"
      docker-compose up -d
    else
      cd "$BACKEND_DIR"
      go run ./cmd/mock-server
    fi
    ;;
  all)
    echo "Starting both frontend and backend..."
    echo ""
    echo "Starting mock backend with Docker..."
    cd "$BACKEND_DIR"
    docker-compose up -d
    echo ""
    echo "Starting frontend..."
    cd "$FRONTEND_DIR"
    PORT=$FRONTEND_PORT npm run dev
    ;;
  help)
    show_help
    ;;
  *)
    echo "Unknown command: $COMMAND"
    echo ""
    show_help
    exit 1
    ;;
esac