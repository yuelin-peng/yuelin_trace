import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  modifiers?: readonly ('ctrl' | 'shift' | 'alt' | 'meta')[];
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      for (const shortcut of shortcuts) {
        const modifiersMatch = shortcut.modifiers?.every((mod) => {
          switch (mod) {
            case 'ctrl':
              return e.ctrlKey;
            case 'shift':
              return e.shiftKey;
            case 'alt':
              return e.altKey;
            case 'meta':
              return e.metaKey;
            default:
              return false;
          }
        }) ?? true;

        if (e.key.toLowerCase() === shortcut.key.toLowerCase() && modifiersMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export const EDITOR_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 's',
    modifiers: ['ctrl'],
    action: () => {
      const saveButton = document.querySelector('[data-save-action]') as HTMLButtonElement;
      saveButton?.click();
    },
    description: 'Save draft',
  },
  {
    key: 'p',
    modifiers: ['ctrl', 'shift'],
    action: () => {
      const publishButton = document.querySelector('[data-publish-action]') as HTMLButtonElement;
      publishButton?.click();
    },
    description: 'Publish article',
  },
  {
    key: 'b',
    modifiers: ['ctrl'],
    action: () => {
      insertMarkdown('**', '**');
    },
    description: 'Bold',
  },
  {
    key: 'i',
    modifiers: ['ctrl'],
    action: () => {
      insertMarkdown('*', '*');
    },
    description: 'Italic',
  },
  {
    key: '`',
    modifiers: ['ctrl'],
    action: () => {
      insertMarkdown('`', '`');
    },
    description: 'Inline code',
  },
  {
    key: 'k',
    modifiers: ['ctrl'],
    action: () => {
      insertMarkdown('[', '](url)');
    },
    description: 'Insert link',
  },
  {
    key: 'Escape',
    action: () => {
      const closeButton = document.querySelector('[data-modal-close]') as HTMLButtonElement;
      closeButton?.click();
    },
    description: 'Close modal/dialog',
  },
];

function insertMarkdown(prefix: string, suffix: string) {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end) || 'text';

  const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
  textarea.value = newText;
  textarea.focus();
  textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
}

export function useEditorShortcuts(enabled = true) {
  return useKeyboardShortcuts(EDITOR_SHORTCUTS, enabled);
}

export default useKeyboardShortcuts;