import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, cleanup } from '@testing-library/react';
import { useSortedBeatmaps } from '../../../src/hooks/ui/useSortedBeatmaps';
import type { BeatmapCompleteShort } from '../../../src/types/beatmap/short';

describe('useSortedBeatmaps', () => {
  afterEach(() => {
    cleanup();
  });

  const createMockBeatmap = (id: number, overall: number): BeatmapCompleteShort => ({
    beatmap: {
      id,
      osu_id: id,
      difficulty: `Test ${id}`,
      difficulty_rating: overall,
      mode: 0,
      status: 'ranked'
    },
    msd: {
      id,
      overall: overall,
      main_pattern: 'stream'
    }
  });

  test('returns empty array for empty beatmaps', () => {
    const { result } = renderHook(() => useSortedBeatmaps([]));
    
    expect(result.current).toEqual([]);
  });

  test('returns single beatmap unchanged', () => {
    const beatmaps = [createMockBeatmap(1, 5.0)];
    const { result } = renderHook(() => useSortedBeatmaps(beatmaps));
    
    expect(result.current).toHaveLength(1);
    expect(result.current[0].beatmap.id).toBe(1);
    expect(result.current[0].msd.overall).toBe(5.0);
  });

  test('sorts beatmaps by overall rating in ascending order', () => {
    const beatmaps = [
      createMockBeatmap(1, 7.0),
      createMockBeatmap(2, 3.0),
      createMockBeatmap(3, 5.0)
    ];
    const { result } = renderHook(() => useSortedBeatmaps(beatmaps));
    
    expect(result.current).toHaveLength(3);
    expect(result.current[0].msd.overall).toBe(3.0);
    expect(result.current[1].msd.overall).toBe(5.0);
    expect(result.current[2].msd.overall).toBe(7.0);
  });

  test('handles beatmaps with undefined msd', () => {
    const beatmaps = [
      { ...createMockBeatmap(1, 5.0), msd: undefined },
      createMockBeatmap(2, 7.0)
    ];
    const { result } = renderHook(() => useSortedBeatmaps(beatmaps));
    
    expect(result.current).toHaveLength(2);
    expect(result.current[0].msd?.overall).toBeUndefined();
    expect(result.current[1].msd.overall).toBe(7.0);
  });

  test('handles beatmaps with undefined overall', () => {
    const beatmaps = [
      { ...createMockBeatmap(1, 5.0), msd: { ...createMockBeatmap(1, 5.0).msd!, overall: undefined } },
      createMockBeatmap(2, 7.0)
    ];
    const { result } = renderHook(() => useSortedBeatmaps(beatmaps));
    
    expect(result.current).toHaveLength(2);
    expect(result.current[0].msd.overall).toBeUndefined();
    expect(result.current[1].msd.overall).toBe(7.0);
  });

  test('handles negative overall ratings', () => {
    const beatmaps = [
      createMockBeatmap(1, 5.0),
      createMockBeatmap(2, -1.0),
      createMockBeatmap(3, 10.0)
    ];
    const { result } = renderHook(() => useSortedBeatmaps(beatmaps));
    
    expect(result.current).toHaveLength(3);
    expect(result.current[0].msd.overall).toBe(-1.0);
    expect(result.current[1].msd.overall).toBe(5.0);
    expect(result.current[2].msd.overall).toBe(10.0);
  });

  test('handles zero overall ratings', () => {
    const beatmaps = [
      createMockBeatmap(1, 5.0),
      createMockBeatmap(2, 0),
      createMockBeatmap(3, 10.0)
    ];
    const { result } = renderHook(() => useSortedBeatmaps(beatmaps));
    
    expect(result.current).toHaveLength(3);
    expect(result.current[0].msd.overall).toBe(0);
    expect(result.current[1].msd.overall).toBe(5.0);
    expect(result.current[2].msd.overall).toBe(10.0);
  });

  test('handles duplicate overall ratings', () => {
    const beatmaps = [
      createMockBeatmap(1, 5.0),
      createMockBeatmap(2, 5.0),
      createMockBeatmap(3, 3.0)
    ];
    const { result } = renderHook(() => useSortedBeatmaps(beatmaps));
    
    expect(result.current).toHaveLength(3);
    expect(result.current[0].msd.overall).toBe(3.0);
    expect(result.current[1].msd.overall).toBe(5.0);
    expect(result.current[2].msd.overall).toBe(5.0);
  });

  test('preserves original beatmaps array', () => {
    const originalBeatmaps = [
      createMockBeatmap(1, 7.0),
      createMockBeatmap(2, 3.0),
      createMockBeatmap(3, 5.0)
    ];
    const { result } = renderHook(() => useSortedBeatmaps(originalBeatmaps));
    
    // Original array should be unchanged
    expect(originalBeatmaps[0].msd.overall).toBe(7.0);
    expect(originalBeatmaps[1].msd.overall).toBe(3.0);
    expect(originalBeatmaps[2].msd.overall).toBe(5.0);
    
    // Result should be sorted
    expect(result.current[0].msd.overall).toBe(3.0);
    expect(result.current[1].msd.overall).toBe(5.0);
    expect(result.current[2].msd.overall).toBe(7.0);
  });

  test('memoizes result correctly', () => {
    const beatmaps = [createMockBeatmap(1, 5.0)];
    const { result, rerender } = renderHook(() => useSortedBeatmaps(beatmaps));
    
    const firstResult = result.current;
    
    // Rerender with same data
    rerender();
    
    expect(result.current).toBe(firstResult);
  });

  test('updates when beatmaps change', () => {
    const initialBeatmaps = [createMockBeatmap(1, 5.0)];
    const { result, rerender } = renderHook(
      ({ beatmaps }) => useSortedBeatmaps(beatmaps),
      { initialProps: { beatmaps: initialBeatmaps } }
    );
    
    expect(result.current).toHaveLength(1);
    expect(result.current[0].msd.overall).toBe(5.0);
    
    const newBeatmaps = [
      createMockBeatmap(1, 7.0),
      createMockBeatmap(2, 3.0)
    ];
    rerender({ beatmaps: newBeatmaps });
    
    expect(result.current).toHaveLength(2);
    expect(result.current[0].msd.overall).toBe(3.0);
    expect(result.current[1].msd.overall).toBe(7.0);
  });

  test('handles large number of beatmaps', () => {
    const beatmaps = Array.from({ length: 100 }, (_, i) => 
      createMockBeatmap(i + 1, Math.random() * 10)
    );
    const { result } = renderHook(() => useSortedBeatmaps(beatmaps));
    
    expect(result.current).toHaveLength(100);
    
    // Check that array is sorted
    for (let i = 1; i < result.current.length; i++) {
      const prev = Number(result.current[i - 1].msd?.overall ?? 0);
      const curr = Number(result.current[i].msd?.overall ?? 0);
      expect(prev).toBeLessThanOrEqual(curr);
    }
  });
});
