'use client';

import { useState, useCallback, useEffect } from 'react';
import { SearchBar } from '../components/search/SearchBar';
import { SearchResults } from '../components/search/SearchResults';
import { TagFilter } from '../components/article/TagFilter';
import { articleService } from '../services/article-service';
import { Article } from '../generated/com/yuelin/article/v1/article';

interface ArticleWithExcerpt extends Article {
  excerpt?: string;
}

const MOCK_TAGS = [
  { id: 'react', name: 'React', count: 12 },
  { id: 'typescript', name: 'TypeScript', count: 8 },
  { id: 'nextjs', name: 'Next.js', count: 5 },
  { id: 'nodejs', name: 'Node.js', count: 6 },
  { id: 'graphql', name: 'GraphQL', count: 4 },
];

const MOCK_ARTICLES: ArticleWithExcerpt[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    content: 'Learn the basics of React and build your first application. React is a JavaScript library for building user interfaces...',
    authorId: 'user-1',
    state: 2,
    columnId: '',
    seriesId: '',
    tagIds: ['react', 'javascript'],
    topicId: '',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    publishedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    content: 'Explore advanced TypeScript patterns for better code quality. We will cover generics, conditional types, and more...',
    authorId: 'user-2',
    state: 2,
    columnId: '',
    seriesId: '',
    tagIds: ['typescript', 'programming'],
    topicId: '',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    publishedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Building Scalable APIs',
    content: 'Best practices for designing and building scalable REST APIs. Learn about authentication, rate limiting, and caching...',
    authorId: 'user-3',
    state: 2,
    columnId: '',
    seriesId: '',
    tagIds: ['api', 'backend'],
    topicId: '',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    publishedAt: new Date('2024-01-05'),
  },
];

export default function HomePage() {
  const [articles, setArticles] = useState<ArticleWithExcerpt[]>(MOCK_ARTICLES);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const result = await articleService.listArticles({
          pageSize: 20,
          pageToken: '',
          state: 2,
          tagIds: selectedTags,
          sortBy: 'created_at',
          sortOrder: 'desc',
        });
        if (result.articles.length > 0) {
          setArticles(
            result.articles.map((a) => ({
              ...a,
              excerpt: a.content?.substring(0, 100) + '...',
            }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      }
    };
    fetchArticles();
  }, [selectedTags]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setArticles(MOCK_ARTICLES);
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setArticles(
      MOCK_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.content.toLowerCase().includes(query.toLowerCase())
      ).map((a) => ({
        ...a,
        excerpt: a.content.substring(0, 100) + '...',
      }))
    );
    setIsLoading(false);
  }, []);

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Article Blog</h1>
          <nav className="flex items-center gap-4">
            <a
              href="/write"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Write Article
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
          />
          {searchQuery && (
            <SearchResults
              results={articles.map((a) => ({
                article: a,
                relevanceScore: 1,
                highlightedSnippet: `<mark>${a.title}</mark>`,
              }))}
              isLoading={isLoading}
            />
          )}
        </div>

        <div className="mb-6">
          <TagFilter
            tags={MOCK_TAGS}
            selectedTags={selectedTags}
            onChange={setSelectedTags}
          />
        </div>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Articles</h2>
          {articles.length === 0 && !isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <p>No articles found</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {article.tagIds?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      <a
                        href={`/article/${article.id}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {article.title || 'Untitled'}
                      </a>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {article.excerpt || article.content?.substring(0, 100) + '...'}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.authorId || 'Anonymous'}</span>
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}