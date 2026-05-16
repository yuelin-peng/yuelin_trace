import { useState, useCallback, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/ui/SkipLink';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { MotionWrapper } from '@/components/motion/MotionWrapper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SearchBar } from '../components/search/SearchBar';
import { articleService } from '../services/article-service';
import { Article } from '../generated/com/yuelin/article/v1/article';

interface ArticleWithExcerpt extends Article {
  excerpt?: string;
}

export default function HomePage() {
  const [articles, setArticles] = useState<ArticleWithExcerpt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await articleService.listArticles({ pageSize: 6 });
        setArticles(response.articles || []);
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SkipLink />
      <Navigation />
      <main id="main-content" tabIndex={-1}>

      <HeroSection className="pt-16" />

      <MotionWrapper className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Search Articles</h2>
            <p className="mt-2 text-gray-600">Find the content you're looking for</p>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </MotionWrapper>

      <FeatureGrid />

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionWrapper>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Latest Articles</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the latest insights and tutorials from our community.
              </p>
            </div>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <MotionWrapper key={article.id} delay={index * 0.1}>
                  <Card isInteractive className="h-full">
                    <article>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.content?.substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}
                        </span>
                        <Button variant="ghost" size="sm">
                          Read More
                        </Button>
                      </div>
                    </article>
                  </Card>
                </MotionWrapper>
              ))}
            </div>
          )}
        </div>
      </section>

      <MotionWrapper className="py-20 bg-gradient-to-r from-[#0284c7] to-[#0369a1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and content creators who trust Yuelin for their knowledge sharing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/write">
              <Button size="lg" className="bg-white text-[#0284c7] hover:bg-gray-100">
                Start Writing
              </Button>
            </a>
            <a href="/about">
              <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </MotionWrapper>

      </main>
      <Footer />
    </div>
  );
}