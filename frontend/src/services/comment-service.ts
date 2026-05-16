import { tokenStorage } from '../lib/token-storage';

export interface Comment {
  id: string;
  articleId: string;
  authorId: string;
  parentId?: string;
  content: string;
  depth: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

async function apiCall<T>(endpoint: string, method: string = 'GET', body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = tokenStorage.getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.displayMessage || `HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

class CommentService {
  async createComment(articleId: string, content: string, parentId?: string): Promise<Comment> {
    return apiCall<Comment>('/api/comments', 'POST', {
      articleId,
      content,
      parentId,
    });
  }

  async getComment(id: string): Promise<Comment> {
    return apiCall<Comment>(`/api/comments/${id}`);
  }

  async updateComment(id: string, content: string): Promise<Comment> {
    return apiCall<Comment>(`/api/comments/${id}`, 'PATCH', { content });
  }

  async deleteComment(id: string): Promise<void> {
    await apiCall(`/api/comments/${id}`, 'DELETE');
  }

  async listComments(articleId: string, options?: {
    pageSize?: number;
    pageToken?: string;
    parentId?: string;
  }): Promise<{
    comments: Comment[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  }> {
    const query = new URLSearchParams();
    if (options?.pageSize) query.append('page_size', String(options.pageSize));
    if (options?.pageToken) query.append('page_token', options.pageToken);
    if (options?.parentId) query.append('parent_id', options.parentId);

    const queryString = query.toString();
    const response = await apiCall<{ comments: Comment[]; pageResponse: { nextPageToken?: string; hasMore: boolean; totalCount?: number } }>(`/api/articles/${articleId}/comments${queryString ? `?${queryString}` : ''}`);

    return {
      comments: response.comments || [],
      total: response.pageResponse?.totalCount || 0,
      page: 1,
      pageSize: options?.pageSize || 20,
      hasMore: response.pageResponse?.hasMore || false,
    };
  }

  buildCommentTree(comments: Comment[], maxDepth: number = 5): CommentWithReplies[] {
    const commentMap = new Map<string, CommentWithReplies>();
    const roots: CommentWithReplies[] = [];

    // First pass: create CommentWithReplies for all comments
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build tree
    comments.forEach((comment) => {
      const node = commentMap.get(comment.id)!;
      if (comment.parentId && commentMap.has(comment.parentId) && comment.depth < maxDepth) {
        const parent = commentMap.get(comment.parentId)!;
        parent.replies.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}

export const commentService = new CommentService();
