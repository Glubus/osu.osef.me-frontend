import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, cleanup } from '@testing-library/react';
import { useDisplayedBeatmaps } from '../../../src/hooks/ui/useDisplayedBeatmaps';
import type { BeatmapCompleteShort } from '../../../src/types/beatmap/short';

describe('useDisplayedBeatmaps', () => {
  afterEach(() => {
    cleanup();
  });

  const createMockBeatmap = (id: number): BeatmapCompleteShort => ({
    beatmap: {
      id,
      osu_id: id,
      difficulty: `Test ${id}`,
      difficulty_rating: 5.0,
      mode: 0,
      status: 'ranked'
    },
    msd: {
      id,
      overall: 5.0,
      main_pattern: 'stream'
    }
  });

  test('returns empty arrays for empty beatmaps', () => {
    const { result } = renderHook(() => useDisplayedBeatmaps([]));
    
    expect(result.current.displayedMaps).toEqual([]);
    expect(result.current.remainingCount).toBe(0);
  });

  test('returns all beatmaps when count is less than maxDisplayed', () => {
    const beatmaps = [createMockBeatmap(1), createMockBeatmap(2)];
    const { result } = renderHook(() => useDisplayedBeatmaps(beatmaps, 5));
    
    expect(result.current.displayedMaps).toHaveLength(2);
    expect(result.current.displayedMaps[0].beatmap.id).toBe(1);
    expect(result.current.displayedMaps[1].beatmap.id).toBe(2);
    expect(result.current.remainingCount).toBe(0);
  });

  test('returns correct number of displayed beatmaps with default maxDisplayed', () => {
    const beatmaps = Array.from({ length: 10 }, (_, i) => createMockBeatmap(i + 1));
    const { result } = renderHook(() => useDisplayedBeatmaps(beatmaps));
    
    expect(result.current.displayedMaps).toHaveLength(5);
    expect(result.current.remainingCount).toBe(5);
  });

  test('returns correct number of displayed beatmaps with custom maxDisplayed', () => {
    const beatmaps = Array.from({ length: 10 }, (_, i) => createMockBeatmap(i + 1));
    const { result } = renderHook(() => useDisplayedBeatmaps(beatmaps, 3));
    
    expect(result.current.displayedMaps).toHaveLength(3);
    expect(result.current.remainingCount).toBe(7);
  });

  test('returns first beatmaps in order', () => {
    const beatmaps = Array.from({ length: 5 }, (_, i) => createMockBeatmap(i + 1));
    const { result } = renderHook(() => useDisplayedBeatmaps(beatmaps, 3));
    
    expect(result.current.displayedMaps[0].beatmap.id).toBe(1);
    expect(result.current.displayedMaps[1].beatmap.id).toBe(2);
    expect(result.current.displayedMaps[2].beatmap.id).toBe(3);
  });

  test('handles maxDisplayed of 0', () => {
    const beatmaps = [createMockBeatmap(1), createMockBeatmap(2)];
    const { result } = renderHook(() => useDisplayedBeatmaps(beatmaps, 0));
    
    expect(result.current.displayedMaps).toHaveLength(0);
    expect(result.current.remainingCount).toBe(2);
  });

  test('handles maxDisplayed greater than beatmaps length', () => {
    const beatmaps = [createMockBeatmap(1), createMockBeatmap(2)];
    const { result } = renderHook(() => useDisplayedBeatmaps(beatmaps, 10));
    
    expect(result.current.displayedMaps).toHaveLength(2);
    expect(result.current.remainingCount).toBe(0);
  });

  test('handles negative maxDisplayed', () => {
    const beatmaps = [createMockBeatmap(1), createMockBeatmap(2)];
    const { result } = renderHook(() => useDisplayedBeatmaps(beatmaps, -1));
    
    // slice(0, -1) returns all elements except the last one
    expect(result.current.displayedMaps).toHaveLength(1);
    expect(result.current.displayedMaps[0].beatmap.id).toBe(1);
    // remainingCount = Math.max(0, 2 - (-1)) = Math.max(0, 3) = 3
    expect(result.current.remainingCount).toBe(3);
  });

  test('memoizes result correctly', () => {
    const beatmaps = [createMockBeatmap(1), createMockBeatmap(2)];
    const { result, rerender } = renderHook(() => useDisplayedBeatmaps(beatmaps, 5));
    
    const firstResult = result.current;
    
    // Rerender with same data
    rerender();
    
    expect(result.current).toBe(firstResult);
  });

  test('updates when beatmaps change', () => {
    const initialBeatmaps = [createMockBeatmap(1)];
    const { result, rerender } = renderHook(
      ({ beatmaps, maxDisplayed }) => useDisplayedBeatmaps(beatmaps, maxDisplayed),
      { initialProps: { beatmaps: initialBeatmaps, maxDisplayed: 5 } }
    );
    
    expect(result.current.displayedMaps).toHaveLength(1);
    expect(result.current.remainingCount).toBe(0);
    
    const newBeatmaps = [createMockBeatmap(1), createMockBeatmap(2), createMockBeatmap(3)];
    rerender({ beatmaps: newBeatmaps, maxDisplayed: 5 });
    
    expect(result.current.displayedMaps).toHaveLength(3);
    expect(result.current.remainingCount).toBe(0);
  });

  test('updates when maxDisplayed changes', () => {
    const beatmaps = Array.from({ length: 10 }, (_, i) => createMockBeatmap(i + 1));
    const { result, rerender } = renderHook(
      ({ beatmaps, maxDisplayed }) => useDisplayedBeatmaps(beatmaps, maxDisplayed),
      { initialProps: { beatmaps, maxDisplayed: 3 } }
    );
    
    expect(result.current.displayedMaps).toHaveLength(3);
    expect(result.current.remainingCount).toBe(7);
    
    rerender({ beatmaps, maxDisplayed: 7 });
    
    expect(result.current.displayedMaps).toHaveLength(7);
    expect(result.current.remainingCount).toBe(3);
  });

  test('handles single beatmap', () => {
    const beatmaps = [createMockBeatmap(1)];
    const { result } = renderHook(() => useDisplayedBeatmaps(beatmaps, 5));
    
    expect(result.current.displayedMaps).toHaveLength(1);
    expect(result.current.displayedMaps[0].beatmap.id).toBe(1);
    expect(result.current.remainingCount).toBe(0);
  });
});
