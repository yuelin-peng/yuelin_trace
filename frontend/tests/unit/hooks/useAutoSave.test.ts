import { renderHook, act } from '@testing-library/react';
import { useAutoSave } from '../../../src/hooks/useAutoSave';

describe('useAutoSave', () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with null lastSaved', () => {
    const { result } = renderHook(() => useAutoSave({
      interval: 30000,
      onSave: mockOnSave,
    }));

    expect(result.current.lastSaved).toBeNull();
    expect(result.current.isSaving).toBe(false);
  });

  it('should set content', () => {
    const { result } = renderHook(() => useAutoSave({
      interval: 30000,
      onSave: mockOnSave,
    }));

    act(() => {
      result.current.setContent('test content');
    });

    expect(result.current.setContent).toBeDefined();
  });

  it('should save after interval', async () => {
    const { result } = renderHook(() => useAutoSave({
      interval: 30000,
      onSave: mockOnSave,
      enabled: true,
    }));

    act(() => {
      result.current.setContent('new content');
    });

    // Advance past interval
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockOnSave).toHaveBeenCalledWith('new content');
    expect(result.current.lastSaved).not.toBeNull();
  });

  it('should not save if content unchanged', async () => {
    const { result } = renderHook(() => useAutoSave({
      interval: 30000,
      onSave: mockOnSave,
      enabled: true,
    }));

    act(() => {
      result.current.setContent('content');
    });

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    await act(async () => {
      await Promise.resolve();
    });

    // First save
    expect(mockOnSave).toHaveBeenCalledTimes(1);

    // Same content, no new save
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('should call saveNow immediately', async () => {
    const { result } = renderHook(() => useAutoSave({
      interval: 30000,
      onSave: mockOnSave,
      enabled: true,
    }));

    act(() => {
      result.current.setContent('immediate save');
    });

    await act(async () => {
      await result.current.saveNow();
    });

    expect(mockOnSave).toHaveBeenCalledWith('immediate save');
  });
});
