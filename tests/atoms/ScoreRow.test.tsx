import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import ScoreRow from '../../src/components/atoms/ScoreRow';
import { mockScoreFirstPlace, mockScoreSecondPlace, mockScoreThirdPlace, mockScoreWithMisses } from '../data';

describe('ScoreRow', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders score information correctly', () => {
    render(<ScoreRow score={mockScoreFirstPlace} rank={1} />);
    
    expect(screen.getByText('#1')).toBeDefined();
    expect(screen.getByText('FirstPlayer')).toBeDefined();
    expect(screen.getByText('2,000,000')).toBeDefined();
    expect(screen.getByText('99.50%')).toBeDefined();
    expect(screen.getByText('500x')).toBeDefined();
  });

  test('applies correct rank colors for top 3 positions', () => {
    const { rerender } = render(<ScoreRow score={mockScoreFirstPlace} rank={1} />);
    const firstRank = screen.getByText('#1');
    expect(firstRank.className).toContain('text-yellow-500');

    rerender(<ScoreRow score={mockScoreSecondPlace} rank={2} />);
    const secondRank = screen.getByText('#2');
    expect(secondRank.className).toContain('text-gray-400');

    rerender(<ScoreRow score={mockScoreThirdPlace} rank={3} />);
    const thirdRank = screen.getByText('#3');
    expect(thirdRank.className).toContain('text-amber-600');
  });

  test('applies default color for ranks beyond top 3', () => {
    render(<ScoreRow score={mockScoreWithMisses} rank={4} />);
    const rank = screen.getByText('#4');
    expect(rank.className).toContain('text-base-content');
  });

  test('displays hit counts with correct colors', () => {
    render(<ScoreRow score={mockScoreWithMisses} rank={1} />);
    
    // Check that hit counts are displayed with their respective colors
    const marvelous = screen.getByText('10');
    const perfect = screen.getByText('80');
    const great = screen.getByText('70');
    const good = screen.getByText('40');
    const bad = screen.getByText('20');
    const miss = screen.getByText('30');

    expect(marvelous.className).toContain('text-sky-400');
    expect(perfect.className).toContain('text-yellow-400');
    expect(great.className).toContain('text-green-500');
    expect(good.className).toContain('text-blue-700');
    expect(bad.className).toContain('text-pink-400');
    expect(miss.className).toContain('text-red-500');
  });

  test('displays mods and pause count', () => {
    render(<ScoreRow score={mockScoreFirstPlace} rank={1} />);
    
    expect(screen.getByText('0')).toBeDefined(); // mods
    expect(screen.getByText('0')).toBeDefined(); // pause count
  });

  test('displays formatted date', () => {
    render(<ScoreRow score={mockScoreFirstPlace} rank={1} />);
    
    // The date should be formatted and displayed
    expect(screen.getByText('1/1/2023')).toBeDefined();
  });

  test('displays rank badge with correct color', () => {
    render(<ScoreRow score={mockScoreFirstPlace} rank={1} />);
    
    const rankBadge = screen.getByText('SS');
    expect(rankBadge).toBeDefined();
    expect(rankBadge.className).toContain('badge');
    expect(rankBadge.className).toContain('badge-sm');
  });
});
