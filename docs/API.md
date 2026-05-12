# Article Blog Platform - Documentation

## Overview

This is a full-stack article blog platform with Markdown authoring, real-time preview, comments, authentication, and revision history.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: gRPC services (protobuf-ts)
- **Styling**: Tailwind CSS with custom design tokens
- **Markdown**: markdown-it with plugins (anchor, emoji, task-lists, mark)
- **State**: SWR for server state, React hooks for local state

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── auth/        # Authentication components
│   │   ├── common/      # Base components (Button, Input, Modal, etc.)
│   │   ├── comment/      # Comment-related components
│   │   ├── editor/      # Markdown editor components
│   │   ├── search/      # Search components
│   │   ├── topic/       # Topic management components
│   │   └── article/     # Article-related components
│   ├── contexts/        # React contexts (AuthContext)
│   ├── generated/       # gRPC generated code
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Next.js pages
│   │   ├── admin/       # Admin pages
│   │   ├── auth/        # Auth pages
│   │   └── article/     # Article pages
│   └── services/         # gRPC service wrappers
```

## Quick Start

1. Install dependencies: `cd frontend && npm install`
2. Configure environment: Copy `.env.example` to `.env.local`
3. Start development: `npm run dev`
4. Open http://localhost:3000

## API Services

### Article Service

```typescript
import { articleService } from '../services/article-service';

// Create article
const article = await articleService.createArticle({
  title: 'My Article',
  content: '# Hello World',
  columnId: 'col-123',
  tagIds: ['react', 'typescript'],
});

// Get article
const article = await articleService.getArticle('article-id');

// List articles
const { articles, total } = await articleService.listArticles({
  pageSize: 20,
  state: 2, // Published
  tagIds: ['react'],
});

// Update article
await articleService.updateArticle({
  id: 'article-id',
  updateMask: ['title', 'content'],
  title: 'Updated Title',
  content: 'Updated content',
  columnId: '',
  seriesId: '',
  tagIds: [],
  topicId: '',
  state: 0,
});
```

### Auth Service

```typescript
import { authService } from '../services/auth-service';

// Register
const { user, accessToken } = await authService.register(
  'user@example.com',
  'password123',
  'Display Name'
);

// Login
const { user, accessToken } = await authService.login(
  'user@example.com',
  'password123'
);

// Logout
await authService.logout();

// Get current user
const user = await authService.getCurrentUser();
```

### Comment Service

```typescript
import { commentService } from '../services/comment-service';

// Create comment
const comment = await commentService.createComment(
  'article-id',
  'Great article!'
);

// List comments (returns nested tree)
const { comments, total } = await commentService.listComments('article-id');
const tree = commentService.buildCommentTree(comments, 5); // Max 5 levels

// Reply to comment
const reply = await commentService.createComment(
  'article-id',
  'Thanks for the reply!',
  'parent-comment-id'
);

// Update comment
await commentService.updateComment('comment-id', 'Updated content');

// Delete comment
await commentService.deleteComment('comment-id');
```

### Search Service

```typescript
import { searchService } from '../services/search-service';

const { results, total, hasMore } = await searchService.searchArticles(
  'react hooks',
  {
    pageSize: 20,
    tagIds: ['typescript'],
    sortBy: 'relevance',
    sortOrder: 'desc',
  }
);
```

### Revision Service

```typescript
import { revisionService } from '../services/revision-service';

// List revisions
const { revisions, hasMore } = await revisionService.listRevisions(
  'article-id',
  { sortOrder: 'desc' }
);

// Get specific revision
const revision = await revisionService.getRevision('revision-id');

// Restore revision
const { articleId } = await revisionService.restoreRevision(
  'revision-id',
  'Restored Title'
);

// Compare revisions
const diff = revisionService.compareRevisions(rev1, rev2);
// Returns { added: [], removed: [], modified: [] }
```

### Topic Service (Admin only)

```typescript
import { topicService } from '../services/topic-service';

// Create topic
const topic = await topicService.createTopic('JavaScript');

// List topics
const { topics } = await topicService.listTopics({ search: 'java' });

// Update topic
const updated = await topicService.updateTopic('topic-id', 'TypeScript');

// Delete topic
await topicService.deleteTopic('topic-id');

// Generate slug from name
const slug = topicService.generateSlug('My Topic'); // 'my-topic'
```

## Components

### Using AuthGuard

```typescript
import { AuthGuard } from '../components/auth/AuthGuard';
import { UserRole } from '../generated/com/yuelin/user/v1/user';

// Protect route for authenticated users
<AuthGuard fallbackPath="/auth/login">
  <WritePage />
</AuthGuard>

// Protect route for specific roles
<AuthGuard requiredRoles={[UserRole.USER_ROLE_ADMIN]} fallbackPath="/">
  <TopicsPage />
</AuthGuard>
```

### Using ArticleForm

```typescript
import { ArticleForm, ArticleFormData } from '../components/editor/ArticleForm';

const handleSubmit = async (data: ArticleFormData) => {
  await articleService.createArticle({
    title: data.title,
    content: data.content,
    columnId: data.columnId || '',
    tagIds: data.tagIds,
  });
};

<ArticleForm
  onSubmit={handleSubmit}
  onSaveDraft={handleSaveDraft}
  isLoading={isSaving}
/>
```

### Using MarkdownEditor

```typescript
import { MarkdownEditor } from '../components/editor/MarkdownEditor';

<MarkdownEditor
  value={content}
  onChange={setContent}
  debounceMs={150}
  minHeight="500px"
  onSave={handleSave}
  onPublish={handlePublish}
/>
```

## Hooks

### useAutoSave

```typescript
import { useAutoSave } from '../hooks/useAutoSave';

const { lastSaved, isSaving, saveNow, setContent } = useAutoSave({
  interval: 30000, // 30 seconds
  onSave: async (content) => {
    await articleService.updateArticle({ id, content });
  },
  enabled: !!articleId,
});
```

### useDirtyState

```typescript
import { useDirtyState } from '../hooks/useDirtyState';

const { isDirty, markDirty, markClean } = useDirtyState();
```

### useKeyboardShortcuts

```typescript
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

useKeyboardShortcuts([
  { key: 's', modifiers: ['ctrl'], action: save, description: 'Save' },
  { key: 'Escape', action: closeModal, description: 'Close' },
]);
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Accessibility

- WCAG 2.1 Level AA compliant
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management in modals
- Screen reader announcements via live regions

## Performance

- Debounced preview updates (150ms)
- Auto-save every 30 seconds
- Search SLA < 2 seconds
- Preview SLA < 500ms