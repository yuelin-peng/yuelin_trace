import React from 'react';
import { ContentPage } from '@/components/layout/ContentPage';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { MotionWrapper } from '@/components/motion/MotionWrapper';

export default function NotFoundPage() {
  return (
    <ContentPage showReadingProgress={false} maxWidth="narrow">
      <MotionWrapper className="text-center py-20">
        <div className="mb-8">
          <span className="text-9xl font-bold text-gray-200">404</span>
        </div>
        <Heading level={1} className="mb-4">
          Page Not Found
        </Heading>
        <Text className="mb-8 text-lg">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </Text>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/">
            <Button size="lg">Go Home</Button>
          </a>
          <a href="/articles">
            <Button variant="secondary" size="lg">Browse Articles</Button>
          </a>
        </div>
      </MotionWrapper>
    </ContentPage>
  );
}