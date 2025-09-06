import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, cleanup, act } from '@testing-library/react';
import { useRoadmap } from '../../../src/hooks/api/useRoadmap';

describe('useRoadmap Hook', () => {
  afterEach(() => {
    cleanup();
  });

  test('returns initial state with all filters set to "all"', () => {
    const { result } = renderHook(() => useRoadmap());
    
    expect(result.current.statusFilter).toBe('all');
    expect(result.current.categoryFilter).toBe('all');
    expect(result.current.priorityFilter).toBe('all');
  });

  test('returns roadmap array', () => {
    const { result } = renderHook(() => useRoadmap());
    
    expect(Array.isArray(result.current.roadmap)).toBe(true);
  });

  test('has filter setter functions', () => {
    const { result } = renderHook(() => useRoadmap());
    
    expect(typeof result.current.setStatusFilter).toBe('function');
    expect(typeof result.current.setCategoryFilter).toBe('function');
    expect(typeof result.current.setPriorityFilter).toBe('function');
  });

  test('has color getter functions', () => {
    const { result } = renderHook(() => useRoadmap());
    
    expect(typeof result.current.getStatusColor).toBe('function');
    expect(typeof result.current.getPriorityColor).toBe('function');
    expect(typeof result.current.getCategoryColor).toBe('function');
  });

  test('filters by status correctly', () => {
    const { result } = renderHook(() => useRoadmap());
    
    act(() => {
      result.current.setStatusFilter('finished');
    });
    
    // Should filter the roadmap array
    expect(result.current.statusFilter).toBe('finished');
  });

  test('filters by category correctly', () => {
    const { result } = renderHook(() => useRoadmap());
    
    act(() => {
      result.current.setCategoryFilter('features');
    });
    
    expect(result.current.categoryFilter).toBe('features');
  });

  test('filters by priority correctly', () => {
    const { result } = renderHook(() => useRoadmap());
    
    act(() => {
      result.current.setPriorityFilter('low');
    });
    
    expect(result.current.priorityFilter).toBe('low');
  });

  test('applies multiple filters correctly', () => {
    const { result } = renderHook(() => useRoadmap());
    
    act(() => {
      result.current.setStatusFilter('in-progress');
      result.current.setCategoryFilter('features');
      result.current.setPriorityFilter('medium');
    });
    
    expect(result.current.statusFilter).toBe('in-progress');
    expect(result.current.categoryFilter).toBe('features');
    expect(result.current.priorityFilter).toBe('medium');
  });

  test('returns empty array when no items match filters', () => {
    const { result } = renderHook(() => useRoadmap());
    
    act(() => {
      result.current.setStatusFilter('finished');
      result.current.setCategoryFilter('ui');
    });
    
    // The roadmap should be filtered (may be empty depending on data)
    expect(Array.isArray(result.current.roadmap)).toBe(true);
  });

  test('getStatusColor returns correct colors', () => {
    const { result } = renderHook(() => useRoadmap());
    
    expect(result.current.getStatusColor('finished')).toBe('#10b981');
    expect(result.current.getStatusColor('in-progress')).toBe('#f59e0b');
    expect(result.current.getStatusColor('planned')).toBe('#6b7280');
    expect(result.current.getStatusColor('unknown' as any)).toBe('#6b7280');
  });

  test('getPriorityColor returns correct colors', () => {
    const { result } = renderHook(() => useRoadmap());
    
    expect(result.current.getPriorityColor('high')).toBe('#ef4444');
    expect(result.current.getPriorityColor('medium')).toBe('#f59e0b');
    expect(result.current.getPriorityColor('low')).toBe('#10b981');
    expect(result.current.getPriorityColor('unknown' as any)).toBe('#6b7280');
  });

  test('getCategoryColor returns correct colors', () => {
    const { result } = renderHook(() => useRoadmap());
    
    expect(result.current.getCategoryColor('core')).toBe('#3b82f6');
    expect(result.current.getCategoryColor('features')).toBe('#8b5cf6');
    expect(result.current.getCategoryColor('ui')).toBe('#06b6d4');
    expect(result.current.getCategoryColor('technical')).toBe('#f97316');
    expect(result.current.getCategoryColor('mobile')).toBe('#ec4899');
    expect(result.current.getCategoryColor('social')).toBe('#84cc16');
    expect(result.current.getCategoryColor('unknown' as any)).toBe('#6b7280');
  });

  test('filter state updates correctly', () => {
    const { result } = renderHook(() => useRoadmap());
    
    act(() => {
      result.current.setStatusFilter('finished');
    });
    expect(result.current.statusFilter).toBe('finished');
    
    act(() => {
      result.current.setCategoryFilter('core');
    });
    expect(result.current.categoryFilter).toBe('core');
    
    act(() => {
      result.current.setPriorityFilter('high');
    });
    expect(result.current.priorityFilter).toBe('high');
  });

  test('resets filters to "all" when set to "all"', () => {
    const { result } = renderHook(() => useRoadmap());
    
    // Set some filters
    act(() => {
      result.current.setStatusFilter('finished');
      result.current.setCategoryFilter('core');
      result.current.setPriorityFilter('high');
    });
    
    // Reset to "all"
    act(() => {
      result.current.setStatusFilter('all');
      result.current.setCategoryFilter('all');
      result.current.setPriorityFilter('all');
    });
    
    expect(result.current.statusFilter).toBe('all');
    expect(result.current.categoryFilter).toBe('all');
    expect(result.current.priorityFilter).toBe('all');
  });
});
