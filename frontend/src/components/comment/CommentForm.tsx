import React, { useState, useRef, useCallback } from 'react';
import clsx from 'clsx';

interface EmojiCategory {
  name: string;
  emojis: string[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: 'Smileys',
    emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '🤔', '🤨', '😐'],
  },
  {
    name: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  },
  {
    name: 'Reactions',
    emojis: ['👍', '👎', '👏', '🙌', '🤝', '🙏', '💪', '🤙', '✌️', '🤞', '👋', '🤟', '🤘', '👌', '✋', '🖐️'],
  },
];

export interface CommentFormProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export function CommentForm({
  onSubmit,
  placeholder = 'Write a comment...',
  isLoading = false,
  className,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (content.trim() && !isLoading) {
      onSubmit(content);
      setContent('');
    }
  }, [content, onSubmit, isLoading]);

  const insertEmoji = useCallback((emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + emoji + content.substring(end);
      setContent(newContent);
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    } else {
      setContent((prev) => prev + emoji);
    }
    setShowEmojiPicker(false);
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={clsx('relative', className)}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={clsx(
            'w-full p-3 border border-gray-300 rounded-lg resize-none',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'placeholder:text-gray-400 transition-colors',
            isLoading && 'opacity-70'
          )}
          rows={3}
          disabled={isLoading}
          aria-label="Comment content"
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1.5 text-gray-400 hover:text-primary-600 rounded transition-colors"
            aria-label="Add emoji"
            aria-expanded={showEmojiPicker}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!content.trim() || isLoading}
            className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded transition-colors',
              content.trim() && !isLoading
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {showEmojiPicker && (
        <div
          className="absolute bottom-14 right-0 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-3"
          role="dialog"
          aria-label="Emoji picker"
        >
          <div className="flex flex-wrap gap-1 max-w-[240px]">
            {EMOJI_CATEGORIES.flatMap((cat) => cat.emojis).map((emoji, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="p-1 hover:bg-gray-100 rounded text-lg"
                aria-label={`Insert ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentForm;