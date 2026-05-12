import { revisionService } from '../../../src/services/revision-service';
import { grpcClient } from '../../../src/services/grpc-client';
import { createMockRevision } from '../../__mocks__/mockRevision';

jest.mock('../../../src/services/grpc-client');

describe('RevisionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listRevisions', () => {
    it('should list revisions for an article', async () => {
      const mockRevisions = [
        createMockRevision({ id: 'rev-1' }),
        createMockRevision({ id: 'rev-2' }),
      ];
      const mockResponse = {
        revisions: mockRevisions.map((r) => ({
          ...r,
          createdAt: r.createdAt?.toISOString(),
        })),
        pageResponse: { nextPageToken: '', hasMore: false, totalCount: 2 },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await revisionService.listRevisions('article-123', { sortOrder: 'desc' });

      expect(result.revisions).toHaveLength(2);
      expect(result.revisions[0].preview).toBeDefined();
    });
  });

  describe('getRevision', () => {
    it('should fetch a revision by id', async () => {
      const mockRevision = createMockRevision();
      const mockResponse = {
        revision: {
          ...mockRevision,
          createdAt: mockRevision.createdAt?.toISOString(),
        },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await revisionService.getRevision('revision-123');

      expect(result?.content).toBe('# Original Content\n\nThis is the original content.');
    });
  });

  describe('restoreRevision', () => {
    it('should restore an article from revision', async () => {
      const mockResponse = {
        articleId: 'article-123',
        revisionId: 'revision-456',
        restoredAt: new Date().toISOString(),
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await revisionService.restoreRevision('revision-456', 'Restored Title');

      expect(result.articleId).toBe('article-123');
      expect(result.revisionId).toBe('revision-456');
    });
  });

  describe('compareRevisions', () => {
    it('should compare two revisions', () => {
      const rev1 = createMockRevision({ content: 'Line 1\nLine 2\nLine 3' });
      const rev2 = createMockRevision({ content: 'Line 1\nLine 2 Modified\nLine 4' });

      const comparison = revisionService.compareRevisions(rev1, rev2);

      expect(comparison.added).toContain('Line 4');
      expect(comparison.removed).toContain('Line 3');
    });

    it('should handle identical revisions', () => {
      const rev1 = createMockRevision({ content: 'Same content' });
      const rev2 = createMockRevision({ content: 'Same content' });

      const comparison = revisionService.compareRevisions(rev1, rev2);

      expect(comparison.added).toHaveLength(0);
      expect(comparison.removed).toHaveLength(0);
    });
  });

  describe('generatePreview', () => {
    it('should generate a preview from content', () => {
      const service = revisionService as any;
      
      expect(service.generatePreview('Short content')).toBe('Short content');
      
      const longContent = 'This is a very long piece of content that should be truncated because it exceeds the maximum length limit for previews';
      const preview = service.generatePreview(longContent, 50);
      expect(preview.length).toBeLessThanOrEqual(53); // 50 + '...'
      expect(preview.endsWith('...')).toBe(true);
    });

    it('should strip markdown formatting', () => {
      const service = revisionService as any;
      
      const markdown = '# Title\n\n**Bold** and *italic* content';
      const preview = service.generatePreview(markdown);
      
      expect(preview).not.toContain('#');
      expect(preview).not.toContain('**');
      expect(preview).not.toContain('*');
    });
  });
});
