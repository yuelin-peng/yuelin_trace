import { grpcClient } from './grpc-client';
import {
  SearchArticlesRequest,
  SearchArticlesResponse,
  SearchResultItem,
} from '../generated/com/yuelin/search/v1/search';
import { Article } from '../generated/com/yuelin/article/v1/article';

export interface SearchResult {
  article: Article;
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
    try {
      const request: SearchArticlesRequest = {
        query,
        pageRequest: {
          pageSize: options?.pageSize || 20,
          pageToken: options?.pageToken || '',
        },
        state: 0,
        topicIds: options?.topicIds || [],
        tagIds: options?.tagIds || [],
        authorId: options?.authorId || '',
        sortBy: options?.sortBy || '',
        sortOrder: options?.sortOrder || '',
      };

      const response = await grpcClient.call<SearchArticlesResponse>(
        'com.yuelin.search.v1.SearchService',
        'SearchArticles',
        SearchArticlesRequest.toJSON(request)
      );

      const results: SearchResult[] = (response?.results || []).map((item) => ({
        article: item.article ? Article.fromJSON(item.article) : ({} as Article),
        relevanceScore: item.relevanceScore || 0,
        highlightedSnippet: item.highlightedSnippet || '',
      }));

      return {
        results,
        total: response?.totalMatches || 0,
        hasMore: response?.pageResponse?.hasMore || false,
      };
    } catch (error) {
      console.error('SearchArticles failed:', error);
      throw error;
    }
  }
}

export const searchService = new SearchService();