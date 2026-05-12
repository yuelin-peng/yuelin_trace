# Research: Article Blog Platform

## RPC Interface Analysis

### trace-rpc-interfaces v1.0.9

The feature uses the following gRPC services from trace-rpc-interfaces:

| Service | Version | Purpose |
|---------|---------|---------|
| ArticleService | v1 | Article CRUD, state management |
| AuthService | v1 | User registration, login, token management |
| CommentService | v1 | Threaded comments with nesting |
| SearchService | v1 | Full-text search with relevance scoring |
| TopicService | v1 | Topic management |
| RevisionService | v1 | Auto-save, revision history |

### Key Findings

1. **JWT Authentication**: Auth uses JWT tokens with access/refresh pattern
2. **Partial Updates**: Article/Topic support FieldMask for partial updates
3. **Pagination**: Cursor-based pagination with PageRequest/PageResponse
4. **Soft Delete**: Articles are soft-deleted with 30-day recovery
5. **Error Codes**: Domain-specific error codes (1000-6999 range)

## Markdown Rendering

### markdown-it Configuration

```typescript
// Core plugins needed
- markdown-it (core)
- markdown-it-anchor (headings)
- markdown-it-emoji (emoji support)
- markdown-it-mark (highlight)
- markdown-it-task-lists (checkboxes)
- markdown-it-footnote (footnotes)
```

### PlantUML Integration

```typescript
// Options for PlantUML rendering
1. Client-side: PlantUML client library (requires Java)
2. Server-side: Pre-render to PNG/SVG
3. External service: PlantUML Server

// Recommended: External service with caching
- Generate on editor preview
- Store rendered images in OSS
- Display as static images
```

### Code Block Highlighting

```typescript
// Options for syntax highlighting
- highlight.js (client-side, larger bundle)
- Prism (client-side, lighter)
- Server-side highlighting (lighter client)

Recommended: Server-side via backend API
```

## File Storage (Aliyun OSS)

### Upload Flow

1. Frontend requests pre-signed URL from backend
2. Backend generates OSS upload URL with expiration
3. Frontend uploads directly to OSS
4. Frontend stores OSS URL in article content

### Display

- Public URLs for images/videos
- CDN acceleration for performance

## Live Preview Implementation

### Architecture Options

1. **Split Pane**: Side-by-side editor and preview
2. **Inline Preview**: Toggle between edit and preview
3. **Overlay Preview**: Floating preview on selection

Recommended: Split pane for continuous feedback

### Performance Targets

- Debounce input: 150ms
- Render threshold: 500ms
- Virtualized rendering for long documents

## Auto-save Implementation

### Strategy

1. Track "dirty" state on content change
2. Debounce save: 30 seconds (as per spec)
3. Background save with non-blocking UI
4. Conflict detection (last-write-wins for v1)

### Revision Creation

- Backend creates revision on each auto-save
- Revision stores content snapshot only (not title/metadata)
- Restore creates new revision (non-destructive)