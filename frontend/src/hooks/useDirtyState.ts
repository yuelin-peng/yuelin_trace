import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseDirtyStateOptions {
  initialDirty?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

export interface UseDirtyStateReturn {
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
  hasUnsavedChanges: () => boolean;
}

export function useDirtyState(options: UseDirtyStateOptions = {}): UseDirtyStateReturn {
  const { initialDirty = false, onDirtyChange } = options;
  const [isDirty, setIsDirty] = useState(initialDirty);
  const previousContentRef = useRef<string>('');
  const currentContentRef = useRef<string>('');

  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty);
    }
  }, [isDirty, onDirtyChange]);

  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const markClean = useCallback(() => {
    setIsDirty(false);
    previousContentRef.current = currentContentRef.current;
  }, []);

  const hasUnsavedChanges = useCallback(() => {
    return previousContentRef.current !== currentContentRef.current;
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return {
    isDirty,
    markDirty,
    markClean,
    hasUnsavedChanges,
  };
}

export function useContentTracking(
  initialContent: string,
  onContentChange?: (content: string, isDirty: boolean) => void
) {
  const [content, setContent] = useState(initialContent);
  const previousContentRef = useRef(initialContent);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    previousContentRef.current = initialContent;
    setContent(initialContent);
  }, [initialContent]);

  const updateContent = useCallback((newContent: string) => {
    setContent(newContent);
    const dirty = newContent !== previousContentRef.current;
    setIsDirty(dirty);
    onContentChange?.(newContent, dirty);
  }, [onContentChange]);

  const markSaved = useCallback(() => {
    previousContentRef.current = content;
    setIsDirty(false);
  }, [content]);

  return {
    content,
    setContent: updateContent,
    isDirty,
    markSaved,
  };
}