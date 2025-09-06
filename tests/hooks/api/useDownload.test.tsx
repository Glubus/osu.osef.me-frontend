import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, cleanup } from '@testing-library/react';
import { useDownload } from '../../../src/hooks/api/useDownload';

describe('useDownload Hook', () => {
  afterEach(() => {
    cleanup();
  });

  test('returns downloadBeatmap function', () => {
    const { result } = renderHook(() => useDownload());
    
    expect(result.current.downloadBeatmap).toBeDefined();
    expect(typeof result.current.downloadBeatmap).toBe('function');
  });

  test('downloadBeatmap does nothing when beatmapsetId is undefined', () => {
    const { result } = renderHook(() => useDownload());
    
    // Mock window.open
    const mockOpen = () => {};
    const originalOpen = window.open;
    window.open = mockOpen;
    
    result.current.downloadBeatmap(undefined);
    
    // Restore original
    window.open = originalOpen;
  });

  test('downloadBeatmap does nothing when beatmapsetId is null', () => {
    const { result } = renderHook(() => useDownload());
    
    // Mock window.open
    const mockOpen = () => {};
    const originalOpen = window.open;
    window.open = mockOpen;
    
    result.current.downloadBeatmap(null as any);
    
    // Restore original
    window.open = originalOpen;
  });

  test('downloadBeatmap opens correct URL when beatmapsetId is provided', () => {
    const { result } = renderHook(() => useDownload());
    
    // Mock window.open
    let openedUrl = '';
    const mockOpen = (url: string) => {
      openedUrl = url;
    };
    const originalOpen = window.open;
    window.open = mockOpen;
    
    const beatmapsetId = 12345;
    result.current.downloadBeatmap(beatmapsetId);
    
    expect(openedUrl).toBe('https://catboy.best/d/12345');
    
    // Restore original
    window.open = originalOpen;
  });

  test('downloadBeatmap works with different beatmapsetId values', () => {
    const { result } = renderHook(() => useDownload());
    
    // Mock window.open
    const openedUrls: string[] = [];
    const mockOpen = (url: string) => {
      openedUrls.push(url);
    };
    const originalOpen = window.open;
    window.open = mockOpen;
    
    const testCases = [1, 999, 123456, 999999];
    
    testCases.forEach(beatmapsetId => {
      result.current.downloadBeatmap(beatmapsetId);
    });
    
    expect(openedUrls).toHaveLength(testCases.length);
    expect(openedUrls[0]).toBe('https://catboy.best/d/1');
    expect(openedUrls[1]).toBe('https://catboy.best/d/999');
    expect(openedUrls[2]).toBe('https://catboy.best/d/123456');
    expect(openedUrls[3]).toBe('https://catboy.best/d/999999');
    
    // Restore original
    window.open = originalOpen;
  });

  test('downloadBeatmap handles zero beatmapsetId', () => {
    const { result } = renderHook(() => useDownload());
    
    // Mock window.open
    let openedUrl = '';
    const mockOpen = (url: string) => {
      openedUrl = url;
    };
    const originalOpen = window.open;
    window.open = mockOpen;
    
    result.current.downloadBeatmap(0);
    
    // Zero is falsy, so it should not open
    expect(openedUrl).toBe('');
    
    // Restore original
    window.open = originalOpen;
  });
});
