import { Comment } from '../../src/generated/com/yuelin/comment/v1/comment';

export const mockComment: Comment = {
  id: 'comment-123',
  articleId: 'article-123',
  authorId: 'user-456',
  parentId: '',
  content: 'This is a test comment',
  createdAt: new Date('2024-01-16'),
  updatedAt: new Date('2024-01-16'),
};

export const mockComments: Comment[] = [
  mockComment,
  {
    ...mockComment,
    id: 'comment-456',
    parentId: 'comment-123',
    content: 'This is a reply',
  },
  {
    ...mockComment,
    id: 'comment-789',
    parentId: '',
    content: 'Another top-level comment',
  },
];

export const createMockComment = (overrides: Partial<Comment> = {}): Comment => ({
  ...mockComment,
  ...overrides,
});
