import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { articleService, Article } from '../../services/article-service';
import { commentService, CommentWithReplies } from '../../services/comment-service';
import { renderMarkdown } from '../../lib/markdown-config';
import { CommentList } from '../../components/comment/CommentList';
import { CommentForm } from '../../components/comment/CommentForm';
import { ContentPage } from '@/components/layout/ContentPage';
import { Heading } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { MotionWrapper } from '@/components/motion/MotionWrapper';
import { cn } from '@/lib/utils';

const MOCK_COMMENTS: CommentWithReplies[] = [
  {
    id: 'comment-1',
    content: 'Great article! Very helpful.',
    authorId: 'user-1',
    articleId: 'mock-1',
    parentId: '',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    replies: [],
    depth: 0,
  },
];

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<CommentWithReplies[]>(MOCK_COMMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    
    const fetchArticle = async () => {
      try {
        const result = await articleService.getArticle(id);
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
  }, [id]);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    
    const fetchComments = async () => {
      setIsCommentLoading(true);
      try {
        const result = await commentService.listComments(id);
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
  }, [id]);

  const handleCreateComment = async (content: string) => {
    if (!id || typeof id !== 'string') return;
    try {
      const newComment = await commentService.createComment(id, content);
      setComments((prev) => [
        ...prev,
        { ...newComment, replies: [], depth: 0 },
      ]);
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!id || typeof id !== 'string') return;
    try {
      const newComment = await commentService.createComment(id, content, parentId);
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

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const readingTime = article ? calculateReadingTime(article.content || '') : 0;

  if (isLoading) {
    return (
      <ContentPage showReadingProgress={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="inline-block w-10 h-10 border-4 border-[#0284c7] border-t-transparent rounded-full animate-spin" />
        </div>
      </ContentPage>
    );
  }

  return (
    <ContentPage maxWidth="narrow">
      <MotionWrapper>
        <header className="mb-8 pb-8 border-b border-gray-200">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Articles
          </a>

          <Heading level={1} className="mb-4">
            {article?.title || 'Untitled'}
          </Heading>

          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
            <span>By {article?.authorId || 'Anonymous'}</span>
            <span>·</span>
            <time dateTime={article?.publishedAt}>
              {formatDate(article?.publishedAt || article?.createdAt)}
            </time>
            <span>·</span>
            <span>{readingTime} min read</span>
          </div>

          {article?.tagIds && article.tagIds.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              {article.tagIds.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#f0f9ff] text-[#0284c7] text-sm rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
      </MotionWrapper>

      <MotionWrapper delay={0.1}>
        <Card className="mb-12">
          <div
            className={cn(
              'prose prose-lg prose-slate max-w-none',
              'prose-headings:text-gray-900 prose-headings:font-bold',
              'prose-p:text-gray-700 prose-p:leading-relaxed',
              'prose-a:text-[#0284c7] prose-a:no-underline hover:prose-a:underline',
              'prose-strong:text-gray-900',
              'prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
              'prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg',
              'prose-blockquote:border-l-4 prose-blockquote:border-[#0284c7] prose-blockquote:pl-4 prose-blockquote:italic',
              'prose-li:text-gray-700',
              'prose-img:rounded-lg prose-img:shadow-md'
            )}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(article?.content || '') }}
          />
        </Card>
      </MotionWrapper>

      <MotionWrapper delay={0.2}>
        <section className="mt-12 pt-8 border-t border-gray-200">
          <Heading level={2} className="mb-6">
            Comments ({comments.length})
          </Heading>

          <Card className="mb-8">
            <CommentForm onSubmit={handleCreateComment} />
          </Card>

          <CommentList
            comments={comments}
            onReply={handleReply}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            isLoading={isCommentLoading}
          />
        </section>
      </MotionWrapper>
    </ContentPage>
  );
}