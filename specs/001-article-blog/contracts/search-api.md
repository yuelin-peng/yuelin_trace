# Search API Contract

## Service: SearchService (com.yuelin.search.v1.SearchService)

## Endpoints

### SearchArticles

Performs full-text search on articles.

**Request**: `SearchArticlesRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| query | string | Yes | Search query string |
| page_request | PageRequest | Yes | Pagination parameters |
| state | ArticleState | No | Filter by article state |
| topic_ids | string[] | No | Filter by topics (match any) |
| tag_ids | string[] | No | Filter by tags (match any) |
| author_id | string | No | Filter by author |
| sort_by | string | No | Sort field (relevance, created_at, published_at) |
| sort_order | string | No | Sort order (asc, desc) |

**Response**: `SearchArticlesResponse`
| Field | Type | Description |
|-------|------|-------------|
| results | SearchResultItem[] | Matching articles with scores |
| page_response | PageResponse | Pagination metadata |
| total_matches | int32 | Total number of matches |

**SearchResultItem**
| Field | Type | Description |
|-------|------|-------------|
| article | Article | The matched article |
| relevance_score | float | Relevance score (higher = more relevant) |
| highlighted_snippet | string | Content snippet with matching terms highlighted |

**Errors**:
- `SEARCH_INVALID_QUERY` (4000): Query is empty or invalid
- `SEARCH_RESULT_EMPTY` (4001): No matching results (returned as empty, not error)

**Auth**: Optional

## Search Behavior

- Searches across article title and content
- Returns results sorted by relevance by default
- Highlights matching terms in `highlighted_snippet`
- Filters are ANDed together (except tag_ids/topic_ids which are OR within category)
