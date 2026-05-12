export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER_ROLE_UNSPECIFIED = 0,
  USER_ROLE_ADMIN = 1,
  USER_ROLE_AUTHOR = 2,
  USER_ROLE_READER = 3,
  USER_ROLE_GUEST = 4,
}

export interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  state: ArticleState;
  columnId?: string;
  seriesId?: string;
  topicId?: string;
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export enum ArticleState {
  ARTICLE_STATE_UNSPECIFIED = 0,
  ARTICLE_STATE_DRAFT = 1,
  ARTICLE_STATE_PUBLISHED = 2,
  ARTICLE_STATE_ARCHIVED = 3,
}

export interface Comment {
  id: string;
  articleId: string;
  authorId: string;
  parentId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Revision {
  id: string;
  articleId: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface SearchResultItem {
  article: Article;
  relevanceScore: number;
  highlightedSnippet: string;
}

export interface PageRequest {
  pageSize: number;
  pageToken: string;
}

export interface PageResponse {
  nextPageToken: string;
  hasMore: boolean;
  totalCount: number;
}