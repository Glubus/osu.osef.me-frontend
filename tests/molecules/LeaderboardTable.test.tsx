import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import LeaderboardTable from '../../src/components/molecules/LeaderboardTable';
import { mockScores } from '../data';

describe('LeaderboardTable', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders leaderboard table with correct title', () => {
    render(<LeaderboardTable scores={mockScores} selectedRate={1.0} />);
    
    expect(screen.getByText('Leaderboard (1x)')).toBeDefined();
  });

  test('displays all column headers correctly', () => {
    render(<LeaderboardTable scores={mockScores} selectedRate={1.0} />);
    
    expect(screen.getByText('Rank')).toBeDefined();
    expect(screen.getByText('Player')).toBeDefined();
    expect(screen.getByText('Score')).toBeDefined();
    expect(screen.getByText('Accuracy')).toBeDefined();
    expect(screen.getByText('Marv')).toBeDefined();
    expect(screen.getByText('Perf')).toBeDefined();
    expect(screen.getByText('Great')).toBeDefined();
    expect(screen.getByText('Good')).toBeDefined();
    expect(screen.getByText('Bad')).toBeDefined();
    expect(screen.getByText('Miss')).toBeDefined();
    expect(screen.getByText('Max Combo')).toBeDefined();
    expect(screen.getByText('Mods')).toBeDefined();
    expect(screen.getByText('Pause')).toBeDefined();
    expect(screen.getByText('Date')).toBeDefined();
  });

  test('renders all scores in the table', () => {
    render(<LeaderboardTable scores={mockScores} selectedRate={1.0} />);
    
    // Check that all player names are displayed
    expect(screen.getByText('FirstPlayer')).toBeDefined();
    expect(screen.getByText('SecondPlayer')).toBeDefined();
    expect(screen.getByText('ThirdPlayer')).toBeDefined();
    expect(screen.getByText('MissPlayer')).toBeDefined();
  });

  test('displays correct number of rows', () => {
    render(<LeaderboardTable scores={mockScores} selectedRate={1.0} />);
    
    // Should have 4 data rows (one for each score)
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(5); // 1 header + 4 data rows
  });

  test('updates title when selectedRate changes', () => {
    const { rerender } = render(<LeaderboardTable scores={mockScores} selectedRate={1.0} />);
    expect(screen.getByText('Leaderboard (1x)')).toBeDefined();

    rerender(<LeaderboardTable scores={mockScores} selectedRate={1.5} />);
    expect(screen.getByText('Leaderboard (1.5x)')).toBeDefined();
  });

  test('handles empty scores array', () => {
    render(<LeaderboardTable scores={[]} selectedRate={1.0} />);
    
    expect(screen.getByText('Leaderboard (1x)')).toBeDefined();
    expect(screen.getByText('Rank')).toBeDefined();
    
    // Should only have header row
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });

  test('renders table with correct CSS classes', () => {
    render(<LeaderboardTable scores={mockScores} selectedRate={1.0} />);
    
    const table = screen.getByRole('table');
    expect(table.className).toContain('table');
    expect(table.className).toContain('table-sm');
    expect(table.className).toContain('w-full');
    
    const container = table.closest('.overflow-x-auto');
    expect(container).toBeDefined();
  });
});
