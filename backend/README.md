# Mock gRPC Server with Testcontainers

This directory contains a mock gRPC server that can be run via Docker/Compose or directly for integration testing with Testcontainers.

## Quick Start

### Option 1: Docker Compose (Recommended for local development)

```bash
cd backend
docker-compose up -d
```

The server will start on port 9090.

### Option 2: Run locally with Go

```bash
cd backend
go mod download
go run ./cmd/mock-server
```

### Option 3: Build and run Docker image

```bash
cd backend
docker build -t mock-grpc-server .
docker run -p 9090:9090 mock-grpc-server
```

## Integration Tests

Integration tests use Playwright with Testcontainers to run the mock server and test the frontend against it.

### Prerequisites

- Node.js 18+
- Docker (for running containers)
- Java 17+ (for Testcontainers)

### Running Integration Tests

```bash
cd frontend
npm run test:integration
```

Or with Playwright directly:

```bash
cd frontend
npx playwright test tests/integration
```

## Mock Tags

The mock server supports different response behaviors via the `x-mock-tag` metadata header:

| Tag | Behavior |
|-----|----------|
| `default` | Standard responses |
| `error` | Returns error responses |
| `slow` | Adds 500ms delay to responses |
| `empty` | Returns empty datasets |

### Example: Using Mock Tags

```typescript
import { GrpcWebClient } from './your-grpc-client';

const client = new GrpcWebClient();

const metadata = {
  'x-mock-tag': 'error'
};

const response = await client.call('/article.v1.ArticleService/GetArticle', 
  { id: 'test-1' }, 
  metadata
);
```

## Supported Services

The mock server implements the following gRPC services:

### ArticleService
- `CreateArticle` - Creates a new article with auto-generated ID
- `GetArticle` - Returns a sample article
- `UpdateArticle` - Returns the updated article
- `DeleteArticle` - Returns empty response
- `ListArticles` - Returns 2 sample articles

### AuthService
- `Register` - Creates a new user
- `Login` - Returns user data (fails for `invalid@test.com`)
- `Logout` - Returns empty response
- `RefreshToken` - Returns new tokens
- `GetCurrentUser` - Returns default user

### CommentService
- `CreateComment` - Creates a comment with auto-generated ID
- `GetComment` - Returns sample comment
- `UpdateComment` - Returns updated comment
- `DeleteComment` - Returns empty response
- `ListComments` - Returns 1 sample comment

### SearchService
- `SearchArticles` - Returns articles matching query
  - Query "react" → Returns React article
  - Query "typescript" → Returns TypeScript article
  - Empty query → Returns all articles

### TopicService
- `CreateTopic` - Creates a topic with auto-generated ID
- `GetTopic` - Returns "Technology" topic
- `UpdateTopic` - Returns updated topic
- `DeleteTopic` - Returns empty response
- `ListTopics` - Returns 3 topics (Technology, Tutorial, Opinion)

### RevisionService
- `ListRevisions` - Returns 1 sample revision
- `GetRevision` - Returns sample revision
- `RestoreRevision` - Returns restored article info

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GRPC_PORT` | `9090` | Port for the gRPC server |

## Testcontainers Configuration

The integration tests use Testcontainers to automatically spin up the mock server. Key configuration:

```typescript
await new GenericContainer('mock-grpc-server:latest')
  .withExposedPorts(9090)
  .withWaitStrategy({ /* health check */ })
  .start();
```

The tests are designed to work with the docker-compose setup in `backend/docker-compose.yml`.

## Project Structure

```
backend/
├── cmd/
│   └── mock-server/
│       └── main.go          # Main server implementation
├── proto/                   # Protocol Buffer definitions
│   ├── article/v1/
│   ├── auth/v1/
│   ├── comment/v1/
│   ├── search/v1/
│   ├── topic/v1/
│   ├── revision/v1/
│   └── common/v1/
├── Dockerfile               # Docker image for mock server
├── docker-compose.yml      # Docker Compose for local dev
├── go.mod                  # Go module dependencies
└── README.md               # This file
```

## Troubleshooting

### Docker not available
If Docker is not available, the tests will skip the Testcontainers-based integration tests. The unit tests will still run.

### Port conflicts
If port 9090 is already in use, set a different port:
```bash
GRPC_PORT=9091 docker-compose up -d
```

### Connection refused
Ensure the mock server is running and accessible:
```bash
docker ps | grep mock-grpc
curl http://localhost:9090/health 2>/dev/null || echo "Server not responding"
```