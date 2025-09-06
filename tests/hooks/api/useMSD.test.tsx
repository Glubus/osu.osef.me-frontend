import { expect, test, describe, afterEach } from '@rstest/core';
import { renderHook, cleanup } from '@testing-library/react';
import { useMSD } from '../../../src/hooks/api/useMSD';
import { mockMSDExtendedMultipleRates } from '../../data';
import { MSDExtended } from '../../../src/types/beatmap/extended';

describe('useMSD Hook', () => {
  afterEach(() => {
    cleanup();
  });

  const mockMSDRates = mockMSDExtendedMultipleRates;

  test('returns default values when msdRates is undefined', () => {
    const { result } = renderHook(() => useMSD(undefined, 1.0));
    
    expect(result.current.currentMSD).toBeNull();
    expect(result.current.availableRates).toEqual([]);
    expect(result.current.radarChartData).toEqual([]);
    expect(result.current.chartPrimaryColor).toBe('#3b82f6'); // COLOR_HEX.blue
  });

  test('returns default values when msdRates is empty array', () => {
    const { result } = renderHook(() => useMSD([], 1.0));
    
    expect(result.current.currentMSD).toBeNull();
    expect(result.current.availableRates).toEqual([]);
    expect(result.current.radarChartData).toEqual([]);
    expect(result.current.chartPrimaryColor).toBe('#3b82f6');
  });

  test('returns available rates sorted in ascending order', () => {
    const { result } = renderHook(() => useMSD(mockMSDRates, 1.0));
    
    expect(result.current.availableRates).toEqual([0.5, 1.0, 1.5]);
  });

  test('deduplicates available rates', () => {
    const ratesWithDuplicates: MSDExtended[] = [
      { ...mockMSDRates[0], rate: 1.0 },
      { ...mockMSDRates[1], rate: 1.0 }, // Duplicate
      { ...mockMSDRates[2], rate: 1.25 }
    ];
    
    const { result } = renderHook(() => useMSD(ratesWithDuplicates, 1.0));
    
    expect(result.current.availableRates).toEqual([1.0, 1.25]);
  });

  test('returns current MSD for selected rate', () => {
    const { result } = renderHook(() => useMSD(mockMSDRates, 1.0));
    
    expect(result.current.currentMSD).toEqual(mockMSDRates[1]);
  });

  test('returns first MSD when selected rate is not found', () => {
    const { result } = renderHook(() => useMSD(mockMSDRates, 2.0));
    
    expect(result.current.currentMSD).toEqual(mockMSDRates[0]);
  });

  test('generates radar chart data correctly', () => {
    const { result } = renderHook(() => useMSD(mockMSDRates, 1.0));
    
    expect(result.current.radarChartData).toHaveLength(7); // RADAR_METRICS length (excludes overall)
    expect(result.current.radarChartData[0]).toEqual({
      name: 'Stream',
      value: 15.0,
      color: expect.any(String)
    });
    expect(result.current.radarChartData[1]).toEqual({
      name: 'Jumpstream',
      value: 18.0,
      color: expect.any(String)
    });
  });

  test('handles missing MSD values gracefully', () => {
    const incompleteMSD: MSDExtended[] = [
      {
        rate: 1.0,
        overall: 2.5,
        stream: undefined as any,
        jumpstream: 2.0,
        handstream: undefined as any,
        stamina: 2.8,
        jackspeed: undefined as any,
        chordjack: 1.8,
        technical: 2.2
      }
    ];
    
    const { result } = renderHook(() => useMSD(incompleteMSD, 1.0));
    
    expect(result.current.radarChartData).toHaveLength(7);
    // Values should be 0 for undefined fields
    expect(result.current.radarChartData.find(d => d.name === 'Stream')?.value).toBe(0);
  });

  test('returns correct chart primary color based on overall rating', () => {
    const { result } = renderHook(() => useMSD(mockMSDRates, 1.0));
    
    // Overall is 2.5, should return a color based on that rating
    expect(result.current.chartPrimaryColor).toBeDefined();
    expect(typeof result.current.chartPrimaryColor).toBe('string');
    expect(result.current.chartPrimaryColor).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  test('memoizes results correctly', () => {
    const { result, rerender } = renderHook(
      ({ rates, rate }) => useMSD(rates, rate),
      { initialProps: { rates: mockMSDRates, rate: 1.0 } }
    );
    
    const firstResult = result.current;
    
    // Rerender with same props
    rerender({ rates: mockMSDRates, rate: 1.0 });
    
    // Results should be the same (memoized)
    expect(result.current.availableRates).toBe(firstResult.availableRates);
    expect(result.current.currentMSD).toBe(firstResult.currentMSD);
    expect(result.current.radarChartData).toBe(firstResult.radarChartData);
    expect(result.current.chartPrimaryColor).toBe(firstResult.chartPrimaryColor);
  });

  test('updates when selected rate changes', () => {
    const { result, rerender } = renderHook(
      ({ rates, rate }) => useMSD(rates, rate),
      { initialProps: { rates: mockMSDRates, rate: 1.0 } }
    );
    
    expect(result.current.currentMSD).toEqual(mockMSDRates[1]);
    
    // Change selected rate
    rerender({ rates: mockMSDRates, rate: 1.5 });
    
    expect(result.current.currentMSD).toEqual(mockMSDRates[2]);
  });

  test('updates when msdRates changes', () => {
    const { result, rerender } = renderHook(
      ({ rates, rate }) => useMSD(rates, rate),
      { initialProps: { rates: mockMSDRates, rate: 1.0 } }
    );
    
    const newMSDRates = [mockMSDRates[0]];
    rerender({ rates: newMSDRates, rate: 1.0 });
    
    expect(result.current.availableRates).toEqual([0.5]);
    expect(result.current.currentMSD).toEqual(mockMSDRates[0]);
  });
});
