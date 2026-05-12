import { articleService } from '../../../src/services/article-service';
import { grpcClient } from '../../../src/services/grpc-client';
import { createMockArticle } from '../../__mocks__/mockArticle';

jest.mock('../../../src/services/grpc-client');

describe('ArticleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createArticle', () => {
    it('should create an article successfully', async () => {
      const mockResponse = {
        article: {
          id: 'new-article-id',
          title: 'New Article',
          content: 'Content here',
          authorId: 'user-123',
          state: 1,
          columnId: '',
          seriesId: '',
          tagIds: [],
          topicId: '',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
        },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await articleService.createArticle({
        title: 'New Article',
        content: 'Content here',
        columnId: '',
        seriesId: '',
        tagIds: [],
        topicId: '',
      });

      expect(grpcClient.call).toHaveBeenCalledWith(
        'com.yuelin.article.v1.ArticleService',
        'CreateArticle',
        expect.any(Object)
      );
      expect(result.article?.id).toBe('new-article-id');
    });

    it('should throw error when creation fails', async () => {
      (grpcClient.call as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(
        articleService.createArticle({
          title: 'Test',
          content: 'Content',
          columnId: '',
          seriesId: '',
          tagIds: [],
          topicId: '',
        })
      ).rejects.toThrow('Network error');
    });
  });

  describe('getArticle', () => {
    it('should fetch an article by id', async () => {
      const mockArticle = createMockArticle();
      const mockResponse = {
        article: {
          ...mockArticle,
          createdAt: mockArticle.createdAt?.toISOString(),
          updatedAt: mockArticle.updatedAt?.toISOString(),
          publishedAt: mockArticle.publishedAt?.toISOString(),
        },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await articleService.getArticle('article-123');

      expect(grpcClient.call).toHaveBeenCalledWith(
        'com.yuelin.article.v1.ArticleService',
        'GetArticle',
        expect.objectContaining({ id: 'article-123' })
      );
      expect(result?.title).toBe('Test Article');
    });

    it('should return undefined for non-existent article', async () => {
      (grpcClient.call as jest.Mock).mockResolvedValueOnce({ article: null });

      const result = await articleService.getArticle('non-existent');

      expect(result).toBeUndefined();
    });
  });

  describe('listArticles', () => {
    it('should list articles with pagination', async () => {
      const mockArticles = [createMockArticle(), createMockArticle({ id: 'article-2' })];
      const mockResponse = {
        articles: mockArticles.map((a) => ({
          ...a,
          createdAt: a.createdAt?.toISOString(),
          updatedAt: a.updatedAt?.toISOString(),
        })),
        pageResponse: {
          nextPageToken: 'next-token',
          hasMore: true,
          totalCount: 10,
        },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await articleService.listArticles({
        pageSize: 20,
        state: 2,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      expect(result.articles).toHaveLength(2);
      expect(result.total).toBe(10);
      expect(result.hasMore).toBeUndefined();
    });

    it('should handle empty results', async () => {
      (grpcClient.call as jest.Mock).mockResolvedValueOnce({
        articles: [],
        pageResponse: { nextPageToken: '', hasMore: false, totalCount: 0 },
      });

      const result = await articleService.listArticles();

      expect(result.articles).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('updateArticle', () => {
    it('should update an article', async () => {
      const mockArticle = createMockArticle({ title: 'Updated Title' });
      const mockResponse = {
        article: {
          ...mockArticle,
          createdAt: mockArticle.createdAt?.toISOString(),
          updatedAt: mockArticle.updatedAt?.toISOString(),
        },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await articleService.updateArticle({
        id: 'article-123',
        updateMask: ['title'],
        title: 'Updated Title',
        content: '',
        columnId: '',
        seriesId: '',
        tagIds: [],
        topicId: '',
        state: 0,
      });

      expect(result?.title).toBe('Updated Title');
    });
  });

  describe('deleteArticle', () => {
    it('should delete an article', async () => {
      (grpcClient.call as jest.Mock).mockResolvedValueOnce({});

      await expect(articleService.deleteArticle('article-123')).resolves.not.toThrow();

      expect(grpcClient.call).toHaveBeenCalledWith(
        'com.yuelin.article.v1.ArticleService',
        'DeleteArticle',
        expect.any(Object)
      );
    });
  });
});
