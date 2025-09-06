import { expect, test, describe, afterEach } from '@rstest/core';
import { getBeatmapCount } from '../../../src/services/api/get_beatmap_count';

describe('getBeatmapCount Service', () => {
  afterEach(() => {
    // Cleanup if needed
  });

  test('is a function', () => {
    expect(typeof getBeatmapCount).toBe('function');
  });

  test('returns a promise', () => {
    const result = getBeatmapCount();
    expect(result).toBeInstanceOf(Promise);
  });

  test('function exists and is callable', () => {
    expect(getBeatmapCount).toBeDefined();
    expect(typeof getBeatmapCount).toBe('function');
  });
});
