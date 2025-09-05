import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import DifficultyRange from '../../src/components/atoms/DifficultyRange/DifficultyRange';

describe('DifficultyRange', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders difficulty range with correct format', () => {
    render(<DifficultyRange minRating={2.5} maxRating={4.8} />);
    
    expect(screen.getByText('2.50 - 4.80')).toBeDefined();
  });

  test('handles same min and max rating', () => {
    render(<DifficultyRange minRating={3.0} maxRating={3.0} />);
    
    expect(screen.getByText('3.00 - 3.00')).toBeDefined();
  });

  test('handles zero ratings', () => {
    render(<DifficultyRange minRating={0} maxRating={0} />);
    
    expect(screen.getByText('0.00 - 0.00')).toBeDefined();
  });

  test('handles high ratings', () => {
    render(<DifficultyRange minRating={8.5} maxRating={9.9} />);
    
    expect(screen.getByText('8.50 - 9.90')).toBeDefined();
  });

  test('handles decimal precision correctly', () => {
    render(<DifficultyRange minRating={2.123456} maxRating={4.987654} />);
    
    expect(screen.getByText('2.12 - 4.99')).toBeDefined();
  });

  test('handles negative ratings', () => {
    render(<DifficultyRange minRating={-1.5} maxRating={2.0} />);
    
    expect(screen.getByText('-1.50 - 2.00')).toBeDefined();
  });

  test('applies correct styling classes', () => {
    render(<DifficultyRange minRating={3.0} maxRating={5.0} />);
    
    const rangeElement = screen.getByText('3.00 - 5.00');
    expect(rangeElement.className).toContain('text-xs');
    expect(rangeElement.className).toContain('text-white');
    expect(rangeElement.className).toContain('bg-black/50');
    expect(rangeElement.className).toContain('px-2');
    expect(rangeElement.className).toContain('py-1');
    expect(rangeElement.className).toContain('rounded');
  });

  test('accepts custom className', () => {
    render(<DifficultyRange minRating={2.0} maxRating={4.0} className="custom-class" />);
    
    const rangeElement = screen.getByText('2.00 - 4.00');
    expect(rangeElement.className).toContain('custom-class');
  });

  test('handles very small differences', () => {
    render(<DifficultyRange minRating={4.999} maxRating={5.001} />);
    
    expect(screen.getByText('5.00 - 5.00')).toBeDefined();
  });

  test('handles large differences', () => {
    render(<DifficultyRange minRating={1.0} maxRating={10.0} />);
    
    expect(screen.getByText('1.00 - 10.00')).toBeDefined();
  });

  test('renders without crashing with undefined className', () => {
    render(<DifficultyRange minRating={3.0} maxRating={5.0} className={undefined} />);
    
    expect(screen.getByText('3.00 - 5.00')).toBeDefined();
  });
});
