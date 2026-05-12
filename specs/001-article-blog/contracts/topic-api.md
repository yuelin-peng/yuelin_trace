# Topic API Contract

## Service: TopicService (com.yuelin.topic.v1.TopicService)

## Endpoints

### CreateTopic

Creates a new topic.

**Request**: `CreateTopicRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Topic name |

**Response**: `CreateTopicResponse`
| Field | Type | Description |
|-------|------|-------------|
| topic | Topic | The created topic |

**Errors**:
- `TOPIC_ALREADY_EXISTS` (5001): Topic with same name already exists

**Auth**: Required (Admin)

---

### GetTopic

Fetches a single topic.

**Request**: `GetTopicRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Topic ID |

**Response**: `GetTopicResponse`
| Field | Type | Description |
|-------|------|-------------|
| topic | Topic | The requested topic |

**Errors**:
- `TOPIC_NOT_FOUND` (5000): Topic does not exist

**Auth**: Optional

---

### UpdateTopic

Updates an existing topic with partial update support.

**Request**: `UpdateTopicRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Topic ID |
| update_mask | FieldMask | Yes | Fields to update |
| name | string | No | New name |

**Response**: `UpdateTopicResponse`
| Field | Type | Description |
|-------|------|-------------|
| topic | Topic | The updated topic |

**Errors**:
- `TOPIC_NOT_FOUND` (5000): Topic does not exist
- `TOPIC_ALREADY_EXISTS` (5001): New name already exists

**Auth**: Required (Admin)

---

### DeleteTopic

Deletes a topic.

**Request**: `DeleteTopicRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Topic ID |

**Response**: `google.protobuf.Empty`

**Errors**:
- `TOPIC_NOT_FOUND` (5000): Topic does not exist

**Auth**: Required (Admin)

---

### ListTopics

Lists topics with pagination.

**Request**: `ListTopicsRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| page_request | PageRequest | Yes | Pagination parameters |
| search | string | No | Search filter on name |
| sort_by | string | No | Sort field (created_at, name) |
| sort_order | string | No | Sort order (asc, desc) |

**Response**: `ListTopicsResponse`
| Field | Type | Description |
|-------|------|-------------|
| topics | Topic[] | List of topics |
| page_response | PageResponse | Pagination metadata |

**Auth**: Optional
