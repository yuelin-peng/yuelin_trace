# Developer Setup Guide

## Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- npm 9+ or pnpm 8+
- Git

## Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd article-blog
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npx tsc --noEmit     # TypeScript type checking

# gRPC Code Generation
npm run generate:grpc  # Regenerate gRPC client from proto files
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── contexts/        # React contexts
│   ├── generated/       # gRPC generated code (DO NOT EDIT)
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities
│   ├── pages/           # Next.js pages
│   └── services/        # gRPC service wrappers
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Node Version Issues

```bash
# Check Node version
node -v

# Use nvm to switch versions
nvm use 20
```

### TypeScript Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit
3. Run type checking: `npx tsc --noEmit`
4. Run linting: `npm run lint`
5. Submit pull request

## Backend Requirements

This frontend expects the following backend services:

- Article Service (port 8080)
- Auth Service (port 8080)
- Comment Service (port 8080)
- Search Service (port 8080)
- Revision Service (port 8080)
- Topic Service (port 8080)

See `specs/001-article-blog/contracts/` for API specifications.