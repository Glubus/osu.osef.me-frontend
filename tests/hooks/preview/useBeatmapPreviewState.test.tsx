import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, act } from '@testing-library/react';
import { useBeatmapPreviewState } from '../../../src/hooks/preview/useBeatmapPreviewState';

describe('useBeatmapPreviewState', () => {
  afterEach(() => {
    // Cleanup
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.currentTime).toBe(0);
    expect(result.current.progress).toBe(0);
    expect(result.current.scrollSpeed).toBe(0.2);
  });

  test('starts playing by default', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    expect(result.current.isPlaying).toBe(true);
  });

  test('toggles play/pause state', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.handlePlayPause();
    });

    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.handlePlayPause();
    });

    expect(result.current.isPlaying).toBe(true);
  });

  test('resets to initial state', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    // Change some values
    act(() => {
      result.current.handlePlayPause(); // Pause
    });

    act(() => {
      result.current.handleScrollSpeedChange({
        target: { value: '0.5' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Reset
    act(() => {
      result.current.handleReset();
    });

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.currentTime).toBe(0);
    expect(result.current.progress).toBe(0);
    expect(result.current.scrollSpeed).toBe(0.5); // Scroll speed should remain changed
  });

  test('updates scroll speed', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    act(() => {
      result.current.handleScrollSpeedChange({
        target: { value: '0.8' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.scrollSpeed).toBe(0.8);
  });

  test('updates progress and current time', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    act(() => {
      result.current.handleProgressChange(50);
    });

    expect(result.current.progress).toBe(50);
    expect(result.current.currentTime).toBe(30000); // 50% of 60000ms
  });

  test('calculates progress correctly', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    act(() => {
      result.current.handleProgressChange(25);
    });

    expect(result.current.progress).toBe(25);
    expect(result.current.currentTime).toBe(15000); // 25% of 60000ms
  });

  test('handles progress change with custom duration', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(120000));

    act(() => {
      result.current.handleProgressChange(75);
    });

    expect(result.current.progress).toBe(75);
    expect(result.current.currentTime).toBe(90000); // 75% of 120000ms
  });

  test('uses default duration when totalDuration is 0', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(0));

    act(() => {
      result.current.handleProgressChange(50);
    });

    expect(result.current.currentTime).toBe(30000); // 50% of default 60000ms
  });

  test('handles scroll speed change with string values', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    act(() => {
      result.current.handleScrollSpeedChange({
        target: { value: '1.5' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.scrollSpeed).toBe(1.5);
  });

  test('handles scroll speed change with decimal values', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    act(() => {
      result.current.handleScrollSpeedChange({
        target: { value: '0.25' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.scrollSpeed).toBe(0.25);
  });

  test('maintains state consistency across multiple operations', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    // Perform multiple operations
    act(() => {
      result.current.handleScrollSpeedChange({
        target: { value: '0.7' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleProgressChange(30);
    });

    act(() => {
      result.current.handlePlayPause();
    });

    // Verify all changes are maintained
    expect(result.current.scrollSpeed).toBe(0.7);
    expect(result.current.progress).toBe(30);
    expect(result.current.currentTime).toBe(18000); // 30% of 60000ms
    expect(result.current.isPlaying).toBe(false);
  });

  test('handles negative progress values', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    act(() => {
      result.current.handleProgressChange(-10);
    });

    expect(result.current.progress).toBe(-10);
    expect(result.current.currentTime).toBe(-6000); // -10% of 60000ms
  });

  test('handles progress values over 100', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    act(() => {
      result.current.handleProgressChange(150);
    });

    expect(result.current.progress).toBe(150);
    expect(result.current.currentTime).toBe(90000); // 150% of 60000ms
  });

  test('handles zero scroll speed', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    act(() => {
      result.current.handleScrollSpeedChange({
        target: { value: '0' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.scrollSpeed).toBe(0);
  });

  test('handles very high scroll speed', () => {
    const { result } = renderHook(() => useBeatmapPreviewState(60000));

    act(() => {
      result.current.handleScrollSpeedChange({
        target: { value: '10' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.scrollSpeed).toBe(10);
  });
});