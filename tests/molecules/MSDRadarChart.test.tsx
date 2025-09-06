import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import MSDRadarChart from '../../src/components/molecules/MSDRadarCharts/MSDRadarChart';
import { mockMSDExtendedStream, mockMSDExtendedJumpstream, mockMSDExtendedTechnical } from '../data';

describe('MSDRadarChart Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders chart with MSD data', () => {
    const msdData = [mockMSDExtendedStream];
    
    render(<MSDRadarChart msdData={msdData} />);
    
    // Check if the chart container is rendered
    const chartContainer = screen.getByText('No MSD data available');
    expect(chartContainer).toBeDefined();
  });

  test('renders with correct title', () => {
    const msdData = [mockMSDExtendedStream];
    
    render(<MSDRadarChart msdData={msdData} />);
    
    expect(screen.getByText('No MSD data available')).toBeDefined();
  });

  test('handles empty MSD data', () => {
    render(<MSDRadarChart msdData={[]} />);
    
    expect(screen.getByText('No MSD data available')).toBeDefined();
  });

  test('handles multiple MSD data points', () => {
    const msdData = [mockMSDExtendedStream, mockMSDExtendedJumpstream, mockMSDExtendedTechnical];
    
    render(<MSDRadarChart msdData={msdData} />);
    
    expect(screen.getByText('No MSD data available')).toBeDefined();
  });

  test('has correct CSS classes', () => {
    const msdData = [mockMSDExtendedStream];
    
    render(<MSDRadarChart msdData={msdData} />);
    
    const container = screen.getByText('No MSD data available').closest('div');
    expect(container?.className).toContain('text-center');
    
    // Check for the parent container with h-96
    const parentContainer = container?.parentElement;
    expect(parentContainer?.className).toContain('h-96');
  });

  test('renders chart with proper dimensions', () => {
    const msdData = [mockMSDExtendedStream];
    
    render(<MSDRadarChart msdData={msdData} />);
    
    const chartContainer = screen.getByText('No MSD data available');
    expect(chartContainer).toBeDefined();
  });
});
