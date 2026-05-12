import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts, EDITOR_SHORTCUTS } from '../../../src/hooks/useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register shortcuts', () => {
    const action = jest.fn();
    const shortcuts = [
      { key: 's', modifiers: ['ctrl'] as const, action, description: 'Save' },
    ];

    const { result } = renderHook(() => useKeyboardShortcuts(shortcuts));

    expect(result.current).toBeUndefined(); // Hook doesn't return anything
  });

  it('should call action on keyboard event', () => {
    const action = jest.fn();
    const shortcuts = [
      { key: 's', modifiers: ['ctrl'] as const, action, description: 'Save' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
    document.dispatchEvent(event);

    expect(action).toHaveBeenCalled();
  });

  it('should not trigger when disabled', () => {
    const action = jest.fn();
    const shortcuts = [
      { key: 's', modifiers: ['ctrl'] as const, action, description: 'Save' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts, false));

    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
    document.dispatchEvent(event);

    expect(action).not.toHaveBeenCalled();
  });

  it('should not trigger when focus is on input', () => {
    const action = jest.fn();
    const shortcuts = [
      { key: 's', modifiers: ['ctrl'] as const, action, description: 'Save' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true });
    Object.defineProperty(event, 'target', { value: input, enumerable: true, configurable: true });
    document.dispatchEvent(event);

    expect(action).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('should support multiple modifiers', () => {
    const action = jest.fn();
    const shortcuts = [
      { key: 'p', modifiers: ['ctrl', 'shift'] as const, action, description: 'Publish' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', { key: 'P', ctrlKey: true, shiftKey: true });
    document.dispatchEvent(event);

    expect(action).toHaveBeenCalled();
  });

  it('should support single key without modifiers', () => {
    const action = jest.fn();
    const shortcuts = [
      { key: 'Escape', action, description: 'Close' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(action).toHaveBeenCalled();
  });
});

describe('EDITOR_SHORTCUTS', () => {
  it('should have predefined shortcuts', () => {
    expect(EDITOR_SHORTCUTS).toBeDefined();
    expect(EDITOR_SHORTCUTS.length).toBeGreaterThan(0);
  });

  it('should include save shortcut', () => {
    const saveShortcut = EDITOR_SHORTCUTS.find(s => s.key === 's' && s.modifiers?.includes('ctrl'));
    expect(saveShortcut).toBeDefined();
    expect(saveShortcut?.description).toBe('Save draft');
  });

  it('should include bold shortcut', () => {
    const boldShortcut = EDITOR_SHORTCUTS.find(s => s.key === 'b' && s.modifiers?.includes('ctrl'));
    expect(boldShortcut).toBeDefined();
    expect(boldShortcut?.description).toBe('Bold');
  });
});