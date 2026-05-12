import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'text',
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const lines = code.split('\n');

  const languageLabels: Record<string, string> = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    tsx: 'TypeScript React',
    jsx: 'JavaScript React',
    py: 'Python',
    python: 'Python',
    go: 'Go',
    golang: 'Go',
    rust: 'Rust',
    java: 'Java',
    kotlin: 'Kotlin',
    swift: 'Swift',
    css: 'CSS',
    html: 'HTML',
    sql: 'SQL',
    bash: 'Bash',
    sh: 'Shell',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    xml: 'XML',
    md: 'Markdown',
    markdown: 'Markdown',
  };

  const displayLanguage = languageLabels[language.toLowerCase()] || language;

  return (
    <div className={clsx('code-block rounded-lg overflow-hidden bg-gray-900', className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-300 text-sm">
        <span className="font-medium">{displayLanguage}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          aria-label="Copy code"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm text-gray-100 leading-relaxed">
          <code className={`language-${language}`}>
            {showLineNumbers && (
              <span className="inline-block w-8 pr-4 text-right text-gray-500 select-none">
                {lines.map((_, i) => (
                  <span key={i} className="block">
                    {i + 1}
                  </span>
                ))}
              </span>
            )}
            <span>{code}</span>
          </code>
        </pre>
      </div>
    </div>
  );
}

export default CodeBlock;