import { useCallback, useRef, useEffect, useState } from 'react';

export interface UseAutoSaveOptions {
  interval?: number;
  onSave: (content: string) => Promise<void>;
  enabled?: boolean;
}

export interface UseAutoSaveReturn {
  lastSaved: Date | null;
  isSaving: boolean;
  saveNow: () => Promise<void>;
  setContent: (content: string) => void;
}

export function useAutoSave({
  interval = 30000,
  onSave,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContentState] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>('');

  const setContent = useCallback((newContent: string) => {
    setContentState(newContent);
  }, []);

  const saveNow = useCallback(async () => {
    if (!content || content === lastContentRef.current) return;
    
    setIsSaving(true);
    try {
      await onSave(content);
      lastContentRef.current = content;
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [content, onSave]);

  useEffect(() => {
    if (!enabled || !content) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (content !== lastContentRef.current) {
      timeoutRef.current = setTimeout(() => {
        saveNow();
      }, interval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, interval, enabled, saveNow]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (content !== lastContentRef.current) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [content]);

  return {
    lastSaved,
    isSaving,
    saveNow,
    setContent,
  };
}