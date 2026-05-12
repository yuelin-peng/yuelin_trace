import { grpcClient } from './grpc-client';
import {
  Article,
  CreateArticleRequest,
  CreateArticleResponse,
  GetArticleRequest,
  GetArticleResponse,
  UpdateArticleRequest,
  UpdateArticleResponse,
  DeleteArticleRequest,
  ListArticlesRequest,
  ListArticlesResponse,
} from '../generated/com/yuelin/article/v1/article';
import { PageResponse } from '../generated/com/yuelin/common/v1/page';

export interface CreateArticleResponseDTO {
  article?: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    state: number;
    columnId: string;
    seriesId: string;
    tagIds: string[];
    topicId: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };
}

class ArticleService {
  async createArticle(request: CreateArticleRequest): Promise<CreateArticleResponseDTO> {
    try {
      const response = await grpcClient.call<CreateArticleResponse>(
        'com.yuelin.article.v1.ArticleService',
        'CreateArticle',
        CreateArticleRequest.toJSON(request)
      );
      return response as CreateArticleResponseDTO;
    } catch (error) {
      console.error('CreateArticle failed:', error);
      throw error;
    }
  }

  async getArticle(id: string, fields?: string[]): Promise<Article | undefined> {
    try {
      const request: GetArticleRequest = {
        id,
        fields: fields || undefined,
      };
      const response = await grpcClient.call<GetArticleResponse>(
        'com.yuelin.article.v1.ArticleService',
        'GetArticle',
        GetArticleRequest.toJSON(request)
      );
      return response?.article ? Article.fromJSON(response.article) : undefined;
    } catch (error) {
      console.error('GetArticle failed:', error);
      throw error;
    }
  }

  async updateArticle(request: UpdateArticleRequest): Promise<Article | undefined> {
    try {
      const response = await grpcClient.call<UpdateArticleResponse>(
        'com.yuelin.article.v1.ArticleService',
        'UpdateArticle',
        UpdateArticleRequest.toJSON(request)
      );
      return response?.article ? Article.fromJSON(response.article) : undefined;
    } catch (error) {
      console.error('UpdateArticle failed:', error);
      throw error;
    }
  }

  async deleteArticle(id: string): Promise<void> {
    try {
      const request: DeleteArticleRequest = { id };
      await grpcClient.call(
        'com.yuelin.article.v1.ArticleService',
        'DeleteArticle',
        DeleteArticleRequest.toJSON(request)
      );
    } catch (error) {
      console.error('DeleteArticle failed:', error);
      throw error;
    }
  }

  async listArticles(options?: {
    pageSize?: number;
    pageToken?: string;
    authorId?: string;
    state?: number;
    columnId?: string;
    seriesId?: string;
    topicId?: string;
    tagIds?: string[];
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    articles: Article[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  }> {
    try {
      const request: ListArticlesRequest = {
        pageRequest: {
          pageSize: options?.pageSize || 20,
          pageToken: options?.pageToken || '',
        },
        authorId: options?.authorId || '',
        state: options?.state as any || 0,
        columnId: options?.columnId || '',
        seriesId: options?.seriesId || '',
        topicId: options?.topicId || '',
        tagIds: options?.tagIds || [],
        sortBy: options?.sortBy || '',
        sortOrder: options?.sortOrder || '',
      };
      
      const response = await grpcClient.call<ListArticlesResponse>(
        'com.yuelin.article.v1.ArticleService',
        'ListArticles',
        ListArticlesRequest.toJSON(request)
      );
      
      const articles = (response?.articles || []).map(a => Article.fromJSON(a));
      const pageResponse = response?.pageResponse;
      
      return {
        articles,
        total: pageResponse?.totalCount || 0,
        page: 1,
        pageSize: request.pageRequest?.pageSize || 20,
        hasMore: pageResponse?.hasMore || false,
      };
    } catch (error) {
      console.error('ListArticles failed:', error);
      throw error;
    }
  }
}

export const articleService = new ArticleService();