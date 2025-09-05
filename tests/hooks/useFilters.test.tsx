import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, act } from '@testing-library/react';
import { useFilters } from '../../src/hooks/useFilters';
import type { Filters } from '../../src/types/beatmap/short';

describe('useFilters Hook', () => {
  afterEach(() => {
    // Cleanup localStorage
    localStorage.clear();
  });

  test('initializes with default filters', () => {
    const { result } = renderHook(() => useFilters());
    
    expect(result.current.filters).toEqual({
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    });
  });

  test('loads filters from localStorage on initialization', () => {
    const savedFilters = {
      page: 1,
      per_page: 100,
      search_term: 'test search',
      overall_min: 15,
      overall_max: 25,
    };
    
    localStorage.setItem('beatmap-filters', JSON.stringify(savedFilters));
    
    const { result } = renderHook(() => useFilters());
    
    expect(result.current.filters).toEqual({
      ...savedFilters,
      page: 1, // Should always start at page 1
    });
  });

  test('handles invalid localStorage data gracefully', () => {
    // Suppress console.error for this test since we're testing error handling
    const originalError = console.error;
    console.error = () => {}; // Suppress error logs
    
    localStorage.setItem('beatmap-filters', 'invalid json');
    
    const { result } = renderHook(() => useFilters());
    
    expect(result.current.filters).toEqual({
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    });
    
    // Restore console.error
    console.error = originalError;
  });

  test('updates filters and saves to localStorage', () => {
    const { result } = renderHook(() => useFilters());
    
    const newFilters: Filters = {
      page: 1,
      per_page: 100,
      search_term: 'new search',
      overall_min: 20,
      overall_max: 30,
    };
    
    act(() => {
      result.current.updateFilters(newFilters);
    });
    
    expect(result.current.filters).toEqual(newFilters);
    // Check that filters are saved to localStorage
    const savedFilters = localStorage.getItem('beatmap-filters');
    expect(savedFilters).not.toBeNull();
    if (savedFilters) {
      expect(JSON.parse(savedFilters)).toEqual({ ...newFilters, page: 1 });
    }
  });

  test('adjusts overall values when min > max', () => {
    const { result } = renderHook(() => useFilters());
    
    const filtersWithInvalidRange: Filters = {
      page: 1,
      per_page: 100,
      overall_min: 30,
      overall_max: 20, // max < min
    };
    
    act(() => {
      result.current.updateFilters(filtersWithInvalidRange);
    });
    
    expect(result.current.filters.overall_min).toBe(30);
    expect(result.current.filters.overall_max).toBe(30); // Should be adjusted to min
  });

  test('limits overall values to 50 maximum', () => {
    const { result } = renderHook(() => useFilters());
    
    const filtersWithHighValues: Filters = {
      page: 1,
      per_page: 100,
      overall_min: 90,
      overall_max: 100,
    };
    
    act(() => {
      result.current.updateFilters(filtersWithHighValues);
    });
    
    expect(result.current.filters.overall_min).toBe(50);
    expect(result.current.filters.overall_max).toBe(50);
  });

  test('adjusts pattern values when min > max', () => {
    const { result } = renderHook(() => useFilters());
    
    const filtersWithInvalidPatternRange: Filters = {
      page: 1,
      per_page: 100,
      selected_pattern: 'stream',
      pattern_min: 25,
      pattern_max: 15, // max < min
    };
    
    act(() => {
      result.current.updateFilters(filtersWithInvalidPatternRange);
    });
    
    expect(result.current.filters.pattern_min).toBe(25);
    expect(result.current.filters.pattern_max).toBe(25); // Should be adjusted to min
  });

  test('adjusts BPM values when min > max', () => {
    const { result } = renderHook(() => useFilters());
    
    const filtersWithInvalidBPMRange: Filters = {
      page: 1,
      per_page: 100,
      bpm_min: 200,
      bpm_max: 150, // max < min
    };
    
    act(() => {
      result.current.updateFilters(filtersWithInvalidBPMRange);
    });
    
    expect(result.current.filters.bpm_min).toBe(200);
    expect(result.current.filters.bpm_max).toBe(200); // Should be adjusted to min
  });

  test('adjusts time values when min > max', () => {
    const { result } = renderHook(() => useFilters());
    
    const filtersWithInvalidTimeRange: Filters = {
      page: 1,
      per_page: 100,
      total_time_min: 300,
      total_time_max: 200, // max < min
    };
    
    act(() => {
      result.current.updateFilters(filtersWithInvalidTimeRange);
    });
    
    expect(result.current.filters.total_time_min).toBe(300);
    expect(result.current.filters.total_time_max).toBe(300); // Should be adjusted to min
  });

  test('resets filters to default values', () => {
    const { result } = renderHook(() => useFilters());
    
    // First set some filters
    act(() => {
      result.current.updateFilters({
        page: 1,
        per_page: 100,
        search_term: 'test',
        overall_min: 20,
        overall_max: 30,
      });
    });
    
    // Then reset
    act(() => {
      result.current.resetFilters();
    });
    
    expect(result.current.filters).toEqual({
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    });
    // Check that localStorage is cleared
    expect(localStorage.getItem('beatmap-filters')).toBeNull();
  });

  test('handles multiple filter updates correctly', () => {
    const { result } = renderHook(() => useFilters());
    
    // Update search term
    act(() => {
      result.current.updateFilters({
        page: 1,
        per_page: 100,
        search_term: 'first search',
      });
    });
    
    expect(result.current.filters.search_term).toBe('first search');
    
    // Update overall range
    act(() => {
      result.current.updateFilters({
        ...result.current.filters,
        overall_min: 15,
        overall_max: 25,
      });
    });
    
    expect(result.current.filters.search_term).toBe('first search');
    expect(result.current.filters.overall_min).toBe(15);
    expect(result.current.filters.overall_max).toBe(25);
    
    // Update pattern
    act(() => {
      result.current.updateFilters({
        ...result.current.filters,
        selected_pattern: 'stream',
        pattern_min: 10,
        pattern_max: 20,
      });
    });
    
    expect(result.current.filters.search_term).toBe('first search');
    expect(result.current.filters.overall_min).toBe(15);
    expect(result.current.filters.overall_max).toBe(25);
    expect(result.current.filters.selected_pattern).toBe('stream');
    expect(result.current.filters.pattern_min).toBe(10);
    expect(result.current.filters.pattern_max).toBe(20);
  });

  test('preserves spaces in search term', () => {
    const { result } = renderHook(() => useFilters());
    
    const filtersWithSpaces: Filters = {
      page: 1,
      per_page: 100,
      search_term: 'hello world with spaces',
    };
    
    act(() => {
      result.current.updateFilters(filtersWithSpaces);
    });
    
    expect(result.current.filters.search_term).toBe('hello world with spaces');
  });

  test('handles empty search term as undefined', () => {
    const { result } = renderHook(() => useFilters());
    
    const filtersWithEmptySearch: Filters = {
      page: 1,
      per_page: 100,
      search_term: '',
    };
    
    act(() => {
      result.current.updateFilters(filtersWithEmptySearch);
    });
    
    expect(result.current.filters.search_term).toBe(undefined);
  });

  test('handles empty pattern as undefined', () => {
    const { result } = renderHook(() => useFilters());
    
    const filtersWithEmptyPattern: Filters = {
      page: 1,
      per_page: 100,
      selected_pattern: '',
    };
    
    act(() => {
      result.current.updateFilters(filtersWithEmptyPattern);
    });
    
    expect(result.current.filters.selected_pattern).toBe(undefined);
  });

  test('validates and rejects invalid filter data', () => {
    // Suppress console.error for this test since we're testing validation
    const originalError = console.error;
    console.error = () => {}; // Suppress error logs
    
    const { result } = renderHook(() => useFilters());
    
    const invalidFilters = {
      page: -1, // Invalid: should be >= 1
      per_page: 2000, // Invalid: should be <= 1000
      overall_min: -5, // Invalid: should be >= 0
    } as any;
    
    // Store current filters
    const originalFilters = result.current.filters;
    
    act(() => {
      result.current.updateFilters(invalidFilters);
    });
    
    // Filters should remain unchanged due to validation failure
    expect(result.current.filters).toEqual(originalFilters);
    
    // Restore console.error
    console.error = originalError;
  });

  test('handles localStorage errors gracefully', () => {
    // Suppress console.error for this test since we're testing error handling
    const originalError = console.error;
    console.error = () => {}; // Suppress error logs
    
    // Mock localStorage to throw error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('localStorage error');
    };
    
    const { result } = renderHook(() => useFilters());
    
    const newFilters: Filters = {
      page: 1,
      per_page: 100,
      search_term: 'test',
    };
    
    // Should not throw error
    expect(() => {
      act(() => {
        result.current.updateFilters(newFilters);
      });
    }).not.toThrow();
    
    // Filters should still be updated in memory
    expect(result.current.filters.search_term).toBe('test');
    
    // Restore original localStorage and console.error
    localStorage.setItem = originalSetItem;
    console.error = originalError;
  });
});
