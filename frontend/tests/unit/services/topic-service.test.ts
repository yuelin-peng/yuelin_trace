import { topicService } from '../../../src/services/topic-service';
import { grpcClient } from '../../../src/services/grpc-client';
import { createMockTopic } from '../../__mocks__/mockTopic';

jest.mock('../../../src/services/grpc-client');

describe('TopicService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTopic', () => {
    it('should create a topic', async () => {
      const mockTopic = createMockTopic();
      const mockResponse = {
        topic: {
          ...mockTopic,
          createdAt: mockTopic.createdAt?.toISOString(),
        },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await topicService.createTopic('JavaScript');

      expect(result.name).toBe('JavaScript');
      expect(result.slug).toBe('javascript');
    });
  });

  describe('getTopic', () => {
    it('should fetch a topic by id', async () => {
      const mockTopic = createMockTopic();
      const mockResponse = {
        topic: {
          ...mockTopic,
          createdAt: mockTopic.createdAt?.toISOString(),
        },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await topicService.getTopic('topic-123');

      expect(result?.name).toBe('JavaScript');
    });
  });

  describe('listTopics', () => {
    it('should list all topics', async () => {
      const mockTopics = [createMockTopic(), createMockTopic({ id: 'topic-2', name: 'TypeScript', slug: 'typescript' })];
      const mockResponse = {
        topics: mockTopics.map((t) => ({
          ...t,
          createdAt: t.createdAt?.toISOString(),
        })),
        pageResponse: { nextPageToken: '', hasMore: false, totalCount: 2 },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await topicService.listTopics();

      expect(result.topics).toHaveLength(2);
    });

    it('should filter topics by search query', async () => {
      const mockTopics = [createMockTopic({ name: 'JavaScript', slug: 'javascript' })];
      const mockResponse = {
        topics: mockTopics.map((t) => ({
          ...t,
          createdAt: t.createdAt?.toISOString(),
        })),
        pageResponse: { nextPageToken: '', hasMore: false, totalCount: 1 },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await topicService.listTopics({ search: 'java' });

      expect(result.topics).toHaveLength(1);
      expect(grpcClient.call).toHaveBeenCalledWith(
        'com.yuelin.topic.v1.TopicService',
        'ListTopics',
        expect.objectContaining({
          search: 'java',
        })
      );
    });
  });

  describe('updateTopic', () => {
    it('should update a topic name', async () => {
      const updatedTopic = createMockTopic({ name: 'Updated JavaScript' });
      const mockResponse = {
        topic: {
          ...updatedTopic,
          createdAt: updatedTopic.createdAt?.toISOString(),
        },
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await topicService.updateTopic('topic-123', 'Updated JavaScript');

      expect(result?.name).toBe('Updated JavaScript');
    });
  });

  describe('deleteTopic', () => {
    it('should delete a topic', async () => {
      (grpcClient.call as jest.Mock).mockResolvedValueOnce({});

      await expect(topicService.deleteTopic('topic-123')).resolves.not.toThrow();
    });
  });

  describe('generateSlug', () => {
    it('should generate URL-friendly slug', () => {
      expect(topicService.generateSlug('JavaScript')).toBe('javascript');
      expect(topicService.generateSlug('Type Script')).toBe('type-script');
      expect(topicService.generateSlug('  Spaces  ')).toBe('spaces');
      expect(topicService.generateSlug('Special!@#Characters')).toBe('specialcharacters');
      expect(topicService.generateSlug('UPPER CASE')).toBe('upper-case');
    });
  });
});
