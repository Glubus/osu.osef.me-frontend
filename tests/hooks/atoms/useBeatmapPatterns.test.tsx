import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, cleanup } from '@testing-library/react';
import { useBeatmapPatterns } from '../../../src/hooks/atoms/useBeatmapPatterns';
import type { BeatmapCompleteShort } from '../../../src/types/beatmap/short';

describe('useBeatmapPatterns', () => {
  afterEach(() => {
    cleanup();
  });

  const createMockBeatmap = (id: number, mainPattern?: string | string[]): BeatmapCompleteShort => ({
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
      main_pattern: mainPattern
    }
  });

  test('returns empty array for empty beatmaps', () => {
    const { result } = renderHook(() => useBeatmapPatterns([]));
    
    expect(result.current).toEqual([]);
  });

  test('returns empty array for beatmaps without patterns', () => {
    const beatmaps = [
      createMockBeatmap(1),
      createMockBeatmap(2)
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toEqual([]);
  });

  test('extracts single pattern from beatmap', () => {
    const beatmaps = [createMockBeatmap(1, 'stream')];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toEqual(['stream']);
  });

  test('extracts multiple unique patterns from beatmaps', () => {
    const beatmaps = [
      createMockBeatmap(1, 'stream'),
      createMockBeatmap(2, 'jumpstream'),
      createMockBeatmap(3, 'technical')
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toHaveLength(3);
    expect(result.current).toContain('stream');
    expect(result.current).toContain('jumpstream');
    expect(result.current).toContain('technical');
  });

  test('removes duplicate patterns', () => {
    const beatmaps = [
      createMockBeatmap(1, 'stream'),
      createMockBeatmap(2, 'stream'),
      createMockBeatmap(3, 'jumpstream')
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toHaveLength(2);
    expect(result.current).toContain('stream');
    expect(result.current).toContain('jumpstream');
  });

  test('handles array patterns', () => {
    const beatmaps = [
      createMockBeatmap(1, ['stream', 'jumpstream']),
      createMockBeatmap(2, 'technical')
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toHaveLength(3);
    expect(result.current).toContain('stream');
    expect(result.current).toContain('jumpstream');
    expect(result.current).toContain('technical');
  });

  test('handles JSON string patterns', () => {
    const beatmaps = [
      createMockBeatmap(1, '["stream", "jumpstream"]'),
      createMockBeatmap(2, 'technical')
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toHaveLength(3);
    expect(result.current).toContain('stream');
    expect(result.current).toContain('jumpstream');
    expect(result.current).toContain('technical');
  });

  test('handles invalid JSON gracefully', () => {
    const beatmaps = [
      createMockBeatmap(1, 'invalid-json'),
      createMockBeatmap(2, 'stream')
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toHaveLength(2);
    expect(result.current).toContain('invalid-json');
    expect(result.current).toContain('stream');
  });

  test('respects maxPatterns limit', () => {
    const beatmaps = [
      createMockBeatmap(1, 'stream'),
      createMockBeatmap(2, 'jumpstream'),
      createMockBeatmap(3, 'technical'),
      createMockBeatmap(4, 'chordjack'),
      createMockBeatmap(5, 'stamina')
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps, 3));
    
    expect(result.current).toHaveLength(3);
  });

  test('uses default maxPatterns of 3', () => {
    const beatmaps = [
      createMockBeatmap(1, 'stream'),
      createMockBeatmap(2, 'jumpstream'),
      createMockBeatmap(3, 'technical'),
      createMockBeatmap(4, 'chordjack'),
      createMockBeatmap(5, 'stamina')
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toHaveLength(3);
  });

  test('handles maxPatterns of 0', () => {
    const beatmaps = [
      createMockBeatmap(1, 'stream'),
      createMockBeatmap(2, 'jumpstream')
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps, 0));
    
    expect(result.current).toHaveLength(0);
  });

  test('handles negative maxPatterns', () => {
    const beatmaps = [
      createMockBeatmap(1, 'stream'),
      createMockBeatmap(2, 'jumpstream')
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps, -1));
    
    // slice(0, -1) returns all elements except the last one
    expect(result.current).toHaveLength(1);
    expect(result.current).toContain('stream');
  });

  test('handles undefined main_pattern', () => {
    const beatmaps = [
      { ...createMockBeatmap(1), msd: { ...createMockBeatmap(1).msd!, main_pattern: undefined } },
      createMockBeatmap(2, 'stream')
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toEqual(['stream']);
  });

  test('handles null main_pattern', () => {
    const beatmaps = [
      { ...createMockBeatmap(1), msd: { ...createMockBeatmap(1).msd!, main_pattern: null as any } },
      createMockBeatmap(2, 'stream')
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toEqual(['stream']);
  });

  test('memoizes result correctly', () => {
    const beatmaps = [createMockBeatmap(1, 'stream')];
    const { result, rerender } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    const firstResult = result.current;
    
    // Rerender with same data
    rerender();
    
    expect(result.current).toBe(firstResult);
  });

  test('updates when beatmaps change', () => {
    const initialBeatmaps = [createMockBeatmap(1, 'stream')];
    const { result, rerender } = renderHook(
      ({ beatmaps, maxPatterns }) => useBeatmapPatterns(beatmaps, maxPatterns),
      { initialProps: { beatmaps: initialBeatmaps, maxPatterns: 3 } }
    );
    
    expect(result.current).toEqual(['stream']);
    
    const newBeatmaps = [
      createMockBeatmap(1, 'stream'),
      createMockBeatmap(2, 'jumpstream')
    ];
    rerender({ beatmaps: newBeatmaps, maxPatterns: 3 });
    
    expect(result.current).toHaveLength(2);
    expect(result.current).toContain('stream');
    expect(result.current).toContain('jumpstream');
  });

  test('updates when maxPatterns changes', () => {
    const beatmaps = [
      createMockBeatmap(1, 'stream'),
      createMockBeatmap(2, 'jumpstream'),
      createMockBeatmap(3, 'technical'),
      createMockBeatmap(4, 'chordjack')
    ];
    const { result, rerender } = renderHook(
      ({ beatmaps, maxPatterns }) => useBeatmapPatterns(beatmaps, maxPatterns),
      { initialProps: { beatmaps, maxPatterns: 2 } }
    );
    
    expect(result.current).toHaveLength(2);
    
    rerender({ beatmaps, maxPatterns: 4 });
    
    expect(result.current).toHaveLength(4);
  });

  test('handles mixed pattern types', () => {
    const beatmaps = [
      createMockBeatmap(1, 'stream'),
      createMockBeatmap(2, ['jumpstream', 'technical']),
      createMockBeatmap(3, '["chordjack", "stamina"]'),
      createMockBeatmap(4, 'handstream')
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps, 10));
    
    // Should have: stream, jumpstream, technical, chordjack, stamina, handstream
    expect(result.current).toHaveLength(6);
    expect(result.current).toContain('stream');
    expect(result.current).toContain('jumpstream');
    expect(result.current).toContain('technical');
    expect(result.current).toContain('chordjack');
    expect(result.current).toContain('stamina');
    expect(result.current).toContain('handstream');
  });
});
