'use client';

import { ContentPage } from '@/components/layout/ContentPage';
import { Heading, Text } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { MotionWrapper } from '@/components/motion/MotionWrapper';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <ContentPage>
      <MotionWrapper>
        <header className="mb-12 text-center">
          <Heading level={1}>About Yuelin</Heading>
          <Text className="text-lg mt-4 max-w-2xl mx-auto">
            A modern platform for sharing knowledge, connecting with experts, and building your digital presence.
          </Text>
        </header>
      </MotionWrapper>

      <div className="space-y-12">
        <MotionWrapper>
          <Card>
            <Heading level={2} className="mb-4">Our Mission</Heading>
            <Text className="text-lg">
              We believe in the power of shared knowledge. Our platform is designed to make it easy for developers, 
              designers, and creators to share their expertise with the world. Whether you're writing tutorials, 
              sharing insights, or documenting your journey, Yuelin provides the tools you need to reach your audience.
            </Text>
          </Card>
        </MotionWrapper>

        <MotionWrapper>
          <Card>
            <Heading level={2} className="mb-4">Features</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Heading level={4} className="mb-2">📝 Rich Content Editor</Heading>
                <Text>Write with Markdown support, code highlighting, and media embedding.</Text>
              </div>
              <div>
                <Heading level={4} className="mb-2">🏷️ Topic Organization</Heading>
                <Text>Organize content with topics and tags for easy discovery.</Text>
              </div>
              <div>
                <Heading level={4} className="mb-2">💬 Comments & Discussions</Heading>
                <Text>Engage with readers through threaded comments and replies.</Text>
              </div>
              <div>
                <Heading level={4} className="mb-2">📱 Responsive Design</Heading>
                <Text>Your content looks great on any device, from mobile to desktop.</Text>
              </div>
            </div>
          </Card>
        </MotionWrapper>

        <MotionWrapper>
          <Card className="text-center">
            <Heading level={2} className="mb-4">Ready to Start?</Heading>
            <Text className="mb-6">
              Join our community of writers and readers today.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/articles">
                <Button size="lg">Browse Articles</Button>
              </a>
              <a href="/write">
                <Button variant="secondary" size="lg">Start Writing</Button>
              </a>
            </div>
          </Card>
        </MotionWrapper>
      </div>
    </ContentPage>
  );
}