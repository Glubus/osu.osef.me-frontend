import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, cleanup } from '@testing-library/react';
import { useDifficultyRange } from '../../../src/hooks/atoms/useDifficultyRange';
import type { BeatmapCompleteShort } from '../../../src/types/beatmap/short';

describe('useDifficultyRange', () => {
  afterEach(() => {
    cleanup();
  });

  const createMockBeatmap = (overall: number): BeatmapCompleteShort => ({
    beatmap: {
      id: 1,
      osu_id: 1,
      difficulty: 'Test',
      difficulty_rating: overall,
      mode: 0,
      status: 'ranked'
    },
    msd: {
      id: 1,
      overall: overall,
      main_pattern: 'stream'
    }
  });

  test('returns null for empty beatmaps array', () => {
    const { result } = renderHook(() => useDifficultyRange([]));
    
    expect(result.current).toBeNull();
  });

  test('calculates correct range for single beatmap', () => {
    const beatmaps = [createMockBeatmap(5.5)];
    const { result } = renderHook(() => useDifficultyRange(beatmaps));
    
    expect(result.current).toEqual({
      minRating: 5.5,
      maxRating: 5.5
    });
  });

  test('calculates correct range for multiple beatmaps', () => {
    const beatmaps = [
      createMockBeatmap(3.2),
      createMockBeatmap(7.8),
      createMockBeatmap(5.1)
    ];
    const { result } = renderHook(() => useDifficultyRange(beatmaps));
    
    expect(result.current).toEqual({
      minRating: 3.2,
      maxRating: 7.8
    });
  });

  test('handles beatmaps with undefined msd', () => {
    const beatmaps = [
      { ...createMockBeatmap(5.0), msd: undefined },
      createMockBeatmap(7.0)
    ];
    const { result } = renderHook(() => useDifficultyRange(beatmaps));
    
    expect(result.current).toEqual({
      minRating: 0,
      maxRating: 7.0
    });
  });

  test('handles beatmaps with undefined overall', () => {
    const beatmaps = [
      { ...createMockBeatmap(5.0), msd: { ...createMockBeatmap(5.0).msd!, overall: undefined } },
      createMockBeatmap(7.0)
    ];
    const { result } = renderHook(() => useDifficultyRange(beatmaps));
    
    expect(result.current).toEqual({
      minRating: 0,
      maxRating: 7.0
    });
  });

  test('sorts beatmaps by overall rating', () => {
    const beatmaps = [
      createMockBeatmap(9.0),
      createMockBeatmap(2.0),
      createMockBeatmap(6.0),
      createMockBeatmap(4.0)
    ];
    const { result } = renderHook(() => useDifficultyRange(beatmaps));
    
    expect(result.current).toEqual({
      minRating: 2.0,
      maxRating: 9.0
    });
  });

  test('handles negative ratings', () => {
    const beatmaps = [
      createMockBeatmap(-1.0),
      createMockBeatmap(5.0),
      createMockBeatmap(10.0)
    ];
    const { result } = renderHook(() => useDifficultyRange(beatmaps));
    
    expect(result.current).toEqual({
      minRating: -1.0,
      maxRating: 10.0
    });
  });

  test('handles zero ratings', () => {
    const beatmaps = [
      createMockBeatmap(0),
      createMockBeatmap(5.0),
      createMockBeatmap(0)
    ];
    const { result } = renderHook(() => useDifficultyRange(beatmaps));
    
    expect(result.current).toEqual({
      minRating: 0,
      maxRating: 5.0
    });
  });

  test('memoizes result correctly', () => {
    const beatmaps = [createMockBeatmap(5.0)];
    const { result, rerender } = renderHook(() => useDifficultyRange(beatmaps));
    
    const firstResult = result.current;
    
    // Rerender with same data
    rerender();
    
    expect(result.current).toBe(firstResult);
  });

  test('updates when beatmaps change', () => {
    const initialBeatmaps = [createMockBeatmap(5.0)];
    const { result, rerender } = renderHook(
      ({ beatmaps }) => useDifficultyRange(beatmaps),
      { initialProps: { beatmaps: initialBeatmaps } }
    );
    
    expect(result.current).toEqual({
      minRating: 5.0,
      maxRating: 5.0
    });
    
    const newBeatmaps = [createMockBeatmap(3.0), createMockBeatmap(8.0)];
    rerender({ beatmaps: newBeatmaps });
    
    expect(result.current).toEqual({
      minRating: 3.0,
      maxRating: 8.0
    });
  });
});
