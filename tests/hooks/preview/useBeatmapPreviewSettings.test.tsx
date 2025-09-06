import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, act } from '@testing-library/react';
import { useBeatmapPreviewSettings } from '../../../src/hooks/preview/useBeatmapPreviewSettings';

describe('useBeatmapPreviewSettings', () => {
  afterEach(() => {
    // Cleanup localStorage
    localStorage.clear();
  });

  test('returns default settings when no saved settings exist', () => {
    const { result } = renderHook(() => useBeatmapPreviewSettings());

    expect(result.current.settings).toEqual({
      scrollDirection: 'up',
      noteType: 'circle',
      noteColor: '#ff6b35',
      lnColor: '#ff6b35',
      progressBarPosition: 'bottom'
    });
  });

  test('loads saved settings from localStorage', () => {
    const savedSettings = {
      scrollDirection: 'down',
      noteType: 'rectangle',
      noteColor: '#00ff00',
      lnColor: '#0000ff',
      progressBarPosition: 'top'
    };
    
    localStorage.setItem('beatmapPreviewSettings', JSON.stringify(savedSettings));

    const { result } = renderHook(() => useBeatmapPreviewSettings());

    expect(result.current.settings).toEqual(savedSettings);
  });

  test('saves settings to localStorage when they change', () => {
    const { result } = renderHook(() => useBeatmapPreviewSettings());

    act(() => {
      result.current.updateSetting('scrollDirection', 'down');
    });

    const savedSettings = localStorage.getItem('beatmapPreviewSettings');
    expect(savedSettings).not.toBeNull();
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      expect(parsed.scrollDirection).toBe('down');
    }
  });

  test('updates individual settings correctly', () => {
    const { result } = renderHook(() => useBeatmapPreviewSettings());

    act(() => {
      result.current.updateSetting('noteType', 'diamond');
    });

    expect(result.current.settings.noteType).toBe('diamond');
    expect(result.current.settings.scrollDirection).toBe('up'); // Other settings unchanged
  });

  test('updates multiple settings correctly', () => {
    const { result } = renderHook(() => useBeatmapPreviewSettings());

    act(() => {
      result.current.updateSetting('noteType', 'rectangle');
    });

    act(() => {
      result.current.updateSetting('noteColor', '#ff0000');
    });

    expect(result.current.settings.noteType).toBe('rectangle');
    expect(result.current.settings.noteColor).toBe('#ff0000');
  });

  test('resets settings to default values', () => {
    const savedSettings = {
      scrollDirection: 'down',
      noteType: 'rectangle',
      noteColor: '#00ff00',
      lnColor: '#0000ff',
      progressBarPosition: 'top'
    };
    localStorage.setItem('beatmapPreviewSettings', JSON.stringify(savedSettings));

    const { result } = renderHook(() => useBeatmapPreviewSettings());

    // Verify initial loaded settings
    expect(result.current.settings.scrollDirection).toBe('down');

    act(() => {
      result.current.resetSettings();
    });

    expect(result.current.settings).toEqual({
      scrollDirection: 'up',
      noteType: 'circle',
      noteColor: '#ff6b35',
      lnColor: '#ff6b35',
      progressBarPosition: 'bottom'
    });
  });

  test('handles localStorage errors gracefully', () => {
    // Suppress console.error for this test since we're testing error handling
    const originalError = console.error;
    console.error = () => {}; // Suppress error logs

    // Mock localStorage to throw error
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = () => {
      throw new Error('localStorage error');
    };

    const { result } = renderHook(() => useBeatmapPreviewSettings());

    // Should fallback to default settings
    expect(result.current.settings).toEqual({
      scrollDirection: 'up',
      noteType: 'circle',
      noteColor: '#ff6b35',
      lnColor: '#ff6b35',
      progressBarPosition: 'bottom'
    });

    // Restore original localStorage and console.error
    localStorage.getItem = originalGetItem;
    console.error = originalError;
  });

  test('handles invalid JSON in localStorage', () => {
    localStorage.setItem('beatmapPreviewSettings', 'invalid json');

    const { result } = renderHook(() => useBeatmapPreviewSettings());

    // Should fallback to default settings
    expect(result.current.settings).toEqual({
      scrollDirection: 'up',
      noteType: 'circle',
      noteColor: '#ff6b35',
      lnColor: '#ff6b35',
      progressBarPosition: 'bottom'
    });
  });

  test('saves settings on every change', () => {
    const { result } = renderHook(() => useBeatmapPreviewSettings());

    act(() => {
      result.current.updateSetting('scrollDirection', 'down');
    });

    act(() => {
      result.current.updateSetting('noteType', 'diamond');
    });

    // Should have saved settings twice
    const savedSettings = localStorage.getItem('beatmapPreviewSettings');
    expect(savedSettings).not.toBeNull();
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      expect(parsed.noteType).toBe('diamond');
    }
  });

  test('only includes valid note types', () => {
    const { result } = renderHook(() => useBeatmapPreviewSettings());

    // Test valid note types
    act(() => {
      result.current.updateSetting('noteType', 'circle');
    });
    expect(result.current.settings.noteType).toBe('circle');

    act(() => {
      result.current.updateSetting('noteType', 'rectangle');
    });
    expect(result.current.settings.noteType).toBe('rectangle');

    act(() => {
      result.current.updateSetting('noteType', 'diamond');
    });
    expect(result.current.settings.noteType).toBe('diamond');
  });

  test('only includes valid scroll directions', () => {
    const { result } = renderHook(() => useBeatmapPreviewSettings());

    act(() => {
      result.current.updateSetting('scrollDirection', 'up');
    });
    expect(result.current.settings.scrollDirection).toBe('up');

    act(() => {
      result.current.updateSetting('scrollDirection', 'down');
    });
    expect(result.current.settings.scrollDirection).toBe('down');
  });

  test('only includes valid progress bar positions', () => {
    const { result } = renderHook(() => useBeatmapPreviewSettings());

    act(() => {
      result.current.updateSetting('progressBarPosition', 'top');
    });
    expect(result.current.settings.progressBarPosition).toBe('top');

    act(() => {
      result.current.updateSetting('progressBarPosition', 'bottom');
    });
    expect(result.current.settings.progressBarPosition).toBe('bottom');
  });
});