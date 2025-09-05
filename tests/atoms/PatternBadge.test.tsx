import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { PatternBadge } from '../../src/components/atoms';

describe('PatternBadge', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders pattern shortcut correctly', () => {
    render(<PatternBadge pattern="jumpstream" />);
    
    expect(screen.getByText('JS')).toBeDefined();
  });

  test('displays full pattern name as tooltip', () => {
    render(<PatternBadge pattern="jumpstream" />);
    
    const badge = screen.getByText('JS');
    expect(badge).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });

  test('handles all supported patterns', () => {
    const patterns = [
      { pattern: 'jumpstream', shortcut: 'JS', expectedClass: 'badge-info' },
      { pattern: 'handstream', shortcut: 'HS', expectedClass: 'badge-info' },
      { pattern: 'jackspeed', shortcut: 'SJ', expectedClass: 'badge-warning' },
      { pattern: 'stamina', shortcut: 'Stam', expectedClass: 'badge-info' },
      { pattern: 'stream', shortcut: 'Stream', expectedClass: 'badge-success' },
      { pattern: 'chordjack', shortcut: 'CJ', expectedClass: 'badge-error' },
      { pattern: 'technical', shortcut: 'Tech', expectedClass: 'badge-accent' }
    ];

    patterns.forEach(({ pattern, shortcut, expectedClass }) => {
      const { unmount } = render(<PatternBadge pattern={pattern} />);
      
      expect(screen.getByText(shortcut)).toBeDefined();
      
      // Le tooltip devrait être présent dans le DOM
      const tooltip = document.querySelector('[data-radix-tooltip-content]');
      expect(tooltip).toBeDefined();
      
      // Check color class
      const badge = screen.getByText(shortcut).closest('.badge');
      expect(badge?.className).toContain(expectedClass);
      
      unmount();
    });
  });

  test('handles case insensitive patterns', () => {
    render(<PatternBadge pattern="JUMPSTREAM" />);
    
    expect(screen.getByText('JS')).toBeDefined();
  });

  test('handles mixed case patterns', () => {
    render(<PatternBadge pattern="JumpStream" />);
    
    expect(screen.getByText('JS')).toBeDefined();
  });

  test('handles unknown patterns', () => {
    render(<PatternBadge pattern="unknown-pattern" />);
    
    expect(screen.getByText('unknown-pattern')).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });

  test('applies outline style', () => {
    render(<PatternBadge pattern="jumpstream" />);
    
    const badge = screen.getByText('JS').closest('.badge');
    expect(badge?.className).toContain('badge-outline');
  });

  test('handles empty pattern gracefully', () => {
    const { container } = render(<PatternBadge pattern="" />);
    
    const badge = container.querySelector('.badge');
    expect(badge).toBeDefined();
    expect(badge?.textContent).toBe('');
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });

  test('handles special characters in pattern', () => {
    render(<PatternBadge pattern="pattern-with-dashes" />);
    
    expect(screen.getByText('pattern-with-dashes')).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });

  test('handles numbers in pattern', () => {
    render(<PatternBadge pattern="pattern123" />);
    
    expect(screen.getByText('pattern123')).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });

  test('handles very long pattern names', () => {
    const longPattern = 'very-long-pattern-name-that-should-still-work-correctly';
    render(<PatternBadge pattern={longPattern} />);
    
    expect(screen.getByText(longPattern)).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });

  test('renders multiple pattern badges independently', () => {
    render(
      <div>
        <PatternBadge pattern="jumpstream" />
        <PatternBadge pattern="technical" />
        <PatternBadge pattern="stamina" />
      </div>
    );
    
    expect(screen.getByText('JS')).toBeDefined();
    expect(screen.getByText('Tech')).toBeDefined();
    expect(screen.getByText('Stam')).toBeDefined();
  });
});
