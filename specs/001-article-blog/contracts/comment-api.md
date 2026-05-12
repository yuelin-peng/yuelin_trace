# Comment API Contract

## Service: CommentService (com.yuelin.comment.v1.CommentService)

## Endpoints

### CreateComment

Creates a new comment or reply.

**Request**: `CreateCommentRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| article_id | string | Yes | Associated article ID |
| parent_id | string | No | Parent comment ID (for replies) |
| content | string | Yes | Comment content (supports emoji) |

**Response**: `CreateCommentResponse`
| Field | Type | Description |
|-------|------|-------------|
| comment | Comment | The created comment |

**Errors**:
- `COMMENT_CONTENT_INVALID` (3002): Content is empty
- `COMMENT_DEPTH_EXCEEDED` (3003): Nesting exceeds 5 levels

**Auth**: Required

---

### GetComment

Fetches a single comment.

**Request**: `GetCommentRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Comment ID |

**Response**: `GetCommentResponse`
| Field | Type | Description |
|-------|------|-------------|
| comment | Comment | The requested comment |

**Errors**:
- `COMMENT_NOT_FOUND` (3000): Comment does not exist

**Auth**: Optional

---

### UpdateComment

Updates an existing comment.

**Request**: `UpdateCommentRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Comment ID |
| content | string | Yes | New content |

**Response**: `UpdateCommentResponse`
| Field | Type | Description |
|-------|------|-------------|
| comment | Comment | The updated comment |

**Errors**:
- `COMMENT_NOT_FOUND` (3000): Comment does not exist
- `COMMENT_ACCESS_DENIED` (3001): User is not the author

**Auth**: Required (author only)

---

### DeleteComment

Deletes a comment.

**Request**: `DeleteCommentRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Comment ID |

**Response**: `google.protobuf.Empty`

**Errors**:
- `COMMENT_NOT_FOUND` (3000): Comment does not exist
- `COMMENT_ACCESS_DENIED` (3001): User is not author or admin

**Auth**: Required (author/admin)

---

### ListComments

Lists comments with pagination.

**Request**: `ListCommentsRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| page_request | PageRequest | Yes | Pagination parameters |
| article_id | string | No | Filter by article |
| parent_id | string | No | Filter by parent (empty for top-level) |
| sort_by | string | No | Sort field (created_at) |
| sort_order | string | No | Sort order (asc, desc) |

**Response**: `ListCommentsResponse`
| Field | Type | Description |
|-------|------|-------------|
| comments | Comment[] | List of comments |
| page_response | PageResponse | Pagination metadata |

**Auth**: Optional
