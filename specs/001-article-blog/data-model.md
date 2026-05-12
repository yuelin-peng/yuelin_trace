# Data Model: Article Blog Platform

## Entity Definitions

Based on proto definitions from trace-rpc-interfaces v1.0.9

---

## User

**Source**: `com.yuelin.user.v1.User`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique identifier |
| email | String | Unique, Indexed | User email address |
| display_name | String | Required | Public display name |
| role | Enum | Required | Admin, Author, Reader, Guest |
| created_at | Timestamp | Auto | Account creation time |
| updated_at | Timestamp | Auto | Last modification time |

**Relationships**:
- Author: 1:N with Article
- Author: 1:N with Comment
- Author: 1:N with Revision

---

## Article

**Source**: `com.yuelin.article.v1.Article`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique identifier |
| title | String | 1-200 chars | Article title |
| content | String | 1-50000 chars | Markdown content |
| author_id | UUID | Foreign Key | Reference to User |
| state | Enum | Required | Draft, Published, Archived |
| column_id | UUID | Optional | Reference to Column |
| series_id | UUID | Optional | Reference to Series |
| topic_id | UUID | Optional | Reference to Topic |
| tag_ids | UUID[] | Many-to-Many | Via ArticleTag join |
| created_at | Timestamp | Auto | Creation time |
| updated_at | Timestamp | Auto | Last modification |
| published_at | Timestamp | Nullable | Publication time |

**State Transitions**:
- Draft → Published (publish action)
- Draft → Archived (archive action)
- Published → Archived (archive action)
- Archived → Draft (unarchive action)

**Relationships**:
- Article: N:1 with User (author)
- Article: N:1 with Topic (optional)
- Article: N:1 with Column (optional)
- Article: N:1 with Series (optional)
- Article: 1:N with Comment
- Article: 1:N with Revision
- Article: N:M with Tag (via ArticleTag)

---

## Comment

**Source**: `com.yuelin.comment.v1.Comment`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique identifier |
| article_id | UUID | Foreign Key | Reference to Article |
| author_id | UUID | Foreign Key | Reference to User |
| parent_id | UUID | Self-ref, Nullable | Parent comment for threading |
| content | String | Required | Comment text with emoji |
| created_at | Timestamp | Auto | Creation time |
| updated_at | Timestamp | Auto | Last modification |

**Constraints**:
- Maximum nesting depth: 5 levels
- Top-level comments have empty parent_id

**Relationships**:
- Comment: N:1 with Article
- Comment: N:1 with User (author)
- Comment: 1:N with Comment (children/replies)

---

## Revision

**Source**: `com.yuelin.revision.v1.Revision`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique identifier |
| article_id | UUID | Foreign Key | Reference to Article |
| content | String | Required | Article content snapshot |
| author_id | UUID | Foreign Key | Who created this revision |
| created_at | Timestamp | Auto | Revision creation time |

**Note**: Revisions store only content, not metadata (title, tags, etc.)

**Relationships**:
- Revision: N:1 with Article
- Revision: N:1 with User (author)

---

## Topic

**Source**: `com.yuelin.topic.v1.Topic`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique identifier |
| name | String | Required, Unique | Topic display name |
| slug | String | Unique, Indexed | URL-friendly identifier |
| created_at | Timestamp | Auto | Creation time |

**Relationships**:
- Topic: 1:N with Article

---

## Tag

**Note**: Tag entity not defined in proto, inferred from usage

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique identifier |
| name | String | Required, Unique | Tag display name |
| created_at | Timestamp | Auto | Creation time |

**Relationships**:
- Tag: N:M with Article (via ArticleTag)

---

## ArticleTag (Join Table)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| article_id | UUID | Foreign Key | Reference to Article |
| tag_id | UUID | Foreign Key | Reference to Tag |

**Primary Key**: (article_id, tag_id)

---

## Column

**Note**: Column entity not in proto, inferred from column_id usage

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique identifier |
| name | String | Required | Column display name |
| description | String | Optional | Column description |
| created_at | Timestamp | Auto | Creation time |

**Relationships**:
- Column: 1:N with Article

---

## Series

**Note**: Series entity not in proto, inferred from series_id usage

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique identifier |
| name | String | Required | Series display name |
| description | String | Optional | Series description |
| created_at | Timestamp | Auto | Creation time |

**Relationships**:
- Series: 1:N with Article

---

## Data Model Diagram

```
User (1) ───────────────< (N) Article
  │                          │
  │                          │
  ├──── (N) Comment           ├──── (N) Revision
  │        │                  │
  │        │                  │
  │        1 (parent)         │
  │        │                  │
  └────────┼──────────────────┘
           │
     Comment (self-ref)

Article ───────< ArticleTag >────── Tag
   │
   ├──── (N:1) Topic
   ├──── (N:1) Column
   └──── (N:1) Series
```