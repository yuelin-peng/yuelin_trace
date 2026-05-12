# Implementation Plan: Article Blog Platform

**Branch**: `001-article-blog` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-article-blog/spec.md`

## Summary

A full-stack article blog platform supporting Markdown authoring with live preview, columns/tags organization, threaded comments with emoji, user authentication, full-text search, and auto-save revision history. Frontend communicates with backend via RESTful gRPC APIs defined in trace-rpc-interfaces v1.0.9. File storage uses Aliyun OSS.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Java/Kotlin (backend)  
**Primary Dependencies**: trace-rpc-interfaces v1.0.9, React/Next.js, gRPC-web, Aliyun OSS SDK  
**Storage**: Aliyun OSS for files, Database (PostgreSQL assumed) for structured data  
**Testing**: Jest (unit), Playwright (e2e), gRPC testing tools  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)  
**Project Type**: Full-stack web application (frontend + backend API)  
**Performance Goals**: Search results <2s, preview updates <500ms, auto-save reliability 95%  
**Constraints**: Must use provided RPC interfaces, WCAG 2.1 AA accessibility  
**Scale/Scope**: Single-tenant, estimated 1000 concurrent users for v1

## Constitution Check

| Principle | Requirement | Compliance |
|-----------|-------------|------------|
| I. Systemic over Individual | Components must be generic/reusable | PASS - Using shared RPC interfaces |
| II. Accessibility by Default | WCAG 2.1 Level AA | PASS - Required in QA section |
| III. Predictability | Consistent patterns | PASS - Follows RPC conventions |
| IV. Composition over Configuration | Small composable components | PASS - React component design |
| V. Design Tokens & Theming | Abstract visual values | PASS - Tailwind design tokens |

## Project Structure

### Documentation (this feature)

```text
specs/001-article-blog/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research
├── data-model.md        # Entity definitions
├── quickstart.md        # Development setup guide
├── contracts/           # API contracts
│   ├── article-api.md
│   ├── auth-api.md
│   ├── comment-api.md
│   ├── search-api.md
│   ├── topic-api.md
│   └── revision-api.md
└── tasks.md             # Phase 2 task list
```

### Source Code

```text
frontend/
├── src/
│   ├── components/
│   │   ├── editor/          # Markdown editor with live preview
│   │   ├── article/         # Article display components
│   │   ├── comment/         # Threaded comment components
│   │   ├── auth/            # Login/register components
│   │   └── common/          # Shared UI components
│   ├── pages/
│   │   ├── index.tsx       # Homepage with search
│   │   ├── article/[id].tsx # Article view
│   │   ├── write/          # Article editor
│   │   └── auth/           # Login/register pages
│   ├── services/           # gRPC client calls
│   ├── hooks/              # Custom React hooks
│   └── styles/             # Tailwind tokens
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/

backend/
├── src/
│   ├── service/            # Business logic
│   ├── repository/         # Data access
│   └── config/             # Configuration
└── tests/
```

**Structure Decision**: Web application with separate frontend and backend directories. Frontend uses React/Next.js with TypeScript. Backend exposes gRPC APIs consumed via REST/gRPC-web bridge.

## Complexity Tracking

No violations requiring justification.

---

## Phase 0: Research

### Research: Markdown Editor with Live Preview

**Decision**: React-based split-pane editor with markdown-it for parsing and custom renderers for PlantUML

**Rationale**: markdown-it is lightweight, extensible, and widely used. Split-pane layout provides real-time preview.

**Alternatives considered**:
- Monaco Editor: Overkill for Markdown, larger bundle
- Draft.js: Rich text, not ideal for Markdown authoring

### Research: gRPC-Web Integration

**Decision**: Use grpc-web with protobuf-ts for TypeScript code generation

**Rationale**: Matches existing trace-rpc-interfaces dependency, type-safe.

### Research: File Storage (Aliyun OSS)

**Decision**: Pre-signed URLs for uploads, public URLs for display

**Rationale**: Server generates upload URLs to avoid passing credentials to client.

### Research: Search Implementation

**Decision**: Backend full-text search via SearchService RPC

**Rationale**: Leverages existing SearchService with relevance scoring.

---

## Phase 1: Design & Contracts

### data-model.md

Entities derived from proto definitions:

**User**
- id: UUID (primary key)
- email: String (unique, indexed)
- displayName: String
- role: Enum (Admin, Author, Reader, Guest)
- createdAt, updatedAt: Timestamp

**Article**
- id: UUID (primary key)
- title: String (1-200 chars)
- content: String (Markdown, 1-50000 chars)
- authorId: UUID (foreign key)
- state: Enum (Draft, Published, Archived)
- columnId: UUID (optional)
- seriesId: UUID (optional)
- topicId: UUID (optional)
- tagIds: String[] (many-to-many via ArticleTag)
- createdAt, updatedAt, publishedAt: Timestamp

**Comment**
- id: UUID (primary key)
- articleId: UUID (foreign key)
- authorId: UUID (foreign key)
- parentId: UUID (self-reference for threading)
- content: String (supports emoji)
- createdAt, updatedAt: Timestamp

**Revision**
- id: UUID (primary key)
- articleId: UUID (foreign key)
- content: String (snapshot)
- authorId: UUID (who created revision)
- createdAt: Timestamp

**Topic**
- id: UUID (primary key)
- name: String
- slug: String (URL-friendly, unique)
- createdAt: Timestamp

**Tag**
- id: UUID (primary key)
- name: String
- createdAt: Timestamp

**Column/Series**
- Defined by column_id and series_id in Article
- Separate entity definitions needed (not in proto)

### contracts/article-api.md

```markdown
# Article API Contract

## Endpoints

### CreateArticle
- Input: title, content, columnId?, seriesId?, tagIds[], topicId?
- Output: Article
- Auth: Required (Author role)
- Errors: ARTICLE_TITLE_INVALID, ARTICLE_CONTENT_INVALID

### GetArticle
- Input: id, fields? (FieldMask)
- Output: Article
- Auth: Optional (for Draft access)

### UpdateArticle
- Input: id, updateMask, fields...
- Output: Article
- Auth: Required (author only)
- Errors: ARTICLE_NOT_FOUND, ARTICLE_ACCESS_DENIED

### DeleteArticle
- Input: id
- Output: Empty
- Auth: Required (author/admin)
- Note: Soft delete with 30-day recovery

### ListArticles
- Input: pagination, filters (authorId, state, columnId, seriesId, topicId, tagIds), sortBy, sortOrder
- Output: Article[], pagination
- Auth: Optional
```

### contracts/auth-api.md

```markdown
# Auth API Contract

## Endpoints

### Register
- Input: email, password, displayName
- Output: User, accessToken, refreshToken, expiresAt
- Errors: AUTH_USER_EXISTS, AUTH_PASSWORD_WEAK

### Login
- Input: email, password
- Output: User, accessToken, refreshToken, expiresAt
- Errors: AUTH_INVALID_CREDENTIALS

### Logout
- Input: refreshToken
- Output: Empty
- Auth: Required

### RefreshToken
- Input: refreshToken
- Output: accessToken, refreshToken, expiresAt
- Errors: AUTH_TOKEN_EXPIRED, AUTH_TOKEN_INVALID

### GetCurrentUser
- Input: None (uses session)
- Output: User
- Auth: Required
```

### contracts/comment-api.md

```markdown
# Comment API Contract

## Endpoints

### CreateComment
- Input: articleId, parentId?, content
- Output: Comment
- Auth: Required
- Errors: COMMENT_CONTENT_INVALID, COMMENT_DEPTH_EXCEEDED (if >5 levels)

### GetComment
- Input: id
- Output: Comment
- Auth: Optional

### UpdateComment
- Input: id, content
- Output: Comment
- Auth: Required (author only)
- Errors: COMMENT_ACCESS_DENIED

### DeleteComment
- Input: id
- Output: Empty
- Auth: Required (author/admin)

### ListComments
- Input: pagination, articleId?, parentId?, sortBy?, sortOrder?
- Output: Comment[], pagination
- Auth: Optional
```

### contracts/search-api.md

```markdown
# Search API Contract

## Endpoints

### SearchArticles
- Input: query, pagination, state?, topicIds?, tagIds?, authorId?, sortBy?, sortOrder?
- Output: SearchResultItem[], pagination, totalMatches
- Auth: Optional
- Errors: SEARCH_INVALID_QUERY
- Note: Returns highlighted snippets with relevance scoring
```

### contracts/topic-api.md

```markdown
# Topic API Contract

## Endpoints

### CreateTopic
- Input: name
- Output: Topic
- Auth: Required (Admin)

### GetTopic
- Input: id
- Output: Topic
- Auth: Optional

### UpdateTopic
- Input: id, updateMask, name
- Output: Topic
- Auth: Required (Admin)

### DeleteTopic
- Input: id
- Output: Empty
- Auth: Required (Admin)

### ListTopics
- Input: pagination, search?, sortBy?, sortOrder?
- Output: Topic[], pagination
- Auth: Optional
```

### contracts/revision-api.md

```markdown
# Revision API Contract

## Endpoints

### ListRevisions
- Input: articleId, pagination, sortOrder?
- Output: Revision[], pagination
- Auth: Required (author)

### GetRevision
- Input: id
- Output: Revision
- Auth: Required (author)

### RestoreRevision
- Input: revisionId, title?
- Output: articleId, revisionId, restoredAt
- Auth: Required (author)
- Note: Creates new revision with restored content
```

### quickstart.md

```markdown
# Article Blog Platform - Quickstart

## Prerequisites

- Node.js 18+
- Java 17+ (for backend)
- Docker (for local development)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate gRPC clients:
   ```bash
   npm run generate:grpc
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Key Technologies

- React 18+ with TypeScript
- Next.js 14+ (App Router)
- Tailwind CSS for styling
- gRPC-web for API communication
- protobuf-ts for code generation
- markdown-it for Markdown parsing
- PlantUML for diagrams

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_OSS_BUCKET=your-bucket
```

## Development Workflow

1. Create feature branch
2. Implement component/feature
3. Run tests: `npm test`
4. Verify accessibility: `npm run a11y`
5. Create PR for review
```
