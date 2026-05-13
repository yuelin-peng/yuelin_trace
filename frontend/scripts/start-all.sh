#!/bin/bash

# Start Frontend and Mock Backend
# Usage: ./scripts/start-all.sh [options]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"

PORT=${PORT:-3000}
GRPC_PORT=${GRPC_PORT:-9090}

show_help() {
  echo "Start Frontend and Mock Backend"
  echo ""
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  --frontend-only    Start only frontend (default: starts both)"
  echo "  --backend-only     Start only mock backend"
  echo "  --docker           Start backend with Docker"
  echo "  --go               Start backend with Go (requires Go installed)"
  echo "  -p, --port <port>  Frontend port (default: 3000)"
  echo "  -h, --help         Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0                  # Start both frontend and mock backend"
  echo "  $0 --frontend-only  # Start only frontend"
  echo "  $0 --docker         # Start backend with Docker"
  echo "  $0 -p 8080          # Start frontend on port 8080"
}

start_frontend() {
  echo "Starting frontend on port $PORT..."
  cd "$FRONTEND_DIR"
  PORT=$PORT npm run dev
}

start_backend_docker() {
  echo "Starting mock gRPC server on port $GRPC_PORT (Docker)..."
  cd "$BACKEND_DIR"
  docker-compose up -d
  echo "Mock server started at localhost:$GRPC_PORT"
}

start_backend_go() {
  echo "Starting mock gRPC server on port $GRPC_PORT (Go)..."
  cd "$BACKEND_DIR"
  GRPC_PORT=$GRPC_PORT go run ./cmd/mock-server
}

wait_for_frontend() {
  echo "Waiting for frontend to be ready..."
  local max_attempts=30
  local attempt=0
  while [ $attempt -lt $max_attempts ]; do
    if curl -s -o /dev/null http://localhost:$PORT; then
      echo "Frontend is ready at http://localhost:$PORT"
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 2
  done
  echo "Frontend did not start within expected time"
  return 1
}

wait_for_backend() {
  echo "Waiting for mock gRPC server to be ready..."
  local max_attempts=30
  local attempt=0
  while [ $attempt -lt $max_attempts ]; do
    if nc -z localhost $GRPC_PORT 2>/dev/null; then
      echo "Mock gRPC server is ready at localhost:$GRPC_PORT"
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 1
  done
  echo "Mock gRPC server did not start within expected time"
  return 1
}

FRONTEND_ONLY=false
BACKEND_ONLY=false
BACKEND_METHOD="docker"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --frontend-only)
      FRONTEND_ONLY=true
      shift
      ;;
    --backend-only)
      BACKEND_ONLY=true
      shift
      ;;
    --docker)
      BACKEND_METHOD="docker"
      shift
      ;;
    --go)
      BACKEND_METHOD="go"
      shift
      ;;
    -p|--port)
      PORT="$2"
      shift 2
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

if [ "$BACKEND_ONLY" = true ]; then
  if [ "$BACKEND_METHOD" = "docker" ]; then
    start_backend_docker
  else
    start_backend_go
  fi
elif [ "$FRONTEND_ONLY" = true ]; then
  start_frontend
else
  echo "Starting both frontend and mock backend..."
  echo ""
  echo "Note: Run 'docker-compose up -d' in the backend directory first,"
  echo "or install Go 1.19+ to run the mock server directly."
  echo ""

  if [ "$BACKEND_METHOD" = "docker" ]; then
    start_backend_docker
    wait_for_backend || true
  fi

  echo ""
  start_frontend
fi