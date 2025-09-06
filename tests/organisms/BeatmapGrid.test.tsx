import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BeatmapGrid from '../../src/components/organisms/BeatmapGrid/BeatmapGrid';
import { mockBeatmapCompleteShortArray } from '../data';

describe('BeatmapGrid Component', () => {
  afterEach(() => {
    cleanup();
  });

  const mockBeatmapset = {
    beatmapset: {
      id: 1,
      osu_id: 12345,
      title: 'Test Song',
      artist: 'Test Artist',
      creator: 'Test Creator',
      cover_url: 'https://example.com/cover.jpg'
    },
    beatmap: [mockBeatmapCompleteShortArray[0]]
  };

  const mockBeatmapsets = [
    mockBeatmapset,
    {
      ...mockBeatmapset,
      beatmapset: {
        ...mockBeatmapset.beatmapset!,
        id: 2,
        osu_id: 12346,
        title: 'Test Song 2',
        artist: 'Test Artist 2'
      },
      beatmap: [mockBeatmapCompleteShortArray[1]]
    }
  ];

  test('renders beatmap grid with beatmaps', () => {
    render(
      <MemoryRouter>
        <BeatmapGrid beatmaps={mockBeatmapsets} />
      </MemoryRouter>
    );
    
    expect(screen.getAllByText(/Test Song/)).toHaveLength(2);
  });

  test('renders loading state', () => {
    render(<BeatmapGrid beatmaps={[]} loading={true} />);
    
    expect(screen.getByText('Loading beatmaps...')).toBeDefined();
  });

  test('renders custom loading message', () => {
    render(<BeatmapGrid beatmaps={[]} loading={true} loadingMessage="Custom loading..." />);
    
    expect(screen.getByText('Custom loading...')).toBeDefined();
  });

  test('renders empty state', () => {
    render(<BeatmapGrid beatmaps={[]} />);
    
    expect(screen.getByText('No beatmaps found with these filters.')).toBeDefined();
  });

  test('renders custom empty message', () => {
    render(<BeatmapGrid beatmaps={[]} emptyMessage="Custom empty message" />);
    
    expect(screen.getByText('Custom empty message')).toBeDefined();
  });

  test('renders loading more state', () => {
    render(
      <MemoryRouter>
        <BeatmapGrid beatmaps={mockBeatmapsets} loadingMore={true} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Loading more beatmaps...')).toBeDefined();
  });

  test('renders custom loading more message', () => {
    render(
      <MemoryRouter>
        <BeatmapGrid beatmaps={mockBeatmapsets} loadingMore={true} loadingMoreMessage="Custom loading more..." />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Custom loading more...')).toBeDefined();
  });

  test('renders no more message when hasMore is false', () => {
    render(
      <MemoryRouter>
        <BeatmapGrid beatmaps={mockBeatmapsets} hasMore={false} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('No more beatmaps to load.')).toBeDefined();
  });

  test('renders custom no more message', () => {
    render(
      <MemoryRouter>
        <BeatmapGrid beatmaps={mockBeatmapsets} hasMore={false} noMoreMessage="Custom no more message" />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Custom no more message')).toBeDefined();
  });

  test('has correct grid layout', () => {
    render(
      <MemoryRouter>
        <BeatmapGrid beatmaps={mockBeatmapsets} />
      </MemoryRouter>
    );
    
    const grid = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.gap-4');
    expect(grid).toBeDefined();
  });

  test('renders correct number of beatmap cards', () => {
    render(
      <MemoryRouter>
        <BeatmapGrid beatmaps={mockBeatmapsets} />
      </MemoryRouter>
    );
    
    // Each beatmapset should render a BeatmapHorizontalCard
    expect(screen.getAllByText(/Test Song/)).toHaveLength(2);
  });

  test('handles single beatmap', () => {
    render(
      <MemoryRouter>
        <BeatmapGrid beatmaps={[mockBeatmapset]} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Test Song/)).toBeDefined();
    expect(screen.queryByText(/Test Song 2/)).toBeNull();
  });

  test('does not show no more message when hasMore is true', () => {
    render(
      <MemoryRouter>
        <BeatmapGrid beatmaps={mockBeatmapsets} hasMore={true} />
      </MemoryRouter>
    );
    
    expect(screen.queryByText('No more beatmaps to load.')).toBeNull();
  });

  test('does not show no more message when no beatmaps', () => {
    render(<BeatmapGrid beatmaps={[]} hasMore={false} />);
    
    expect(screen.queryByText('No more beatmaps to load.')).toBeNull();
  });
});
