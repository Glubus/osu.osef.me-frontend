import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import BeatmapCover from '../../src/components/molecules/BeatmapCover';

describe('BeatmapCover Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders with default cover when no coverUrl provided', () => {
    render(<BeatmapCover />);
    
    const image = screen.getByRole('img');
    expect(image).toBeDefined();
    expect(image.getAttribute('src')).toBe('/default-cover.jpg');
  });

  test('renders with provided coverUrl', () => {
    const coverUrl = 'https://example.com/cover.jpg';
    render(<BeatmapCover coverUrl={coverUrl} />);
    
    const image = screen.getByRole('img');
    expect(image.getAttribute('src')).toBe(coverUrl);
  });

  test('renders with correct alt text when artist and title provided', () => {
    const artist = 'Test Artist';
    const title = 'Test Title';
    render(<BeatmapCover artist={artist} title={title} />);
    
    const image = screen.getByRole('img');
    expect(image.getAttribute('alt')).toBe(`${artist} - ${title}`);
  });

  test('renders with default alt text when no artist/title provided', () => {
    render(<BeatmapCover />);
    
    const image = screen.getByRole('img');
    expect(image.getAttribute('alt')).toBe('Unknown Artist - Unknown Title');
  });

  test('renders with partial alt text when only artist provided', () => {
    const artist = 'Test Artist';
    render(<BeatmapCover artist={artist} />);
    
    const image = screen.getByRole('img');
    expect(image.getAttribute('alt')).toBe(`${artist} - Unknown Title`);
  });

  test('renders with partial alt text when only title provided', () => {
    const title = 'Test Title';
    render(<BeatmapCover title={title} />);
    
    const image = screen.getByRole('img');
    expect(image.getAttribute('alt')).toBe(`Unknown Artist - ${title}`);
  });

  test('has correct CSS classes', () => {
    render(<BeatmapCover />);
    
    const container = screen.getByRole('img').closest('div')?.parentElement;
    expect(container?.className).toContain('flex-1');
    expect(container?.className).toContain('relative');
    expect(container?.className).toContain('h-64');
    expect(container?.className).toContain('overflow-hidden');
    expect(container?.className).toContain('rounded-lg');
  });

  test('image has correct CSS classes', () => {
    render(<BeatmapCover />);
    
    const image = screen.getByRole('img');
    expect(image.className).toContain('w-full');
    expect(image.className).toContain('h-full');
    expect(image.className).toContain('object-cover');
  });

  test('renders dark overlay', () => {
    render(<BeatmapCover />);
    
    const overlay = screen.getByRole('img').closest('div')?.querySelector('.bg-black\\/60');
    expect(overlay).toBeDefined();
  });
});
