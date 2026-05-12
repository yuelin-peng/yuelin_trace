import { renderHook, act } from '@testing-library/react';
import { useDirtyState, useContentTracking } from '../../../src/hooks/useDirtyState';

describe('useDirtyState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with not dirty', () => {
    const { result } = renderHook(() => useDirtyState());

    expect(result.current.isDirty).toBe(false);
  });

  it('should mark dirty', () => {
    const { result } = renderHook(() => useDirtyState());

    act(() => {
      result.current.markDirty();
    });

    expect(result.current.isDirty).toBe(true);
  });

  it('should mark clean and update reference', () => {
    const { result } = renderHook(() => useDirtyState());

    act(() => {
      result.current.markDirty();
    });

    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.markClean();
    });

    expect(result.current.isDirty).toBe(false);
  });
});

describe('useContentTracking', () => {
  it('should initialize with initial content', () => {
    const { result } = renderHook(() => useContentTracking('initial content'));

    expect(result.current.content).toBe('initial content');
    expect(result.current.isDirty).toBe(false);
  });

  it('should detect changes', () => {
    const { result } = renderHook(() => useContentTracking('initial'));

    act(() => {
      result.current.setContent('changed content');
    });

    expect(result.current.isDirty).toBe(true);
  });

  it('should mark as saved', () => {
    const { result } = renderHook(() => useContentTracking('initial'));

    act(() => {
      result.current.setContent('changed');
    });

    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.markSaved();
    });

    expect(result.current.isDirty).toBe(false);
  });

  it('should call onContentChange callback', () => {
    const mockCallback = jest.fn();
    
    const { result } = renderHook(() => useContentTracking('initial', mockCallback));

    act(() => {
      result.current.setContent('new content');
    });

    expect(mockCallback).toHaveBeenCalledWith('new content', true);
  });
});
