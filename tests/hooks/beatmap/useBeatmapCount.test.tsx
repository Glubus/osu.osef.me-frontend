import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, cleanup } from '@testing-library/react';
import { useBeatmapCount } from '../../../src/hooks/beatmap/useBeatmapCount';

describe('useBeatmapCount Hook', () => {
  afterEach(() => {
    cleanup();
  });

  test('returns initial loading state', () => {
    const { result } = renderHook(() => useBeatmapCount());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  test('returns refetch function', () => {
    const { result } = renderHook(() => useBeatmapCount());
    
    expect(result.current.refetch).toBeDefined();
    expect(typeof result.current.refetch).toBe('function');
  });

  test('has correct return type structure', () => {
    const { result } = renderHook(() => useBeatmapCount());
    
    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('refetch');
  });

  test('loading state is boolean', () => {
    const { result } = renderHook(() => useBeatmapCount());
    
    expect(typeof result.current.loading).toBe('boolean');
  });

  test('error state is string or null', () => {
    const { result } = renderHook(() => useBeatmapCount());
    
    expect(typeof result.current.error === 'string' || result.current.error === null).toBe(true);
  });
});
