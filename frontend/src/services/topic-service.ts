import { tokenStorage } from '../lib/token-storage';

export interface Topic {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface CreateTopicRequest {
  name: string;
}

export interface UpdateTopicRequest {
  name?: string;
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

class TopicService {
  async createTopic(request: CreateTopicRequest): Promise<Topic> {
    return apiCall<Topic>('/api/topics', 'POST', request);
  }

  async getTopic(id: string): Promise<Topic> {
    return apiCall<Topic>(`/api/topics/${id}`);
  }

  async updateTopic(id: string, request: UpdateTopicRequest): Promise<Topic> {
    return apiCall<Topic>(`/api/topics/${id}`, 'PATCH', request);
  }

  async deleteTopic(id: string): Promise<void> {
    await apiCall(`/api/topics/${id}`, 'DELETE');
  }

  async listTopics(options?: {
    pageSize?: number;
    pageToken?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    topics: Topic[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  }> {
    const query = new URLSearchParams();
    if (options?.pageSize) query.append('page_size', String(options.pageSize));
    if (options?.pageToken) query.append('page_token', options.pageToken);
    if (options?.search) query.append('search', options.search);

    const queryString = query.toString();
    const response = await apiCall<{ topics: Topic[]; pageResponse: { nextPageToken?: string; hasMore: boolean; totalCount?: number } }>(`/api/topics${queryString ? `?${queryString}` : ''}`);

    return {
      topics: response.topics || [],
      total: response.pageResponse?.totalCount || 0,
      page: 1,
      pageSize: options?.pageSize || 20,
      hasMore: response.pageResponse?.hasMore || false,
    };
  }
}

export const topicService = new TopicService();
