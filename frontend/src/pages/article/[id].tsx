'use client';

import { useState, useEffect, use } from 'react';
import { articleService } from '../../services/article-service';
import { commentService, CommentWithReplies } from '../../services/comment-service';
import { Article } from '../../generated/com/yuelin/article/v1/article';
import { renderMarkdown } from '../../lib/markdown-config';
import { CommentList } from '../../components/comment/CommentList';
import { CommentForm } from '../../components/comment/CommentForm';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

const MOCK_ARTICLE: Article = {
  id: 'mock-1',
  title: 'Sample Article Title',
  content: `# Welcome to this Article

This is a sample article with some **markdown** content.

## Features

- List item 1
- List item 2
- List item 3

### Code Example

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`

> This is a blockquote

Enjoy reading!`,
  authorId: 'author-1',
  state: 2,
  columnId: '',
  seriesId: '',
  tagIds: ['react', 'typescript'],
  topicId: '',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  publishedAt: new Date('2024-01-15'),
};

const MOCK_COMMENTS: CommentWithReplies[] = [
  {
    id: 'c1',
    articleId: 'mock-1',
    authorId: 'User1',
    parentId: '',
    content: 'Great article! Very helpful.',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    replies: [],
    depth: 0,
  },
  {
    id: 'c2',
    articleId: 'mock-1',
    authorId: 'User2',
    parentId: '',
    content: 'Thanks for sharing this!',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    replies: [],
    depth: 0,
  },
];

export default function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = use(params);
  const [article, setArticle] = useState<Article>(MOCK_ARTICLE);
  const [comments, setComments] = useState<CommentWithReplies[]>(MOCK_COMMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const result = await articleService.getArticle(resolvedParams.id);
        if (result) {
          setArticle(result);
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [resolvedParams.id]);

  useEffect(() => {
    const fetchComments = async () => {
      setIsCommentLoading(true);
      try {
        const result = await commentService.listComments(resolvedParams.id);
        if (result.comments.length > 0) {
          const tree = commentService.buildCommentTree(result.comments, 5);
          setComments(tree);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setIsCommentLoading(false);
      }
    };
    fetchComments();
  }, [resolvedParams.id]);

  const handleCreateComment = async (content: string) => {
    try {
      const newComment = await commentService.createComment(resolvedParams.id, content);
      setComments((prev) => [
        ...prev,
        { ...newComment, replies: [], depth: 0 },
      ]);
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    try {
      const newComment = await commentService.createComment(resolvedParams.id, content, parentId);
      setComments((prev) => {
        const addReply = (comments: CommentWithReplies[]): CommentWithReplies[] => {
          return comments.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...c.replies, { ...newComment, replies: [], depth: c.depth + 1 }],
              };
            }
            return { ...c, replies: addReply(c.replies) };
          });
        };
        return addReply(prev);
      });
    } catch (error) {
      console.error('Failed to reply:', error);
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    try {
      await commentService.updateComment(commentId, content);
      setComments((prev) => {
        const updateComment = (comments: CommentWithReplies[]): CommentWithReplies[] => {
          return comments.map((c) => {
            if (c.id === commentId) {
              return { ...c, content };
            }
            return { ...c, replies: updateComment(c.replies) };
          });
        };
        return updateComment(prev);
      });
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => {
        const removeComment = (comments: CommentWithReplies[]): CommentWithReplies[] => {
          return comments
            .filter((c) => c.id !== commentId)
            .map((c) => ({ ...c, replies: removeComment(c.replies) }));
        };
        return removeComment(prev);
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </a>
          <span className="text-sm text-gray-500">
            {article.authorId || 'Anonymous'}
          </span>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title || 'Untitled'}</h1>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span>By {article.authorId || 'Anonymous'}</span>
            <span>·</span>
            <time dateTime={article.publishedAt?.toISOString()}>
              {formatDate(article.publishedAt || article.createdAt)}
            </time>
          </div>
          {article.tagIds?.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              {article.tagIds.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose prose-lg prose-slate max-w-none bg-white rounded-xl shadow-sm border border-gray-200 p-8"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content || '') }}
        />
      </article>

      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        <div className="mb-8">
          <CommentForm onSubmit={handleCreateComment} />
        </div>

        <CommentList
          comments={comments}
          onReply={handleReply}
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
          isLoading={isCommentLoading}
        />
      </section>
    </main>
  );
}