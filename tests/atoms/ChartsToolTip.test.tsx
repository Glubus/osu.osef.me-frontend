import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import ChartsTooltip from '../../src/components/atoms/ChartsToolTip/ChartsToolTip';

describe('ChartsTooltip', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders tooltip when active and payload is provided', () => {
    const payload = [{ value: 'Test Value' }];
    const label = 'Test Label';
    
    render(<ChartsTooltip active={true} payload={payload} label={label} />);
    
    expect(screen.getByText('Test Label')).toBeDefined();
    expect(screen.getByText('Test Value')).toBeDefined();
  });

  test('renders null when not active', () => {
    const payload = [{ value: 'Test Value' }];
    const label = 'Test Label';
    
    const { container } = render(<ChartsTooltip active={false} payload={payload} label={label} />);
    
    expect(container.firstChild).toBeNull();
  });

  test('renders null when payload is undefined', () => {
    const label = 'Test Label';
    
    const { container } = render(<ChartsTooltip active={true} payload={undefined} label={label} />);
    
    expect(container.firstChild).toBeNull();
  });

  test('renders null when payload is empty array', () => {
    const payload: { value: string }[] = [];
    const label = 'Test Label';
    
    const { container } = render(<ChartsTooltip active={true} payload={payload} label={label} />);
    
    expect(container.firstChild).toBeNull();
  });

  test('renders null when active is undefined', () => {
    const payload = [{ value: 'Test Value' }];
    const label = 'Test Label';
    
    const { container } = render(<ChartsTooltip active={undefined} payload={payload} label={label} />);
    
    expect(container.firstChild).toBeNull();
  });

  test('displays correct CSS classes', () => {
    const payload = [{ value: 'Test Value' }];
    const label = 'Test Label';
    
    render(<ChartsTooltip active={true} payload={payload} label={label} />);
    
    const tooltip = screen.getByText('Test Label').closest('div');
    expect(tooltip?.className).toContain('bg-base-200');
    expect(tooltip?.className).toContain('p-3');
    expect(tooltip?.className).toContain('border');
    expect(tooltip?.className).toContain('border-base-300');
    expect(tooltip?.className).toContain('rounded-lg');
    expect(tooltip?.className).toContain('shadow-lg');
  });

  test('displays label with correct styling', () => {
    const payload = [{ value: 'Test Value' }];
    const label = 'Test Label';
    
    render(<ChartsTooltip active={true} payload={payload} label={label} />);
    
    const labelElement = screen.getByText('Test Label');
    expect(labelElement.className).toContain('font-semibold');
  });

  test('displays value with correct styling', () => {
    const payload = [{ value: 'Test Value' }];
    const label = 'Test Label';
    
    render(<ChartsTooltip active={true} payload={payload} label={label} />);
    
    const valueElement = screen.getByText('Test Value');
    expect(valueElement.className).toContain('text-primary');
  });

  test('handles multiple payload items but only displays first one', () => {
    const payload = [
      { value: 'First Value' },
      { value: 'Second Value' },
      { value: 'Third Value' }
    ];
    const label = 'Test Label';
    
    render(<ChartsTooltip active={true} payload={payload} label={label} />);
    
    expect(screen.getByText('First Value')).toBeDefined();
    expect(screen.queryByText('Second Value')).toBeNull();
    expect(screen.queryByText('Third Value')).toBeNull();
  });

  test('handles empty label', () => {
    const payload = [{ value: 'Test Value' }];
    const label = '';
    
    render(<ChartsTooltip active={true} payload={payload} label={label} />);
    
    const labelElement = document.querySelector('.font-semibold');
    expect(labelElement).toBeDefined();
    expect(labelElement?.textContent).toBe('');
    expect(screen.getByText('Test Value')).toBeDefined();
  });

  test('handles undefined label', () => {
    const payload = [{ value: 'Test Value' }];
    
    render(<ChartsTooltip active={true} payload={payload} label={undefined} />);
    
    expect(screen.getByText('Test Value')).toBeDefined();
  });

  test('handles empty value in payload', () => {
    const payload = [{ value: '' }];
    const label = 'Test Label';
    
    render(<ChartsTooltip active={true} payload={payload} label={label} />);
    
    expect(screen.getByText('Test Label')).toBeDefined();
    const valueElement = document.querySelector('.text-primary');
    expect(valueElement).toBeDefined();
    expect(valueElement?.textContent).toBe('');
  });

  test('handles special characters in label and value', () => {
    const payload = [{ value: 'Value with special chars: @#$%^&*()' }];
    const label = 'Label with special chars: @#$%^&*()';
    
    render(<ChartsTooltip active={true} payload={payload} label={label} />);
    
    expect(screen.getByText('Label with special chars: @#$%^&*()')).toBeDefined();
    expect(screen.getByText('Value with special chars: @#$%^&*()')).toBeDefined();
  });

  test('handles numeric values converted to string', () => {
    const payload = [{ value: '123.45' }];
    const label = 'Numeric Label';
    
    render(<ChartsTooltip active={true} payload={payload} label={label} />);
    
    expect(screen.getByText('Numeric Label')).toBeDefined();
    expect(screen.getByText('123.45')).toBeDefined();
  });

  test('handles long text content', () => {
    const longValue = 'This is a very long value that might cause layout issues in the tooltip component';
    const longLabel = 'This is a very long label that might cause layout issues in the tooltip component';
    const payload = [{ value: longValue }];
    
    render(<ChartsTooltip active={true} payload={payload} label={longLabel} />);
    
    expect(screen.getByText(longLabel)).toBeDefined();
    expect(screen.getByText(longValue)).toBeDefined();
  });

  test('renders with minimal props', () => {
    const payload = [{ value: 'Minimal' }];
    
    render(<ChartsTooltip active={true} payload={payload} />);
    
    expect(screen.getByText('Minimal')).toBeDefined();
  });

  test('handles payload with additional properties', () => {
    const payload = [{ value: 'Test Value', extra: 'extra data' } as any];
    const label = 'Test Label';
    
    render(<ChartsTooltip active={true} payload={payload} label={label} />);
    
    expect(screen.getByText('Test Label')).toBeDefined();
    expect(screen.getByText('Test Value')).toBeDefined();
  });

  test('component structure is correct', () => {
    const payload = [{ value: 'Test Value' }];
    const label = 'Test Label';
    
    render(<ChartsTooltip active={true} payload={payload} label={label} />);
    
    const tooltip = screen.getByText('Test Label').closest('div');
    expect(tooltip).toBeDefined();
    
    const labelElement = screen.getByText('Test Label');
    const valueElement = screen.getByText('Test Value');
    
    expect(tooltip?.contains(labelElement)).toBe(true);
    expect(tooltip?.contains(valueElement)).toBe(true);
  });
});
