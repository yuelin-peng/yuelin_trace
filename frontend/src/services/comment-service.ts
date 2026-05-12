import { grpcClient } from './grpc-client';
import {
  Comment,
  CreateCommentRequest,
  CreateCommentResponse,
  GetCommentRequest,
  GetCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
  DeleteCommentRequest,
  ListCommentsRequest,
  ListCommentsResponse,
} from '../generated/com/yuelin/comment/v1/comment';
import { PageResponse } from '../generated/com/yuelin/common/v1/page';

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
  depth: number;
}

class CommentService {
  async createComment(
    articleId: string,
    content: string,
    parentId?: string
  ): Promise<Comment> {
    try {
      const request: CreateCommentRequest = {
        articleId,
        parentId: parentId || '',
        content,
      };

      const response = await grpcClient.call<CreateCommentResponse>(
        'com.yuelin.comment.v1.CommentService',
        'CreateComment',
        CreateCommentRequest.toJSON(request)
      );

      if (!response?.comment) {
        throw new Error('Failed to create comment');
      }

      return Comment.fromJSON(response.comment);
    } catch (error) {
      console.error('CreateComment failed:', error);
      throw error;
    }
  }

  async getComment(id: string): Promise<Comment | undefined> {
    try {
      const request: GetCommentRequest = { id };
      const response = await grpcClient.call<GetCommentResponse>(
        'com.yuelin.comment.v1.CommentService',
        'GetComment',
        GetCommentRequest.toJSON(request)
      );
      return response?.comment ? Comment.fromJSON(response.comment) : undefined;
    } catch (error) {
      console.error('GetComment failed:', error);
      throw error;
    }
  }

  async updateComment(id: string, content: string): Promise<Comment | undefined> {
    try {
      const request: UpdateCommentRequest = { id, content };
      const response = await grpcClient.call<UpdateCommentResponse>(
        'com.yuelin.comment.v1.CommentService',
        'UpdateComment',
        UpdateCommentRequest.toJSON(request)
      );
      return response?.comment ? Comment.fromJSON(response.comment) : undefined;
    } catch (error) {
      console.error('UpdateComment failed:', error);
      throw error;
    }
  }

  async deleteComment(id: string): Promise<void> {
    try {
      const request: DeleteCommentRequest = { id };
      await grpcClient.call(
        'com.yuelin.comment.v1.CommentService',
        'DeleteComment',
        DeleteCommentRequest.toJSON(request)
      );
    } catch (error) {
      console.error('DeleteComment failed:', error);
      throw error;
    }
  }

  async listComments(articleId: string, options?: {
    pageSize?: number;
    pageToken?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    comments: Comment[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const request: ListCommentsRequest = {
        pageRequest: {
          pageSize: options?.pageSize || 50,
          pageToken: options?.pageToken || '',
        },
        articleId,
        parentId: '',
        sortBy: options?.sortBy || 'created_at',
        sortOrder: options?.sortOrder || 'asc',
      };

      const response = await grpcClient.call<ListCommentsResponse>(
        'com.yuelin.comment.v1.CommentService',
        'ListComments',
        ListCommentsRequest.toJSON(request)
      );

      const comments = (response?.comments || []).map(c => Comment.fromJSON(c));
      return {
        comments,
        total: response?.pageResponse?.totalCount || 0,
        hasMore: response?.pageResponse?.hasMore || false,
      };
    } catch (error) {
      console.error('ListComments failed:', error);
      throw error;
    }
  }

  buildCommentTree(comments: Comment[], maxDepth: number = 5): CommentWithReplies[] {
    const commentMap = new Map<string, CommentWithReplies>();
    const rootComments: CommentWithReplies[] = [];

    comments.forEach((comment) => {
      commentMap.set(comment.id, {
        ...comment,
        replies: [],
        depth: 0,
      });
    });

    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parentId && commentMap.has(comment.parentId)) {
        const parent = commentMap.get(comment.parentId)!;
        if (parent.depth < maxDepth - 1) {
          commentWithReplies.depth = parent.depth + 1;
          parent.replies.push(commentWithReplies);
        } else {
          rootComments.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  }
}

export const commentService = new CommentService();