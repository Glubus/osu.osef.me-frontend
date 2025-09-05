import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, cleanup } from '@testing-library/react';
import { useBeatmapStatus } from '../../../src/hooks/atoms/useBeatmapStatus';
import type { BeatmapCompleteShort } from '../../../src/types/beatmap/short';

describe('useBeatmapStatus', () => {
  afterEach(() => {
    cleanup();
  });

  const createMockBeatmap = (id: number, status: string): BeatmapCompleteShort => ({
    beatmap: {
      id,
      osu_id: id,
      difficulty: `Test ${id}`,
      difficulty_rating: 5.0,
      mode: 0,
      status
    },
    msd: {
      id,
      overall: 5.0,
      main_pattern: 'stream'
    }
  });

  test('returns ranked status when beatmaps contain ranked', () => {
    const beatmaps = [
      createMockBeatmap(1, 'ranked'),
      createMockBeatmap(2, 'loved')
    ];
    const { result } = renderHook(() => useBeatmapStatus(beatmaps));
    
    expect(result.current.status).toBe('ranked');
    expect(result.current.color).toBe('blue');
    expect(result.current.icon).toBeDefined();
  });

  test('returns loved status when no ranked but has loved', () => {
    const beatmaps = [
      createMockBeatmap(1, 'loved'),
      createMockBeatmap(2, 'graveyard')
    ];
    const { result } = renderHook(() => useBeatmapStatus(beatmaps));
    
    expect(result.current.status).toBe('loved');
    expect(result.current.color).toBe('pink');
    expect(result.current.icon).toBeDefined();
  });

  test('returns graveyard status when no ranked or loved but has graveyard', () => {
    const beatmaps = [
      createMockBeatmap(1, 'graveyard'),
      createMockBeatmap(2, 'pending')
    ];
    const { result } = renderHook(() => useBeatmapStatus(beatmaps));
    
    expect(result.current.status).toBe('graveyard');
    expect(result.current.color).toBe('gray');
    expect(result.current.icon).toBeDefined();
  });

  test('returns first status when no priority statuses found', () => {
    const beatmaps = [
      createMockBeatmap(1, 'pending'),
      createMockBeatmap(2, 'wip')
    ];
    const { result } = renderHook(() => useBeatmapStatus(beatmaps));
    
    expect(result.current.status).toBe('pending');
    expect(result.current.color).toBe('gray');
    expect(result.current.icon).toBeDefined();
  });

  test('handles empty beatmaps array', () => {
    const { result } = renderHook(() => useBeatmapStatus([]));
    
    expect(result.current.status).toBe('unknown');
    expect(result.current.color).toBe('gray');
    expect(result.current.icon).toBeDefined();
  });

  test('prioritizes ranked over other statuses', () => {
    const beatmaps = [
      createMockBeatmap(1, 'loved'),
      createMockBeatmap(2, 'ranked'),
      createMockBeatmap(3, 'graveyard')
    ];
    const { result } = renderHook(() => useBeatmapStatus(beatmaps));
    
    expect(result.current.status).toBe('ranked');
    expect(result.current.color).toBe('blue');
  });

  test('prioritizes loved over graveyard', () => {
    const beatmaps = [
      createMockBeatmap(1, 'graveyard'),
      createMockBeatmap(2, 'loved'),
      createMockBeatmap(3, 'pending')
    ];
    const { result } = renderHook(() => useBeatmapStatus(beatmaps));
    
    expect(result.current.status).toBe('loved');
    expect(result.current.color).toBe('pink');
  });

  test('handles single beatmap', () => {
    const beatmaps = [createMockBeatmap(1, 'ranked')];
    const { result } = renderHook(() => useBeatmapStatus(beatmaps));
    
    expect(result.current.status).toBe('ranked');
    expect(result.current.color).toBe('blue');
  });

  test('memoizes result correctly', () => {
    const beatmaps = [createMockBeatmap(1, 'ranked')];
    const { result, rerender } = renderHook(() => useBeatmapStatus(beatmaps));
    
    const firstResult = result.current;
    
    // Rerender with same data
    rerender();
    
    expect(result.current).toBe(firstResult);
  });

  test('updates when beatmaps change', () => {
    const initialBeatmaps = [createMockBeatmap(1, 'pending')];
    const { result, rerender } = renderHook(
      ({ beatmaps }) => useBeatmapStatus(beatmaps),
      { initialProps: { beatmaps: initialBeatmaps } }
    );
    
    expect(result.current.status).toBe('pending');
    
    const newBeatmaps = [createMockBeatmap(1, 'ranked')];
    rerender({ beatmaps: newBeatmaps });
    
    expect(result.current.status).toBe('ranked');
    expect(result.current.color).toBe('blue');
  });

  test('handles mixed status types', () => {
    const beatmaps = [
      createMockBeatmap(1, 'ranked'),
      createMockBeatmap(2, 'loved'),
      createMockBeatmap(3, 'graveyard'),
      createMockBeatmap(4, 'pending')
    ];
    const { result } = renderHook(() => useBeatmapStatus(beatmaps));
    
    expect(result.current.status).toBe('ranked');
    expect(result.current.color).toBe('blue');
  });
});
