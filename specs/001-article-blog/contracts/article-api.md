# Article API Contract

## Service: ArticleService (com.yuelin.article.v1.ArticleService)

## Endpoints

### CreateArticle

Creates a new article.

**Request**: `CreateArticleRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Article title (1-200 characters) |
| content | string | Yes | Markdown content (1-50000 characters) |
| column_id | string | No | Associated column ID |
| series_id | string | No | Associated series ID |
| tag_ids | string[] | No | Tag IDs to associate |
| topic_id | string | No | Associated topic ID |

**Response**: `CreateArticleResponse`
| Field | Type | Description |
|-------|------|-------------|
| article | Article | The created article |

**Errors**:
- `ARTICLE_TITLE_INVALID` (1003): Title is empty or exceeds 200 chars
- `ARTICLE_CONTENT_INVALID` (1004): Content is empty or exceeds 50000 chars

**Auth**: Required (Author role)

---

### GetArticle

Fetches a single article by ID.

**Request**: `GetArticleRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Article ID |
| fields | FieldMask | No | Selective response fields |

**Response**: `GetArticleResponse`
| Field | Type | Description |
|-------|------|-------------|
| article | Article | The requested article |

**Errors**:
- `ARTICLE_NOT_FOUND` (1000): Article does not exist

**Auth**: Optional (Draft articles require author auth)

---

### UpdateArticle

Updates an existing article with partial update support.

**Request**: `UpdateArticleRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Article ID |
| update_mask | FieldMask | Yes | Fields to update |
| title | string | No | New title |
| content | string | No | New content |
| column_id | string | No | New column ID (empty to clear) |
| series_id | string | No | New series ID (empty to clear) |
| tag_ids | string[] | No | New tag IDs |
| topic_id | string | No | New topic ID (empty to clear) |
| state | ArticleState | No | New state |

**Response**: `UpdateArticleResponse`
| Field | Type | Description |
|-------|------|-------------|
| article | Article | The updated article |

**Errors**:
- `ARTICLE_NOT_FOUND` (1000): Article does not exist
- `ARTICLE_ACCESS_DENIED` (1002): User is not the author
- `ARTICLE_INVALID_STATE` (1001): Invalid state transition

**Auth**: Required (author only)

---

### DeleteArticle

Soft-deletes an article (30-day recovery).

**Request**: `DeleteArticleRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Article ID to delete |

**Response**: `google.protobuf.Empty`

**Errors**:
- `ARTICLE_NOT_FOUND` (1000): Article does not exist
- `ARTICLE_ACCESS_DENIED` (1002): User is not the author or admin

**Auth**: Required (author/admin)

---

### ListArticles

Lists articles with filters and pagination.

**Request**: `ListArticlesRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| page_request | PageRequest | Yes | Pagination parameters |
| author_id | string | No | Filter by author |
| state | ArticleState | No | Filter by state |
| column_id | string | No | Filter by column |
| series_id | string | No | Filter by series |
| topic_id | string | No | Filter by topic |
| tag_ids | string[] | No | Filter by tags (match any) |
| sort_by | string | No | Sort field (created_at, updated_at, title) |
| sort_order | string | No | Sort order (asc, desc) |

**Response**: `ListArticlesResponse`
| Field | Type | Description |
|-------|------|-------------|
| articles | Article[] | List of articles |
| page_response | PageResponse | Pagination metadata |

**Auth**: Optional
