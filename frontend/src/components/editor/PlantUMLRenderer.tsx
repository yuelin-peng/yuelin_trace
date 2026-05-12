import React, { useState, useCallback } from 'react';
import clsx from 'clsx';

export interface PlantUMLRendererProps {
  code: string;
  className?: string;
  serverUrl?: string;
}

const DEFAULT_PLANTUML_SERVER = 'https://www.plantuml.com/plantuml';

export function PlantUMLRenderer({
  code,
  className,
  serverUrl = DEFAULT_PLANTUML_SERVER,
}: PlantUMLRendererProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const encodedCode = React.useMemo(() => {
    const encoded = encodeURIComponent(code)
      .replace(/!/g, '%21')
      .replace(/"/g, '%22')
      .replace(/#/g, '%23')
      .replace(/%/g, '%25')
      .replace(/&/g, '%26')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/\+/g, '%2B')
      .replace(/,/g, '%2C')
      .replace(/\//g, '%2F')
      .replace(/:/g, '%3A')
      .replace(/;/g, '%3B')
      .replace(/=/g, '%3D')
      .replace(/\?/g, '%3F')
      .replace(/@/g, '%40')
      .replace(/\[/g, '%5B')
      .replace(/]/g, '%5D')
      .replace(/\{/g, '%7B')
      .replace(/\}/g, '%7D')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E')
      .replace(/\|/g, '%7C')
      .replace(/\\/g, '%5C')
      .replace(/\^/g, '%5E')
      .replace(/`/g, '%60')
      .replace(/~/g, '%7E');
    return encoded;
  }, [code]);

  const imageUrl = `${serverUrl}/svg/${encodedCode}`;
  const pngUrl = `${serverUrl}/png/${encodedCode}`;

  const handleError = useCallback(() => {
    setStatus('error');
    setError('Failed to render PlantUML diagram');
  }, []);

  const handleLoad = useCallback(() => {
    setStatus('success');
  }, []);

  return (
    <div className={clsx('plantuml-renderer', className)}>
      <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
        {status === 'loading' && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            <span className="ml-3 text-gray-500">Loading diagram...</span>
          </div>
        )}
        
        {status === 'error' ? (
          <div className="p-4 text-center">
            <div className="text-red-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <p className="text-gray-500 text-sm mt-2">Check PlantUML syntax</p>
          </div>
        ) : (
          <div className="relative">
            <object
              data={imageUrl}
              type="image/svg+xml"
              className="w-full"
              onError={handleError}
              onLoad={handleLoad}
              aria-label="PlantUML diagram"
            >
              <img
                src={pngUrl}
                alt="PlantUML diagram"
                className="w-full"
                onError={handleError}
              />
            </object>
          </div>
        )}
        
        <div className="absolute bottom-2 right-2">
          <a
            href={pngUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600"
            title="Open in new tab"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export function parsePlantUMLBlocks(content: string): { type: 'text' | 'plantuml'; content: string }[] {
  const parts: { type: 'text' | 'plantuml'; content: string }[] = [];
  const regex = /```plantuml\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index),
      });
    }
    parts.push({
      type: 'plantuml',
      content: match[1].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex),
    });
  }

  return parts;
}

export default PlantUMLRenderer;