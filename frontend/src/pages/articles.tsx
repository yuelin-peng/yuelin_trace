import { useState, useEffect } from 'react';
import { ContentPage } from '@/components/layout/ContentPage';
import { Heading, Text } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { MotionWrapper } from '@/components/motion/MotionWrapper';
import { Button } from '@/components/ui/Button';
import { articleService, Article } from '../services/article-service';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await articleService.listArticles({ pageSize: 20 });
        setArticles(response.articles || []);
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <ContentPage>
      <MotionWrapper>
        <header className="mb-12 text-center">
          <Heading level={1}>Articles</Heading>
          <Text className="text-lg mt-4">
            Explore our collection of articles on various topics
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
      ) : articles.length === 0 ? (
        <MotionWrapper>
          <Card className="text-center py-16">
            <Heading level={3} className="mb-4">No Articles Yet</Heading>
            <Text className="mb-6">
              Be the first to write an article!
            </Text>
            <a href="/write">
              <Button>Write an Article</Button>
            </a>
          </Card>
        </MotionWrapper>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <MotionWrapper key={article.id} delay={index * 0.1}>
              <a href={`/article/${article.id}`} className="block">
                <Card isInteractive className="h-full">
                  <Heading level={3} className="mb-2">
                    {article.title || 'Untitled'}
                  </Heading>
                  <Text className="line-clamp-3">
                    {article.content?.substring(0, 150)}...
                  </Text>
                  <div className="mt-4 text-sm text-gray-500">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}
                  </div>
                </Card>
              </a>
            </MotionWrapper>
          ))}
        </div>
      )}
    </ContentPage>
  );
}