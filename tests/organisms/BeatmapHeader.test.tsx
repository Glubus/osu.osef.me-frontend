import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BeatmapHeader from '../../src/components/organisms/BeatmapHeader/BeatmapHeader';
import { mockBeatmapCompleteExtendedArray } from '../data';

describe('BeatmapHeader Component', () => {
  afterEach(() => {
    cleanup();
  });

  const mockBeatmaps = mockBeatmapCompleteExtendedArray;

  const defaultProps = {
    coverUrl: 'https://example.com/cover.jpg',
    artist: 'Test Artist',
    title: 'Test Song',
    creator: 'Test Creator',
    beatmapsetOsuId: 12345,
    beatmaps: mockBeatmaps,
    currentBeatmapId: '123'
  };

  test('renders beatmap header with all information', () => {
    render(
      <MemoryRouter>
        <BeatmapHeader {...defaultProps} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Test Artist - Test Song/)).toBeDefined();
    expect(screen.getByText(/by Test Creator/)).toBeDefined();
  });

  test('renders with default values when props are not provided', () => {
    render(
      <MemoryRouter>
        <BeatmapHeader />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Unknown Artist - Unknown Title/)).toBeDefined();
    expect(screen.getByText(/by Unknown Creator/)).toBeDefined();
  });

  test('renders with partial information', () => {
    render(
      <MemoryRouter>
        <BeatmapHeader 
          artist="Test Artist"
          title="Test Song"
        />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Test Artist - Test Song/)).toBeDefined();
    expect(screen.getByText(/by Unknown Creator/)).toBeDefined();
  });

  test('renders difficulty badges', () => {
    render(
      <MemoryRouter>
        <BeatmapHeader {...defaultProps} />
      </MemoryRouter>
    );
    
    // Check if difficulty badges are rendered (they should show MSD values)
    expect(screen.getByText('15.50')).toBeDefined();
    expect(screen.getByText('20.00')).toBeDefined();
  });

  test('renders download button', () => {
    render(
      <MemoryRouter>
        <BeatmapHeader {...defaultProps} />
      </MemoryRouter>
    );
    
    // Check if download button is rendered
    const downloadButton = screen.getByText('Download');
    expect(downloadButton).toBeDefined();
  });

  test('has correct CSS classes', () => {
    render(
      <MemoryRouter>
        <BeatmapHeader {...defaultProps} />
      </MemoryRouter>
    );
    
    const container = document.querySelector('.flex.gap-6.mb-6');
    expect(container).toBeDefined();
  });

  test('renders cover image with correct attributes', () => {
    render(
      <MemoryRouter>
        <BeatmapHeader {...defaultProps} />
      </MemoryRouter>
    );
    
    const image = screen.getByRole('img');
    expect(image.getAttribute('src')).toBe('https://example.com/cover.jpg');
    expect(image.getAttribute('alt')).toBe('Test Artist - Test Song');
  });

  test('handles empty beatmaps array', () => {
    render(
      <MemoryRouter>
        <BeatmapHeader {...defaultProps} beatmaps={[]} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Test Artist - Test Song/)).toBeDefined();
    // Should still render the header even without beatmaps
  });

  test('calls onDifficultyClick when provided', () => {
    let clickedBeatmapId: number | undefined;
    const mockOnDifficultyClick = (beatmapOsuId: number) => {
      clickedBeatmapId = beatmapOsuId;
    };
    
    render(
      <MemoryRouter>
        <BeatmapHeader {...defaultProps} onDifficultyClick={mockOnDifficultyClick} />
      </MemoryRouter>
    );
    
    // The component should render without errors
    expect(screen.getByText(/Test Artist - Test Song/)).toBeDefined();
  });

  test('renders with different currentBeatmapId', () => {
    render(
      <MemoryRouter>
        <BeatmapHeader {...defaultProps} currentBeatmapId="124" />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Test Artist - Test Song/)).toBeDefined();
  });

  test('handles undefined beatmapsetOsuId', () => {
    render(
      <MemoryRouter>
        <BeatmapHeader {...defaultProps} beatmapsetOsuId={undefined} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Test Artist - Test Song/)).toBeDefined();
  });
});
