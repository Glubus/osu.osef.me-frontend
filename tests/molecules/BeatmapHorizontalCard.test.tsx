import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BeatmapHorizontalCard from '../../src/components/molecules/BeatmapHorizontalCard/BeatmapHorizontalCard';
import { mockBeatmapCompleteShortArray } from '../data';
import type { BeatmapsetCompleteShort } from '../../src/types/beatmap/short';

describe('BeatmapHorizontalCard Component', () => {
  afterEach(() => {
    cleanup();
  });

  const mockBeatmapset: BeatmapsetCompleteShort = {
    beatmapset: {
      id: 1,
      osu_id: 12345,
      title: 'Test Song',
      artist: 'Test Artist',
      creator: 'Test Creator',
      cover_url: 'https://example.com/cover.jpg'
    },
    beatmap: mockBeatmapCompleteShortArray
  };

  test('renders beatmap information', () => {
    render(
      <MemoryRouter>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Test Song/)).toBeDefined();
    expect(screen.getByText(/Test Artist/)).toBeDefined();
  });

  test('renders with correct CSS classes', () => {
    render(
      <MemoryRouter>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </MemoryRouter>
    );
    
    const card = document.querySelector('.card.bg-base-100.shadow-xl');
    expect(card).toBeDefined();
    expect(card?.className).toContain('card');
    expect(card?.className).toContain('bg-base-100');
    expect(card?.className).toContain('shadow-xl');
  });

  test('handles click events', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </MemoryRouter>
    );
    
    const card = screen.getByText(/Test Song/).closest('div');
    await user.click(card!);
    
    // The component should render without errors when clicked
    expect(card).toBeDefined();
  });

  test('renders without onClick handler', () => {
    render(
      <MemoryRouter>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Test Song/)).toBeDefined();
  });
});
