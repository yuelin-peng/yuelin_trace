# Article Blog Platform - Quickstart

## Prerequisites

- Node.js 18+
- npm 9+ or pnpm 8+
- Java 17+ (for backend/gRPC code generation)
- Docker (optional, for local database)

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18+
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS
- **API**: gRPC-Web via trace-rpc-interfaces v1.0.9
- **Markdown**: markdown-it with custom plugins
- **File Storage**: Aliyun OSS

## Setup

### 1. Clone and Install

```bash
npm install
```

### 2. Generate gRPC Clients

```bash
npm run generate:grpc
```

This generates TypeScript types from proto files.

### 3. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_OSS_BUCKET=your-bucket
NEXT_PUBLIC_OSS_REGION=oss-cn-hangzhou
```

### 4. Start Development

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── editor/        # Markdown editor
│   │   ├── article/       # Article display
│   │   ├── comment/       # Threaded comments
│   │   ├── auth/          # Authentication
│   │   └── common/        # Shared UI
│   ├── pages/             # Next.js pages (or app/)
│   ├── services/          # gRPC client wrappers
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Lint code |
| `npm run generate:grpc` | Regenerate gRPC clients |

## Development Workflow

1. Create feature branch: `git checkout -b 002-feature-name`
2. Make changes
3. Run tests: `npm test`
4. Verify accessibility: `npm run a11y`
5. Commit and create PR

## Common Tasks

### Adding a New API

1. Proto definitions are in trace-rpc-interfaces
2. Run `npm run generate:grpc` to update TypeScript
3. Create service wrapper in `services/`

### Adding a Component

1. Create in appropriate `components/` subfolder
2. Use design tokens (Tailwind) for styling
3. Test with Storybook
4. Ensure accessibility (WCAG 2.1 AA)

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Watch mode
npm test -- --watch
```

## Troubleshooting

### gRPC Connection Issues

Ensure the backend is running and `NEXT_PUBLIC_API_URL` is correct.

### OSS Upload Failures

Check that the bucket CORS settings allow your origin.