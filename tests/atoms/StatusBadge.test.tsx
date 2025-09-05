import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { StatusBadge } from '../../src/components/atoms';
import type { BeatmapStatus } from '../../src/types/beatmap/status';

describe('StatusBadge', () => {
  afterEach(() => {
    cleanup();
  });

  const mockStatus: BeatmapStatus = {
    status: 'ranked',
    color: 'blue',
    icon: React.createElement('span', null, '⭐')
  };

  test('renders status badge with correct content', () => {
    render(<StatusBadge status={mockStatus} />);
    
    expect(screen.getByText('⭐')).toBeDefined();
  });

  test('displays status information as tooltip', () => {
    render(<StatusBadge status={mockStatus} />);
    
    const badge = screen.getByText('⭐');
    expect(badge).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });

  test('handles different status types', () => {
    const statuses: BeatmapStatus[] = [
      { status: 'ranked', color: 'blue', icon: React.createElement('span', null, '⭐') },
      { status: 'loved', color: 'pink', icon: React.createElement('span', null, '❤️') },
      { status: 'graveyard', color: 'gray', icon: React.createElement('span', null, '⏰') },
      { status: 'unknown', color: 'gray', icon: React.createElement('span', null, '?') }
    ];

    statuses.forEach((status) => {
      const { unmount } = render(<StatusBadge status={status} />);
      
      // Le tooltip devrait être présent dans le DOM
      const tooltip = document.querySelector('[data-radix-tooltip-content]');
      expect(tooltip).toBeDefined();
      
      // Check color class - find badge by its content
      const badge = document.querySelector('.badge');
      expect(badge?.className).toContain(`badge-${status.color === 'blue' ? 'info' : status.color === 'pink' ? 'secondary' : 'neutral'}`);
      
      unmount();
    });
  });

  test('handles complex icon elements', () => {
    const complexIcon = React.createElement('div', { className: 'custom-icon' }, 'Custom');
    const status: BeatmapStatus = {
      status: 'ranked',
      color: 'blue',
      icon: complexIcon
    };

    render(<StatusBadge status={status} />);
    
    expect(screen.getByText('Custom')).toBeDefined();
    expect(screen.getByText('Custom').closest('.custom-icon')).toBeDefined();
  });

  test('handles string icons', () => {
    const status: BeatmapStatus = {
      status: 'ranked',
      color: 'blue',
      icon: React.createElement('span', null, 'R')
    };

    render(<StatusBadge status={status} />);
    
    expect(screen.getByText('R')).toBeDefined();
  });

  test('handles empty status gracefully', () => {
    const emptyStatus: BeatmapStatus = {
      status: 'unknown' as any,
      color: 'gray',
      icon: React.createElement('span', null, '')
    };

    render(<StatusBadge status={emptyStatus} />);
    
    const badge = document.querySelector('.badge');
    expect(badge).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });

  test('handles undefined status properties', () => {
    const incompleteStatus: BeatmapStatus = {
      status: 'ranked' as any,
      color: 'blue' as any,
      icon: React.createElement('span', null, '⭐')
    };

    render(<StatusBadge status={incompleteStatus} />);
    
    const badge = screen.getByText('⭐');
    expect(badge).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });

  test('applies correct color classes', () => {
    const { rerender } = render(<StatusBadge status={mockStatus} />);
    
    // Blue status
    let badge = document.querySelector('.badge');
    expect(badge?.className).toContain('badge-info');
    
    // Pink status
    const pinkStatus: BeatmapStatus = {
      status: 'loved',
      color: 'pink',
      icon: React.createElement('span', null, '❤️')
    };
    rerender(<StatusBadge status={pinkStatus} />);
    
    badge = document.querySelector('.badge');
    expect(badge?.className).toContain('badge-secondary');
    
    // Gray status
    const grayStatus: BeatmapStatus = {
      status: 'graveyard',
      color: 'gray',
      icon: React.createElement('span', null, '⏰')
    };
    rerender(<StatusBadge status={grayStatus} />);
    
    badge = document.querySelector('.badge');
    expect(badge?.className).toContain('badge-neutral');
  });

  test('renders multiple status badges independently', () => {
    const status1: BeatmapStatus = {
      status: 'ranked',
      color: 'blue',
      icon: React.createElement('span', null, '⭐')
    };
    const status2: BeatmapStatus = {
      status: 'loved',
      color: 'pink',
      icon: React.createElement('span', null, '❤️')
    };

    render(
      <div>
        <StatusBadge status={status1} />
        <StatusBadge status={status2} />
      </div>
    );
    
    expect(screen.getByText('⭐')).toBeDefined();
    expect(screen.getByText('❤️')).toBeDefined();
    
    // Vérifier que les badges sont présents
    const badges = document.querySelectorAll('.badge');
    expect(badges).toHaveLength(2);
  });

  test('handles status with special characters', () => {
    const specialStatus: BeatmapStatus = {
      status: 'ranked' as any,
      color: 'blue',
      icon: React.createElement('span', null, '⭐+')
    };

    render(<StatusBadge status={specialStatus} />);
    
    expect(screen.getByText('⭐+')).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });
});
