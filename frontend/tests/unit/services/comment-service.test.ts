import { commentService, CommentWithReplies } from '../../../src/services/comment-service';
import { grpcClient } from '../../../src/services/grpc-client';
import { createMockComment } from '../../__mocks__/mockComment';

jest.mock('../../../src/services/grpc-client');

describe('CommentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const mockComment = createMockComment();
      const mockResponse = {
        comment: {
          ...mockComment,
          createdAt: mockComment.createdAt?.toISOString(),
          updatedAt: mockComment.updatedAt?.toISOString(),
        },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await commentService.createComment('article-123', 'Test comment');

      expect(result.content).toBe('This is a test comment');
    });

    it('should create a reply with parentId', async () => {
      const mockReply = createMockComment({ id: 'reply-1', parentId: 'comment-123' });
      const mockResponse = {
        comment: {
          ...mockReply,
          createdAt: mockReply.createdAt?.toISOString(),
          updatedAt: mockReply.updatedAt?.toISOString(),
        },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await commentService.createComment('article-123', 'Reply content', 'comment-123');

      expect(result.parentId).toBe('comment-123');
    });
  });

  describe('listComments', () => {
    it('should list comments for an article', async () => {
      const mockComments = [
        createMockComment(),
        createMockComment({ id: 'comment-456', content: 'Another comment' }),
      ];
      const mockResponse = {
        comments: mockComments.map((c) => ({
          ...c,
          createdAt: c.createdAt?.toISOString(),
          updatedAt: c.updatedAt?.toISOString(),
        })),
        pageResponse: { nextPageToken: '', hasMore: false, totalCount: 2 },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await commentService.listComments('article-123');

      expect(result.comments).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  describe('buildCommentTree', () => {
    it('should build a nested comment tree', () => {
      const comments = [
        createMockComment({ id: 'c1', parentId: '' }),
        createMockComment({ id: 'c2', parentId: 'c1' }),
        createMockComment({ id: 'c3', parentId: 'c2' }),
        createMockComment({ id: 'c4', parentId: '' }),
      ];

      const tree = commentService.buildCommentTree(comments, 5);

      expect(tree).toHaveLength(2); // c1 and c4 are root comments
      expect(tree[0].replies).toHaveLength(1); // c1 has one reply
      expect(tree[0].replies[0].replies).toHaveLength(1); // c2 has one reply
    });

    it('should respect max depth limit', () => {
      const comments = [
        createMockComment({ id: 'c1', parentId: '' }),
        createMockComment({ id: 'c2', parentId: 'c1' }),
        createMockComment({ id: 'c3', parentId: 'c2' }),
        createMockComment({ id: 'c4', parentId: 'c3' }),
        createMockComment({ id: 'c5', parentId: 'c4' }),
        createMockComment({ id: 'c6', parentId: 'c5' }), // Should be at root level due to maxDepth=5
      ];

      const tree = commentService.buildCommentTree(comments, 5);

      // c1 -> c2 -> c3 -> c4 -> c5 (depth 5)
      // c6 should be at root level since it would exceed maxDepth
      expect(tree).toHaveLength(2); // c1 and c6
      expect(tree[0].depth).toBe(0);
      expect(tree[0].replies[0].depth).toBe(1);
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const updatedComment = createMockComment({ content: 'Updated content' });
      const mockResponse = {
        comment: {
          ...updatedComment,
          createdAt: updatedComment.createdAt?.toISOString(),
          updatedAt: updatedComment.updatedAt?.toISOString(),
        },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await commentService.updateComment('comment-123', 'Updated content');

      expect(result?.content).toBe('Updated content');
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      (grpcClient.call as jest.Mock).mockResolvedValueOnce({});

      await expect(commentService.deleteComment('comment-123')).resolves.not.toThrow();
    });
  });
});
