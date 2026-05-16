import { useState, useEffect } from 'react';
import { ContentPage } from '@/components/layout/ContentPage';
import { Heading, Text } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { MotionWrapper } from '@/components/motion/MotionWrapper';
import { Button } from '@/components/ui/Button';
import { topicService, Topic } from '../services/topic-service';

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await topicService.listTopics({ pageSize: 20 });
        setTopics(response.topics || []);
      } catch (error) {
        console.error('Failed to load topics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopics();
  }, []);

  return (
    <ContentPage>
      <MotionWrapper>
        <header className="mb-12 text-center">
          <Heading level={1}>Topics</Heading>
          <Text className="text-lg mt-4">
            Browse articles by topic
          </Text>
        </header>
      </MotionWrapper>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : topics.length === 0 ? (
        <MotionWrapper>
          <Card className="text-center py-16">
            <Heading level={3} className="mb-4">No Topics Yet</Heading>
            <Text>Topics will appear here once they are created.</Text>
          </Card>
        </MotionWrapper>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic, index) => (
            <MotionWrapper key={topic.id} delay={index * 0.1}>
              <a href={`/articles?topic=${topic.slug}`} className="block">
                <Card isInteractive className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <Heading level={3} className="mb-0">
                      {topic.name}
                    </Heading>
                  </div>
                  <Button variant="ghost" size="sm">
                    Browse Articles →
                  </Button>
                </Card>
              </a>
            </MotionWrapper>
          ))}
        </div>
      )}
    </ContentPage>
  );
}