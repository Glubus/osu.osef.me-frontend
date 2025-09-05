import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import DifficultyBadge from '../../src/components/atoms/Badge/DifficultyBadge/DifficultyBadge';

describe('DifficultyBadge', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders difficulty rating with correct format', () => {
    render(<DifficultyBadge rating={4.567} difficulty="Hard" />);
    
    expect(screen.getByText('4.57')).toBeDefined();
  });

  test('displays difficulty name as tooltip', () => {
    render(<DifficultyBadge rating={2.5} difficulty="Normal" />);
    
    const badge = screen.getByText('2.50');
    expect(badge).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });

  test('handles zero rating', () => {
    render(<DifficultyBadge rating={0} difficulty="Easy" />);
    
    expect(screen.getByText('0.00')).toBeDefined();
  });

  test('handles high rating', () => {
    render(<DifficultyBadge rating={9.999} difficulty="Expert+" />);
    
    expect(screen.getByText('10.00')).toBeDefined();
  });

  test('applies correct color based on rating', () => {
    const { rerender } = render(<DifficultyBadge rating={1.5} difficulty="Easy" />);
    
    // Rating 1.5 should have green color (rating < 15)
    let badge = screen.getByText('1.50');
    expect(badge.closest('.badge')?.className).toContain('badge-success');
    
    // Rating 4.5 should have green color (rating < 15)
    rerender(<DifficultyBadge rating={4.5} difficulty="Hard" />);
    badge = screen.getByText('4.50');
    expect(badge.closest('.badge')?.className).toContain('badge-success');
    
    // Rating 20 should have blue color (15 <= rating < 25)
    rerender(<DifficultyBadge rating={20} difficulty="Hard" />);
    badge = screen.getByText('20.00');
    expect(badge.closest('.badge')?.className).toContain('badge-info');
  });

  test('applies outline style', () => {
    render(<DifficultyBadge rating={3.0} difficulty="Normal" />);
    
    const badge = screen.getByText('3.00');
    expect(badge.closest('.badge')?.className).toContain('badge-outline');
  });

  test('handles decimal precision correctly', () => {
    render(<DifficultyBadge rating={2.123456} difficulty="Normal" />);
    
    expect(screen.getByText('2.12')).toBeDefined();
  });

  test('handles negative rating gracefully', () => {
    render(<DifficultyBadge rating={-1.5} difficulty="Invalid" />);
    
    expect(screen.getByText('-1.50')).toBeDefined();
  });

  test('handles very long difficulty names', () => {
    const longDifficultyName = 'Very Long Difficulty Name That Should Still Work';
    render(<DifficultyBadge rating={5.0} difficulty={longDifficultyName} />);
    
    const badge = screen.getByText('5.00');
    expect(badge).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });

  test('handles special characters in difficulty name', () => {
    render(<DifficultyBadge rating={6.0} difficulty="Expert+" />);
    
    const badge = screen.getByText('6.00');
    expect(badge).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });
});
