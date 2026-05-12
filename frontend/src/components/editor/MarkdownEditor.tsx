import React, { useState, useCallback, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useEditorShortcuts } from '../../hooks/useKeyboardShortcuts';

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  minHeight?: string;
  isDisabled?: boolean;
  className?: string;
  onSave?: () => void;
  onPublish?: () => void;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your markdown here...',
  debounceMs = 150,
  minHeight = '400px',
  isDisabled = false,
  className,
  onSave,
  onPublish,
}: MarkdownEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEditorShortcuts(!isDisabled);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        const newValue = localValue.substring(0, start) + '  ' + localValue.substring(end);
        setLocalValue(newValue);
        onChange(newValue);
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
          }
        }, 0);
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            if (debounceRef.current) {
              clearTimeout(debounceRef.current);
            }
            onChange(localValue);
            onSave?.();
            break;
          case 'b':
            e.preventDefault();
            wrapSelection('**', '**');
            break;
          case 'i':
            e.preventDefault();
            wrapSelection('*', '*');
            break;
          case 'k':
            e.preventDefault();
            wrapSelection('[', '](url)');
            break;
        }
      }

      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        onPublish?.();
      }
    },
    [localValue, onChange, onSave, onPublish]
  );

  const wrapSelection = useCallback(
    (before: string, after: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = localValue.substring(start, end);
      const newText = localValue.substring(0, start) + before + selectedText + after + localValue.substring(end);
      
      setLocalValue(newText);
      onChange(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + before.length;
        textarea.selectionEnd = end + before.length;
      }, 0);
    },
    [localValue, onChange]
  );

  return (
    <div className={clsx('flex flex-col', className)} role="region" aria-label="Markdown editor">
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500" role="toolbar" aria-label="Formatting options">
        <span className="font-medium sr-only">Markdown Editor Toolbar</span>
        <button
          type="button"
          onClick={() => wrapSelection('**', '**')}
          className="px-2 py-1 hover:bg-gray-100 rounded font-bold"
          disabled={isDisabled}
          title="Bold (Ctrl+B)"
          aria-label="Bold"
          aria-keyshortcuts="Control+B"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => wrapSelection('*', '*')}
          className="px-2 py-1 hover:bg-gray-100 rounded italic"
          disabled={isDisabled}
          title="Italic (Ctrl+I)"
          aria-label="Italic"
          aria-keyshortcuts="Control+I"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => wrapSelection('[', '](url)')}
          className="px-2 py-1 hover:bg-gray-100 rounded"
          disabled={isDisabled}
          title="Link (Ctrl+K)"
          aria-label="Insert link"
          aria-keyshortcuts="Control+K"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => wrapSelection('`', '`')}
          className="px-2 py-1 hover:bg-gray-100 rounded font-mono text-sm"
          disabled={isDisabled}
          title="Inline code"
          aria-label="Inline code"
        >
          Code
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
        className={clsx(
          'flex-1 w-full p-4 rounded-lg border border-gray-300',
          'font-mono text-sm leading-relaxed resize-none',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          'placeholder:text-gray-400'
        )}
        style={{ minHeight }}
        aria-label="Article content in Markdown format"
        aria-describedby="markdown-help"
        aria-required="true"
      />
      <p id="markdown-help" className="mt-2 text-xs text-gray-400">
        Supports Markdown, images, videos, code blocks, and PlantUML diagrams.
        Keyboard: Ctrl+S save, Ctrl+B bold, Ctrl+I italic, Ctrl+K link.
      </p>
    </div>
  );
}

export default MarkdownEditor;