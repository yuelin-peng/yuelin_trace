import { grpcClient } from './grpc-client';
import {
  Topic,
  CreateTopicRequest,
  CreateTopicResponse,
  GetTopicRequest,
  GetTopicResponse,
  UpdateTopicRequest,
  UpdateTopicResponse,
  DeleteTopicRequest,
  ListTopicsRequest,
  ListTopicsResponse,
} from '../generated/com/yuelin/topic/v1/topic';

class TopicService {
  async createTopic(name: string): Promise<Topic> {
    try {
      const request: CreateTopicRequest = { name };

      const response = await grpcClient.call<CreateTopicResponse>(
        'com.yuelin.topic.v1.TopicService',
        'CreateTopic',
        CreateTopicRequest.toJSON(request)
      );

      if (!response?.topic) {
        throw new Error('Failed to create topic');
      }

      return Topic.fromJSON(response.topic);
    } catch (error) {
      console.error('CreateTopic failed:', error);
      throw error;
    }
  }

  async getTopic(id: string): Promise<Topic | undefined> {
    try {
      const request: GetTopicRequest = { id };
      const response = await grpcClient.call<GetTopicResponse>(
        'com.yuelin.topic.v1.TopicService',
        'GetTopic',
        GetTopicRequest.toJSON(request)
      );
      return response?.topic ? Topic.fromJSON(response.topic) : undefined;
    } catch (error) {
      console.error('GetTopic failed:', error);
      throw error;
    }
  }

  async updateTopic(id: string, name: string, updateMask?: string[]): Promise<Topic | undefined> {
    try {
      const request: UpdateTopicRequest = {
        id,
        name,
        updateMask: updateMask || ['name'],
      };
      const response = await grpcClient.call<UpdateTopicResponse>(
        'com.yuelin.topic.v1.TopicService',
        'UpdateTopic',
        UpdateTopicRequest.toJSON(request)
      );
      return response?.topic ? Topic.fromJSON(response.topic) : undefined;
    } catch (error) {
      console.error('UpdateTopic failed:', error);
      throw error;
    }
  }

  async deleteTopic(id: string): Promise<void> {
    try {
      const request: DeleteTopicRequest = { id };
      await grpcClient.call(
        'com.yuelin.topic.v1.TopicService',
        'DeleteTopic',
        DeleteTopicRequest.toJSON(request)
      );
    } catch (error) {
      console.error('DeleteTopic failed:', error);
      throw error;
    }
  }

  async listTopics(options?: {
    pageSize?: number;
    pageToken?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    topics: Topic[];
    hasMore: boolean;
    nextPageToken?: string;
  }> {
    try {
      const request: ListTopicsRequest = {
        pageRequest: {
          pageSize: options?.pageSize || 50,
          pageToken: options?.pageToken || '',
        },
        search: options?.search || '',
        sortBy: options?.sortBy || 'created_at',
        sortOrder: options?.sortOrder || 'desc',
      };

      const response = await grpcClient.call<ListTopicsResponse>(
        'com.yuelin.topic.v1.TopicService',
        'ListTopics',
        ListTopicsRequest.toJSON(request)
      );

      const topics = (response?.topics || []).map((t) => Topic.fromJSON(t));
      return {
        topics,
        hasMore: response?.pageResponse?.hasMore || false,
        nextPageToken: response?.pageResponse?.nextPageToken || undefined,
      };
    } catch (error) {
      console.error('ListTopics failed:', error);
      throw error;
    }
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export const topicService = new TopicService();