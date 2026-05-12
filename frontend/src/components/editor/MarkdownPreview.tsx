import React, { useMemo } from 'react';
import clsx from 'clsx';
import { renderMarkdown } from '@/lib/markdown-config';
import { CodeBlock } from './CodeBlock';
import { PlantUMLRenderer } from './PlantUMLRenderer';

export interface MarkdownPreviewProps {
  content: string;
  className?: string;
  onImageClick?: (src: string) => void;
  onLinkClick?: (href: string) => void;
}

export function MarkdownPreview({
  content,
  className,
  onImageClick,
  onLinkClick,
}: MarkdownPreviewProps) {
  const renderedContent = useMemo(() => {
    return renderMarkdown(content);
  }, [content]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    if (target.tagName === 'A' && onLinkClick) {
      e.preventDefault();
      const href = (target as HTMLAnchorElement).href;
      onLinkClick(href);
    }
    
    if (target.tagName === 'IMG' && onImageClick) {
      const src = (target as HTMLImageElement).src;
      onImageClick(src);
    }
  };

  return (
    <div
      className={clsx(
        'prose prose-slate max-w-none',
        'prose-headings:font-semibold prose-headings:text-gray-900',
        'prose-p:text-gray-700 prose-p:leading-relaxed',
        'prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline',
        'prose-img:rounded-lg prose-img:shadow-md',
        'prose-code:text-primary-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-gray-900 prose-pre:text-gray-100',
        'prose-li:marker:text-gray-500',
        'prose-hr:border-gray-300',
        'prose-blockquote:border-l-primary-500 prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r',
        className
      )}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
}

export default MarkdownPreview;