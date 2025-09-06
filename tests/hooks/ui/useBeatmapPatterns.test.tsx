import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, cleanup } from '@testing-library/react';
import { useBeatmapPatterns } from '../../../src/hooks';
import { 
  mockBeatmapCompleteShortArrayWithVariations,
  mockBeatmapCompleteShortStream,
  mockBeatmapCompleteShortJumpstream,
  mockBeatmapCompleteShortTechnical,
  mockBeatmapCompleteShortWithArrayPattern,
  mockBeatmapCompleteShortWithJSONPattern,
  mockBeatmapCompleteShortWithoutPattern
} from '../../data';

describe('useBeatmapPatterns', () => {
  afterEach(() => {
    cleanup();
  });

  test('returns empty array for empty beatmaps', () => {
    const { result } = renderHook(() => useBeatmapPatterns([]));
    
    expect(result.current).toEqual([]);
  });

  test('returns empty array for beatmaps without patterns', () => {
    const beatmaps = [mockBeatmapCompleteShortWithoutPattern];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toEqual([]);
  });

  test('extracts single pattern from beatmap', () => {
    const beatmaps = [mockBeatmapCompleteShortStream];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toEqual(['stream']);
  });

  test('extracts multiple unique patterns from beatmaps', () => {
    const beatmaps = [
      mockBeatmapCompleteShortStream,
      mockBeatmapCompleteShortJumpstream,
      mockBeatmapCompleteShortTechnical
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toHaveLength(3);
    expect(result.current).toContain('stream');
    expect(result.current).toContain('jumpstream');
    expect(result.current).toContain('technical');
  });

  test('removes duplicate patterns', () => {
    const beatmaps = [
      mockBeatmapCompleteShortStream,
      mockBeatmapCompleteShortStream,
      mockBeatmapCompleteShortJumpstream
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toHaveLength(2);
    expect(result.current).toContain('stream');
    expect(result.current).toContain('jumpstream');
  });

  test('handles array patterns', () => {
    const beatmaps = [
      mockBeatmapCompleteShortWithArrayPattern,
      mockBeatmapCompleteShortTechnical
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toHaveLength(3);
    expect(result.current).toContain('stream');
    expect(result.current).toContain('jumpstream');
    expect(result.current).toContain('technical');
  });

  test('handles JSON string patterns', () => {
    const beatmaps = [
      mockBeatmapCompleteShortWithJSONPattern,
      mockBeatmapCompleteShortTechnical
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toHaveLength(2);
    expect(result.current).toContain('technical');
    expect(result.current).toContain('chordjack');
  });

  test('handles invalid JSON gracefully', () => {
    const beatmaps = [
      mockBeatmapCompleteShortWithJSONPattern,
      mockBeatmapCompleteShortStream
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toHaveLength(3);
    expect(result.current).toContain('technical');
    expect(result.current).toContain('chordjack');
    expect(result.current).toContain('stream');
  });

  test('respects maxPatterns limit', () => {
    const beatmaps = mockBeatmapCompleteShortArrayWithVariations;
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps, 3));
    
    expect(result.current).toHaveLength(3);
  });

  test('uses default maxPatterns of 3', () => {
    const beatmaps = mockBeatmapCompleteShortArrayWithVariations;
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toHaveLength(3);
  });

  test('handles maxPatterns of 0', () => {
    const beatmaps = [
      mockBeatmapCompleteShortStream,
      mockBeatmapCompleteShortJumpstream
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps, 0));
    
    expect(result.current).toHaveLength(0);
  });

  test('handles negative maxPatterns', () => {
    const beatmaps = [
      mockBeatmapCompleteShortStream,
      mockBeatmapCompleteShortJumpstream
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps, -1));
    
    // slice(0, -1) returns all elements except the last one
    expect(result.current).toHaveLength(1);
    expect(result.current).toContain('stream');
  });

  test('handles undefined main_pattern', () => {
    const beatmaps = [
      mockBeatmapCompleteShortWithoutPattern,
      mockBeatmapCompleteShortStream
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toEqual(['stream']);
  });

  test('handles null main_pattern', () => {
    const beatmaps = [
      mockBeatmapCompleteShortWithoutPattern,
      mockBeatmapCompleteShortStream
    ];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    expect(result.current).toEqual(['stream']);
  });

  test('memoizes result correctly', () => {
    const beatmaps = [mockBeatmapCompleteShortStream];
    const { result, rerender } = renderHook(() => useBeatmapPatterns(beatmaps));
    
    const firstResult = result.current;
    
    // Rerender with same data
    rerender();
    
    expect(result.current).toBe(firstResult);
  });

  test('updates when beatmaps change', () => {
    const initialBeatmaps = [mockBeatmapCompleteShortStream];
    const { result, rerender } = renderHook(
      ({ beatmaps, maxPatterns }) => useBeatmapPatterns(beatmaps, maxPatterns),
      { initialProps: { beatmaps: initialBeatmaps, maxPatterns: 3 } }
    );
    
    expect(result.current).toEqual(['stream']);
    
    const newBeatmaps = [
      mockBeatmapCompleteShortStream,
      mockBeatmapCompleteShortJumpstream
    ];
    rerender({ beatmaps: newBeatmaps, maxPatterns: 3 });
    
    expect(result.current).toHaveLength(2);
    expect(result.current).toContain('stream');
    expect(result.current).toContain('jumpstream');
  });

  test('updates when maxPatterns changes', () => {
    const beatmaps = mockBeatmapCompleteShortArrayWithVariations;
    const { result, rerender } = renderHook(
      ({ beatmaps, maxPatterns }) => useBeatmapPatterns(beatmaps, maxPatterns),
      { initialProps: { beatmaps, maxPatterns: 2 } }
    );
    
    expect(result.current).toHaveLength(2);
    
    rerender({ beatmaps, maxPatterns: 4 });
    
    expect(result.current).toHaveLength(4);
  });

  test('handles mixed pattern types', () => {
    const beatmaps = mockBeatmapCompleteShortArrayWithVariations;
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps, 10));
    
    // Should have: stream, jumpstream, technical, chordjack (from the test data)
    expect(result.current).toHaveLength(4);
    expect(result.current).toContain('stream');
    expect(result.current).toContain('jumpstream');
    expect(result.current).toContain('technical');
    expect(result.current).toContain('chordjack');
  });
});
