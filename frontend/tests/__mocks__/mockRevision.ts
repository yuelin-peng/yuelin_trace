import { Revision } from '../../src/generated/com/yuelin/revision/v1/revision';

export const mockRevision: Revision = {
  id: 'revision-123',
  articleId: 'article-123',
  content: '# Original Content\n\nThis is the original content.',
  authorId: 'user-123',
  createdAt: new Date('2024-01-15T10:00:00'),
};

export const mockRevisions: Revision[] = [
  mockRevision,
  {
    id: 'revision-456',
    articleId: 'article-123',
    content: '# Updated Content\n\nThis is updated content with more details.',
    authorId: 'user-123',
    createdAt: new Date('2024-01-15T11:00:00'),
  },
  {
    id: 'revision-789',
    articleId: 'article-123',
    content: '# Final Content\n\nThis is the final version of the content.',
    authorId: 'user-123',
    createdAt: new Date('2024-01-15T12:00:00'),
  },
];

export const createMockRevision = (overrides: Partial<Revision> = {}): Revision => ({
  ...mockRevision,
  ...overrides,
});
