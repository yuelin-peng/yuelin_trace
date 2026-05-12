import { Topic } from '../../src/generated/com/yuelin/topic/v1/topic';

export const mockTopic: Topic = {
  id: 'topic-123',
  name: 'JavaScript',
  slug: 'javascript',
  createdAt: new Date('2024-01-01'),
};

export const mockTopics: Topic[] = [
  mockTopic,
  {
    id: 'topic-456',
    name: 'TypeScript',
    slug: 'typescript',
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 'topic-789',
    name: 'React',
    slug: 'react',
    createdAt: new Date('2024-01-03'),
  },
];

export const createMockTopic = (overrides: Partial<Topic> = {}): Topic => ({
  ...mockTopic,
  ...overrides,
});
