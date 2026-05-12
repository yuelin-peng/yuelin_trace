import { Article, ArticleState } from '../../src/generated/com/yuelin/article/v1/article';

export const mockArticle: Article = {
  id: 'article-123',
  title: 'Test Article',
  content: '# Hello World\n\nThis is a test article.',
  authorId: 'user-123',
  state: ArticleState.ARTICLE_STATE_PUBLISHED,
  columnId: 'column-1',
  seriesId: '',
  tagIds: ['react', 'typescript'],
  topicId: 'topic-1',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  publishedAt: new Date('2024-01-15'),
};

export const mockArticles: Article[] = [
  mockArticle,
  {
    ...mockArticle,
    id: 'article-456',
    title: 'Another Article',
    state: ArticleState.ARTICLE_STATE_DRAFT,
  },
  {
    ...mockArticle,
    id: 'article-789',
    title: 'Third Article',
    state: ArticleState.ARTICLE_STATE_ARCHIVED,
  },
];

export const createMockArticle = (overrides: Partial<Article> = {}): Article => ({
  ...mockArticle,
  ...overrides,
});
