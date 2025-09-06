import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, act } from '@testing-library/react';
import { useFilterSection } from '../../../src/hooks/ui/FilterSection/useFilterSection';
import type { Filters } from '../../../src/types/beatmap/short';

describe('useFilterSection Hook', () => {
  afterEach(() => {
    // Cleanup if needed
  });

  test('initializes with updateFilter function', () => {
    let callCount = 0;
    const mockOnFiltersChange = () => {
      callCount++;
    };
    const initialFilters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    const { result } = renderHook(() =>
      useFilterSection({
        filters: initialFilters,
        onFiltersChange: mockOnFiltersChange,
      })
    );

    expect(result.current.updateFilter).toBeDefined();
    expect(typeof result.current.updateFilter).toBe('function');
  });

  test('calls onFiltersChange when updateFilter is called', () => {
    let lastCalledFilters: Filters | null = null;
    const mockOnFiltersChange = (filters: Filters) => {
      lastCalledFilters = filters;
    };
    const initialFilters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    const { result } = renderHook(() =>
      useFilterSection({
        filters: initialFilters,
        onFiltersChange: mockOnFiltersChange,
      })
    );

    act(() => {
      result.current.updateFilter('search_term', 'test search');
    });

    expect(lastCalledFilters).toBeDefined();
    expect(lastCalledFilters?.search_term).toBe('test search');
  });

  test('updates search term correctly', () => {
    let lastCalledFilters: Filters | null = null;
    const mockOnFiltersChange = (filters: Filters) => {
      lastCalledFilters = filters;
    };
    const initialFilters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    const { result } = renderHook(() =>
      useFilterSection({
        filters: initialFilters,
        onFiltersChange: mockOnFiltersChange,
      })
    );

    act(() => {
      result.current.updateFilter('search_term', 'new search');
    });

    expect(lastCalledFilters?.search_term).toBe('new search');
  });

  test('updates pattern correctly', () => {
    let lastCalledFilters: Filters | null = null;
    const mockOnFiltersChange = (filters: Filters) => {
      lastCalledFilters = filters;
    };
    const initialFilters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    const { result } = renderHook(() =>
      useFilterSection({
        filters: initialFilters,
        onFiltersChange: mockOnFiltersChange,
      })
    );

    act(() => {
      result.current.updateFilter('selected_pattern', 'stream');
    });

    expect(lastCalledFilters?.selected_pattern).toBe('stream');
  });

  test('updates numeric values correctly', () => {
    let lastCalledFilters: Filters | null = null;
    const mockOnFiltersChange = (filters: Filters) => {
      lastCalledFilters = filters;
    };
    const initialFilters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    const { result } = renderHook(() =>
      useFilterSection({
        filters: initialFilters,
        onFiltersChange: mockOnFiltersChange,
      })
    );

    act(() => {
      result.current.updateFilter('overall_min', 15);
    });

    expect(lastCalledFilters?.overall_min).toBe(15);
  });

  test('handles undefined values correctly', () => {
    let lastCalledFilters: Filters | null = null;
    const mockOnFiltersChange = (filters: Filters) => {
      lastCalledFilters = filters;
    };
    const initialFilters: Filters = {
      page: 1,
      per_page: 100,
      search_term: 'existing search',
      selected_pattern: 'stream',
    };

    const { result } = renderHook(() =>
      useFilterSection({
        filters: initialFilters,
        onFiltersChange: mockOnFiltersChange,
      })
    );

    act(() => {
      result.current.updateFilter('search_term', undefined);
    });

    expect(lastCalledFilters?.search_term).toBe(undefined);
  });

  test('preserves other filter values when updating one', () => {
    let lastCalledFilters: Filters | null = null;
    const mockOnFiltersChange = (filters: Filters) => {
      lastCalledFilters = filters;
    };
    const initialFilters: Filters = {
      page: 1,
      per_page: 100,
      search_term: 'existing search',
      selected_pattern: 'stream',
      overall_min: 10,
    };

    const { result } = renderHook(() =>
      useFilterSection({
        filters: initialFilters,
        onFiltersChange: mockOnFiltersChange,
      })
    );

    act(() => {
      result.current.updateFilter('overall_max', 20);
    });

    expect(lastCalledFilters?.search_term).toBe('existing search');
    expect(lastCalledFilters?.selected_pattern).toBe('stream');
    expect(lastCalledFilters?.overall_min).toBe(10);
    expect(lastCalledFilters?.overall_max).toBe(20);
  });
});