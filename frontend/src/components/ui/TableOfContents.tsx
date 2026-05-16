import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface TableOfContentsProps {
  className?: string;
  contentSelector?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  className,
  contentSelector = 'article',
}) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const content = document.querySelector(contentSelector);
    if (!content) return;

    const headingElements = content.querySelectorAll('h2, h3, h4');
    const items: TOCItem[] = Array.from(headingElements).map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) heading.id = id;
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      };
    });

    setHeadings(items);
  }, [contentSelector]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav
      className={cn(
        'bg-gray-50 rounded-lg p-4 sticky top-24',
        className
      )}
      aria-label="Table of contents"
    >
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
        Contents
      </h2>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              'text-sm transition-colors',
              heading.level === 2 ? 'ml-0' : 'ml-4',
              activeId === heading.id
                ? 'text-[#0284c7] font-medium'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className="block py-1"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;