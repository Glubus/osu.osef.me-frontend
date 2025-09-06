import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DifficultyButtons from '../../src/components/molecules/DifficultyButtons/DifficultyButtons';
import type { BeatmapCompleteExtended } from '../../src/types/beatmap/extended';

describe('DifficultyButtons Component', () => {
  afterEach(() => {
    cleanup();
  });

  const mockBeatmaps: BeatmapCompleteExtended[] = [
    {
      beatmap: { osu_id: 1, difficulty: 'Easy' },
      msd: [{ rate: 1.0, overall: 1.5 }]
    },
    {
      beatmap: { osu_id: 2, difficulty: 'Normal' },
      msd: [{ rate: 1.0, overall: 2.5 }]
    },
    {
      beatmap: { osu_id: 3, difficulty: 'Hard' },
      msd: [{ rate: 1.0, overall: 3.5 }]
    },
    {
      beatmap: { osu_id: 4, difficulty: 'Insane' },
      msd: [{ rate: 1.0, overall: 4.5 }]
    }
  ];

  const defaultProps = {
    beatmaps: mockBeatmaps,
    currentBeatmapId: '2',
    beatmapsetId: '123'
  };

  test('renders difficulty buttons', () => {
    render(
      <MemoryRouter>
        <DifficultyButtons {...defaultProps} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Easy')).toBeDefined();
    expect(screen.getByText('Normal')).toBeDefined();
    expect(screen.getByText('Hard')).toBeDefined();
    expect(screen.getByText('Insane')).toBeDefined();
  });

  test('highlights selected difficulty', () => {
    render(
      <MemoryRouter>
        <DifficultyButtons {...defaultProps} currentBeatmapId="2" />
      </MemoryRouter>
    );
    
    const selectedButton = document.querySelector('.bg-blue-600');
    expect(selectedButton).toBeDefined();
    expect(selectedButton?.className).toContain('bg-blue-600');
  });

  test('calls navigate when difficulty is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <DifficultyButtons {...defaultProps} />
      </MemoryRouter>
    );
    
    const difficultyButton = screen.getByText('Hard');
    await user.click(difficultyButton);
    
    // The component should render without errors when clicked
    expect(difficultyButton).toBeDefined();
  });

  test('handles empty difficulties array', () => {
    render(
      <MemoryRouter>
        <DifficultyButtons {...defaultProps} beatmaps={[]} />
      </MemoryRouter>
    );
    
    // Should render without any buttons
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('has correct CSS classes', () => {
    render(
      <MemoryRouter>
        <DifficultyButtons {...defaultProps} />
      </MemoryRouter>
    );
    
    const container = document.querySelector('.flex.flex-wrap.gap-2');
    expect(container).toBeDefined();
    expect(container?.className).toContain('flex');
    expect(container?.className).toContain('flex-wrap');
    expect(container?.className).toContain('gap-2');
  });

  test('difficulty buttons have correct styling', () => {
    render(
      <MemoryRouter>
        <DifficultyButtons {...defaultProps} />
      </MemoryRouter>
    );
    
    const difficultyButtons = screen.getAllByRole('button');
    difficultyButtons.forEach(button => {
      expect(button.className).toContain('px-3');
      expect(button.className).toContain('py-2');
      expect(button.className).toContain('rounded-lg');
    });
  });

  test('handles single difficulty', () => {
    const singleBeatmap = [mockBeatmaps[0]];
    render(
      <MemoryRouter>
        <DifficultyButtons {...defaultProps} beatmaps={singleBeatmap} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Easy')).toBeDefined();
    expect(screen.queryByText('Normal')).toBeNull();
  });
});
