import React from 'react';
import { ContentPage } from '@/components/layout/ContentPage';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { MotionWrapper } from '@/components/motion/MotionWrapper';

export default function ErrorPage() {
  return (
    <ContentPage showReadingProgress={false} maxWidth="narrow">
      <MotionWrapper className="text-center py-20">
        <div className="mb-8">
          <span className="text-9xl font-bold text-gray-200">500</span>
        </div>
        <Heading level={1} className="mb-4">
          Something Went Wrong
        </Heading>
        <Text className="mb-8 text-lg">
          We apologize for the inconvenience. Our team has been notified and we're working to fix the issue.
        </Text>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/">
            <Button size="lg">Go Home</Button>
          </a>
          <button onClick={() => window.location.reload()}>
            <Button variant="secondary" size="lg">Try Again</Button>
          </button>
        </div>
      </MotionWrapper>
    </ContentPage>
  );
}