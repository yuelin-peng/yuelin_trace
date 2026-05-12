# Tasks: Article Blog Platform

**Input**: Design documents from `/specs/001-article-blog/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md

**Tests**: Tests are NOT requested in the feature specification - skip test tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create frontend project structure with Next.js 14 App Router in frontend/src/
- [x] T002 Initialize TypeScript 5.x configuration in frontend/tsconfig.json
- [x] T003 [P] Configure Tailwind CSS with design tokens in frontend/tailwind.config.ts
- [x] T004 [P] Configure ESLint and Prettier for code quality in frontend/
- [x] T005 Install dependencies: React 18+, Next.js 14+, markdown-it, grpc-web, protobuf-ts
- [x] T006 Setup environment variables configuration in frontend/.env.local

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Install and configure trace-rpc-interfaces v1.0.9 dependency
- [x] T008 [P] Generate gRPC client code from proto definitions using protobuf-ts
- [x] T009 [P] Create gRPC client wrapper service in frontend/src/services/grpc-client.ts
- [x] T010 Create authentication context provider in frontend/src/contexts/AuthContext.tsx
- [x] T011 Create AuthGuard higher-order component for protected routes in frontend/src/components/auth/AuthGuard.tsx
- [x] T012 Configure Aliyun OSS SDK integration in frontend/src/services/oss-service.ts
- [x] T013 Setup error handling and toast notifications in frontend/src/lib/error-handler.ts
- [x] T014 Create base UI components: Button, Input, Card in frontend/src/components/common/
- [x] T014a [P] Create Modal component with focus trap, keyboard dismiss (Escape), and ARIA roles in frontend/src/components/common/Modal.tsx
- [x] T015 Setup React Query or SWR for server state management in frontend/src/lib/query-provider.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Author Creates and Publishes Article (Priority: P1) 🎯 MVP

**Goal**: Authors can write articles using Markdown with live preview, embed images/videos/code/PlantUML, and organize with columns/tags

**Independent Test**: Can be fully tested by creating an article with all content types, previewing it, and publishing it for public viewing

### Implementation for User Story 1

- [x] T016 [P] [US1] Create MarkdownEditor component with split-pane layout in frontend/src/components/editor/MarkdownEditor.tsx
- [x] T017 [P] [US1] Create MarkdownPreview component with markdown-it rendering in frontend/src/components/editor/MarkdownPreview.tsx
- [x] T018 [US1] Implement markdown-it configuration with plugins (anchor, emoji, task-lists, mark) in frontend/src/lib/markdown-config.ts
- [x] T019 [US1] Add PlantUML diagram renderer integration in frontend/src/components/editor/PlantUMLRenderer.tsx
- [x] T020 [US1] Add code syntax highlighting support in frontend/src/components/editor/CodeBlock.tsx
- [x] T021 [P] [US1] Create image upload component with OSS pre-signed URL flow in frontend/src/components/editor/ImageUploader.tsx
- [x] T022 [P] [US1] Create video embed component for video URLs in frontend/src/components/editor/VideoEmbed.tsx
- [x] T023 [US1] Create article form with title, content, column selector, and tag input in frontend/src/components/editor/ArticleForm.tsx
- [x] T024 [US1] Create ColumnSelector component for assigning articles to columns in frontend/src/components/editor/ColumnSelector.tsx
- [x] T025 [US1] Create TagInput component with autocomplete for multi-tag selection in frontend/src/components/editor/TagInput.tsx
- [x] T026 [US1] Implement article service wrapper for gRPC ArticleService in frontend/src/services/article-service.ts
- [x] T027 [US1] Create article list page at frontend/src/pages/index.tsx with article grid
- [x] T028 [US1] Create article editor page at frontend/src/pages/write/index.tsx
- [x] T029 [US1] Create article view page at frontend/src/pages/article/[id].tsx
- [x] T030 [US1] Implement debounced live preview updates (150ms debounce, 500ms target) in MarkdownEditor.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Reader Discovers and Engages with Content (Priority: P2)

**Goal**: Readers can search articles, read content, and engage with comments (with emoji and nested replies)

**Independent Test**: Can be fully tested by searching for articles, reading them, and submitting comments

### Implementation for User Story 2

- [x] T031 [P] [US2] Create SearchBar component with keyword input in frontend/src/components/search/SearchBar.tsx
- [x] T032 [P] [US2] Create SearchResults component with highlighted snippets in frontend/src/components/search/SearchResults.tsx
- [x] T033 [US2] Implement search service wrapper for gRPC SearchService in frontend/src/services/search-service.ts
- [x] T034 [US2] Integrate search into homepage (frontend/src/pages/index.tsx) with 2-second SLA
- [x] T035 [P] [US2] Create CommentList component for displaying threaded comments in frontend/src/components/comment/CommentList.tsx
- [x] T036 [P] [US2] Create CommentItem component with nested reply rendering (up to 5 levels) in frontend/src/components/comment/CommentItem.tsx
- [x] T037 [US2] Create CommentForm component with emoji picker support in frontend/src/components/comment/CommentForm.tsx
- [x] T038 [US2] Create CommentComposer component with parent selection for replies in frontend/src/components/comment/CommentComposer.tsx
- [x] T039 [US2] Implement comment service wrapper for gRPC CommentService in frontend/src/services/comment-service.ts
- [x] T040 [US2] Integrate comments into article view page (frontend/src/pages/article/[id].tsx)
- [x] T041 [US2] Add tag-based filtering to article list with ListArticlesRequest tag_ids filter
- [x] T042 [US2] Implement tag filter UI component in frontend/src/components/article/TagFilter.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - User Manages Account (Priority: P2)

**Goal**: Users can register, login, and logout to access personalized features

**Independent Test**: Can be fully tested by registering a new account, logging in, and logging out

### Implementation for User Story 3

- [x] T043 [P] [US3] Create RegisterForm component with email, password, displayName fields in frontend/src/components/auth/RegisterForm.tsx
- [x] T044 [P] [US3] Create LoginForm component with email and password fields in frontend/src/components/auth/LoginForm.tsx
- [x] T045 [US3] Create AuthCallback page for OAuth/token handling in frontend/src/pages/auth/callback.tsx
- [x] T046 [US3] Implement auth service wrapper for gRPC AuthService in frontend/src/services/auth-service.ts
- [x] T047 [US3] Create auth pages: login at frontend/src/pages/auth/login.tsx, register at frontend/src/pages/auth/register.tsx
- [x] T048 [US3] Implement JWT token storage and refresh logic in frontend/src/lib/token-storage.ts
- [x] T049 [US3] Create UserProfile dropdown component showing current user in frontend/src/components/auth/UserProfile.tsx
- [x] T050 [US3] Add logout functionality to UserProfile component with LogoutRequest call
- [x] T051 [US3] Integrate AuthGuard on protected routes (write, profile pages)
- [x] T052 [US3] Add registration confirmation flow (email verification or immediate login)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Author Revises Content (Priority: P3)

**Goal**: Authors can auto-save work every 30 seconds and view/restore revision history

**Independent Test**: Can be fully tested by starting an article, waiting for auto-save, making changes, and viewing the revision history

### Implementation for User Story 4

- [x] T053 [US4] Create auto-save hook with 30-second debounce in frontend/src/hooks/useAutoSave.ts
- [x] T054 [US4] Implement dirty state tracking for unsaved changes indicator in frontend/src/hooks/useDirtyState.ts
- [x] T055 [US4] Create RevisionHistoryPanel component for displaying saved revisions in frontend/src/components/editor/RevisionHistoryPanel.tsx
- [x] T056 [US4] Create RevisionListItem component with timestamps and content preview in frontend/src/components/editor/RevisionListItem.tsx
- [x] T057 [US4] Implement revision service wrapper for gRPC RevisionService in frontend/src/services/revision-service.ts
- [x] T058 [US4] Integrate auto-save into ArticleForm component (frontend/src/components/editor/ArticleForm.tsx)
- [x] T059 [US4] Add revision history panel to article editor page (frontend/src/pages/write/index.tsx)
- [x] T060 [US4] Implement revision comparison view showing content differences in frontend/src/components/editor/RevisionCompare.tsx
- [x] T061 [US4] Add restore functionality with confirmation dialog in RevisionHistoryPanel.tsx
- [x] T062 [US4] Handle concurrent editing conflicts with last-write-wins strategy (inform user of potential overwrites)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: User Story 5 - Admin Manages Topics (Priority: P3)

**Goal**: Administrators can create and manage topic categories for article organization

**Independent Test**: Can be fully tested by creating a topic, listing topics, editing, and deleting a topic

### Implementation for User Story 5

- [x] T063 [P] [US5] Create TopicList component for displaying all topics in frontend/src/components/topic/TopicList.tsx
- [x] T064 [P] [US5] Create TopicForm component with name input in frontend/src/components/topic/TopicForm.tsx
- [x] T065 [US5] Create TopicCard component with edit/delete actions in frontend/src/components/topic/TopicCard.tsx
- [x] T066 [US5] Implement topic service wrapper for gRPC TopicService in frontend/src/services/topic-service.ts
- [x] T067 [US5] Create topic management page at frontend/src/pages/admin/topics.tsx
- [x] T068 [US5] Add AuthGuard role check (Admin only) to topic management page
- [x] T069 [US5] Add topic creation dialog with slug auto-generation from topic name
- [x] T070 [US5] Add topic edit/delete functionality with confirmation dialog
- [x] T071 [US5] Add topic search/filter to topic management list

**Checkpoint**: Topic management is now functional for admin users

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T072 [P] Add loading states and skeleton components for all async operations
- [x] T073 [P] Add empty states for article list, comment list, search results
- [x] T074 [P] Add ARIA labels and roles to all interactive components in frontend/src/components/
- [x] T075 [P] Add keyboard navigation support (Tab, Enter, Escape) to all components in frontend/src/components/
- [x] T076 Implement focus management for modals and dialogs in frontend/src/components/common/Modal.tsx
- [x] T077 Add screen reader announcements for async operations (search, save, errors)
- [x] T078 [P] Add color contrast validation (4.5:1 for normal text, 3:1 for large text) to all styled components
- [x] T079 Add responsive design verification for Mobile, Tablet, Desktop breakpoints
- [x] T080 Implement error boundaries and graceful degradation for API failures
- [x] T081 Optimize performance: ensure preview updates within 500ms SLA
- [x] T082 Add keyboard shortcuts for editor (Ctrl+S for manual save, Ctrl+B for bold, etc.)
- [x] T083 [P] Update documentation in docs/ folder with API usage examples
- [x] T084 Run quickstart.md validation to verify development setup
- [x] T085 Code cleanup and remove any unused imports/components
- [x] T086 [P] Add unit tests for services with mocked gRPC calls
- [x] T087 [P] Add unit tests for React components
- [x] T088 [P] Add unit tests for custom hooks

---

## Phase 8: Testing

**Purpose**: Unit tests for services, components, and hooks

- [x] T086 [P] Add unit tests for services with mocked gRPC calls in frontend/tests/unit/services/
- [x] T087 [P] Add unit tests for React components in frontend/tests/unit/components/
- [x] T088 [P] Add unit tests for custom hooks in frontend/tests/unit/hooks/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Can integrate with US1 for article display
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 for editor
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Depends on US3 for admin access

### Within Each User Story

- Components before pages
- Services before components
- Hooks before components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- All US1 tasks marked [P] can run in parallel (T016, T017, T021, T022)
- All US2 tasks marked [P] can run in parallel (T031, T032, T035, T036)
- All US3 tasks marked [P] can run in parallel (T043, T044)
- All US5 tasks marked [P] can run in parallel (T063, T064)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)

---

## Parallel Examples

```bash
# US1 parallel tasks:
Task: "Create MarkdownEditor component in frontend/src/components/editor/MarkdownEditor.tsx"
Task: "Create MarkdownPreview component in frontend/src/components/editor/MarkdownPreview.tsx"
Task: "Create image upload component in frontend/src/components/editor/ImageUploader.tsx"
Task: "Create video embed component in frontend/src/components/editor/VideoEmbed.tsx"

# US2 parallel tasks:
Task: "Create SearchBar component in frontend/src/components/search/SearchBar.tsx"
Task: "Create SearchResults component in frontend/src/components/search/SearchResults.tsx"
Task: "Create CommentList component in frontend/src/components/comment/CommentList.tsx"
Task: "Create CommentItem component in frontend/src/components/comment/CommentItem.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Polish phase → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Article Editor)
   - Developer B: User Story 2 (Search + Comments)
   - Developer C: User Story 3 (Auth)
   - Developer D: User Story 4 (Auto-save + Revisions)
   - Developer E: User Story 5 (Topic Management)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Auto-save interval: 30 seconds (per FR-009 and SC-005)
- Comment nesting: max 5 levels (per SC-006 and assumption)
- Performance targets: search <2s, preview <500ms
- Topic management requires Admin role (per TopicService contract)