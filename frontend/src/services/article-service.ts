import { tokenStorage } from '../lib/token-storage';

export interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  state: string;
  columnId?: string;
  topicId?: string;
  tagIds: string[];
  version?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  columnId?: string;
  topicId?: string;
  tagIds?: string[];
}

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  state?: string;
  columnId?: string;
  topicId?: string;
  tagIds?: string[];
  version?: number;
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

class ArticleService {
  async createArticle(request: CreateArticleRequest): Promise<Article> {
    return apiCall<Article>('/api/articles', 'POST', request);
  }

  async getArticle(id: string): Promise<Article> {
    return apiCall<Article>(`/api/articles/${id}`);
  }

  async updateArticle(id: string, request: UpdateArticleRequest): Promise<Article> {
    return apiCall<Article>(`/api/articles/${id}`, 'PATCH', request);
  }

  async deleteArticle(id: string): Promise<void> {
    await apiCall(`/api/articles/${id}`, 'DELETE');
  }

  async listArticles(options?: {
    pageSize?: number;
    pageToken?: string;
    authorId?: string;
    state?: string;
    columnId?: string;
    topicId?: string;
    tagIds?: string[];
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    articles: Article[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  }> {
    const query = new URLSearchParams();
    if (options?.pageSize) query.append('page_size', String(options.pageSize));
    if (options?.pageToken) query.append('page_token', options.pageToken);
    if (options?.authorId) query.append('author_id', options.authorId);
    if (options?.state) query.append('state', options.state);
    if (options?.columnId) query.append('column_id', options.columnId);
    if (options?.topicId) query.append('topic_id', options.topicId);

    const queryString = query.toString();
    const response = await apiCall<{ articles: Article[]; pageResponse: { nextPageToken?: string; hasMore: boolean; totalCount?: number } }>(`/api/articles${queryString ? `?${queryString}` : ''}`);

    return {
      articles: response.articles || [],
      total: response.pageResponse?.totalCount || 0,
      page: 1,
      pageSize: options?.pageSize || 20,
      hasMore: response.pageResponse?.hasMore || false,
    };
  }
}

export const articleService = new ArticleService();
