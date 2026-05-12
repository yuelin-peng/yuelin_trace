import { searchService, SearchResult } from '../../../src/services/search-service';
import { grpcClient } from '../../../src/services/grpc-client';
import { createMockArticle } from '../../__mocks__/mockArticle';

jest.mock('../../../src/services/grpc-client');

describe('SearchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchArticles', () => {
    it('should search articles with query', async () => {
      const mockArticle = createMockArticle();
      const mockResponse = {
        results: [
          {
            article: {
              ...mockArticle,
              createdAt: mockArticle.createdAt?.toISOString(),
              updatedAt: mockArticle.updatedAt?.toISOString(),
            },
            relevanceScore: 0.95,
            highlightedSnippet: '<mark>React</mark> hooks tutorial',
          },
        ],
        pageResponse: {
          nextPageToken: '',
          hasMore: false,
          totalCount: 1,
        },
        totalMatches: 1,
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await searchService.searchArticles('react hooks');

      expect(result.results).toHaveLength(1);
      expect(result.results[0].relevanceScore).toBe(0.95);
      expect(result.total).toBe(1);
    });

    it('should search with filters', async () => {
      const mockResponse = {
        results: [],
        pageResponse: {
          nextPageToken: '',
          hasMore: false,
          totalCount: 0,
        },
        totalMatches: 0,
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await searchService.searchArticles('typescript', {
        tagIds: ['react'],
        sortBy: 'relevance',
        sortOrder: 'desc',
      });

      expect(grpcClient.call).toHaveBeenCalledWith(
        'com.yuelin.search.v1.SearchService',
        'SearchArticles',
        expect.objectContaining({
          query: 'typescript',
          tagIds: ['react'],
        })
      );
    });

    it('should handle pagination', async () => {
      const mockResponse = {
        results: [],
        pageResponse: {
          nextPageToken: 'next-page-token',
          hasMore: true,
          totalCount: 50,
        },
        totalMatches: 50,
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await searchService.searchArticles('test', {
        pageToken: 'page-1',
        pageSize: 10,
      });

      expect(grpcClient.call).toHaveBeenCalledWith(
        'com.yuelin.search.v1.SearchService',
        'SearchArticles',
        expect.objectContaining({
          pageRequest: {
            pageSize: 10,
            pageToken: 'page-1',
          },
        })
      );
    });

    it('should handle empty results', async () => {
      const mockResponse = {
        results: [],
        pageResponse: {
          nextPageToken: '',
          hasMore: false,
          totalCount: 0,
        },
        totalMatches: 0,
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await searchService.searchArticles('nonexistent');

      expect(result.results).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });

    it('should handle search errors', async () => {
      (grpcClient.call as jest.Mock).mockRejectedValueOnce(new Error('Search service unavailable'));

      await expect(searchService.searchArticles('test')).rejects.toThrow('Search service unavailable');
    });
  });
});