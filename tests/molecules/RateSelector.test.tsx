import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RateSelector from '../../src/components/molecules/RateSelector/RateSelector';

describe('RateSelector Component', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    availableRates: [0.5, 0.75, 1.0, 1.25, 1.5],
    selectedRate: 1.0,
    onRateChange: () => {}
  };

  test('renders rate selector', () => {
    render(<RateSelector {...defaultProps} />);
    
    expect(screen.getByText('Rate')).toBeDefined();
  });

  test('renders all rate options', () => {
    render(<RateSelector {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeDefined();
    
    // Check that all options are present in the select
    expect(screen.getByText('0.5x')).toBeDefined();
    expect(screen.getByText('0.8x')).toBeDefined(); // 0.75 becomes 0.8
    expect(screen.getByText('1.0x')).toBeDefined();
    expect(screen.getByText('1.3x')).toBeDefined(); // 1.25 becomes 1.3
    expect(screen.getByText('1.5x')).toBeDefined();
  });

  test('highlights selected rate', () => {
    render(<RateSelector {...defaultProps} selectedRate={1.25} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveProperty('value', '1.25');
  });

  test('calls onRateChange when rate is selected', async () => {
    let selectedRate: number | undefined;
    const mockOnRateChange = (rate: number) => {
      selectedRate = rate;
    };
    const user = userEvent.setup();
    
    render(<RateSelector {...defaultProps} onRateChange={mockOnRateChange} />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '1.25');
    
    expect(selectedRate).toBe(1.25);
  });

  test('handles empty rates array', () => {
    render(<RateSelector {...defaultProps} availableRates={[]} />);
    
    expect(screen.getByText('Rate')).toBeDefined();
  });

  test('has correct CSS classes', () => {
    render(<RateSelector {...defaultProps} />);
    
    const container = screen.getByText('Rate').closest('div');
    expect(container?.className).toContain('flex');
    expect(container?.className).toContain('flex-col');
    expect(container?.className).toContain('gap-1');
  });

  test('select has correct styling', () => {
    render(<RateSelector {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('select');
    expect(select.className).toContain('select-bordered');
    expect(select.className).toContain('w-full');
  });
});
