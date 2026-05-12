# Revision API Contract

## Service: RevisionService (com.yuelin.revision.v1.RevisionService)

## Endpoints

### ListRevisions

Lists revisions for an article.

**Request**: `ListRevisionsRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| article_id | string | Yes | Article ID |
| page_request | PageRequest | Yes | Pagination parameters |
| sort_order | string | No | Sort order (asc=oldest first, desc=newest first) |

**Response**: `ListRevisionsResponse`
| Field | Type | Description |
|-------|------|-------------|
| revisions | Revision[] | List of revisions |
| page_response | PageResponse | Pagination metadata |

**Auth**: Required (author)

---

### GetRevision

Fetches a single revision.

**Request**: `GetRevisionRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Revision ID |

**Response**: `GetRevisionResponse`
| Field | Type | Description |
|-------|------|-------------|
| revision | Revision | The requested revision |

**Errors**:
- `REVISION_NOT_FOUND` (6000): Revision does not exist

**Auth**: Required (author)

---

### RestoreRevision

Restores an article from a revision.

**Request**: `RestoreRevisionRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| revision_id | string | Yes | Revision ID to restore from |
| title | string | No | New title for restored article |

**Response**: `RestoreRevisionResponse`
| Field | Type | Description |
|-------|------|-------------|
| article_id | string | Restored article ID |
| revision_id | string | Source revision ID |
| restored_at | Timestamp | Restoration timestamp |

**Errors**:
- `REVISION_NOT_FOUND` (6000): Revision does not exist
- `REVISION_RESTORE_FAILED` (6001): Restore operation failed

**Auth**: Required (author)

**Note**: Restore creates a new revision with the restored content rather than overwriting.
