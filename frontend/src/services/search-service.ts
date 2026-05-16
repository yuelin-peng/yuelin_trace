export interface SearchResult {
  article: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    state: string;
    topicId?: string;
    tagIds: string[];
    createdAt: string;
    publishedAt?: string;
  };
  relevanceScore: number;
  highlightedSnippet: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  hasMore: boolean;
}

class SearchService {
  async searchArticles(
    query: string,
    options?: {
      pageSize?: number;
      pageToken?: string;
      topicIds?: string[];
      tagIds?: string[];
      authorId?: string;
      sortBy?: 'relevance' | 'created_at' | 'published_at';
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    
    if (options?.pageSize) queryParams.append('page_size', String(options.pageSize));
    if (options?.pageToken) queryParams.append('page_token', options.pageToken);
    if (options?.topicIds?.length) queryParams.append('topic_ids', options.topicIds.join(','));
    if (options?.tagIds?.length) queryParams.append('tag_ids', options.tagIds.join(','));
    if (options?.authorId) queryParams.append('author_id', options.authorId);

    const response = await fetch(`/api/search?${queryParams.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error?.displayMessage || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const results: SearchResult[] = (data?.results || []).map((item: any) => ({
      article: item.article || {},
      relevanceScore: item.relevanceScore || 0,
      highlightedSnippet: item.highlightedSnippet || '',
    }));

    return {
      results,
      total: data?.totalMatches || 0,
      hasMore: data?.pageResponse?.hasMore || false,
    };
  }
}

export const searchService = new SearchService();
