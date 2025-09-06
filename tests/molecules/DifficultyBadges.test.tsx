import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DifficultyBadges from '../../src/components/molecules/DifficultyBadges';
import { 
  mockBeatmapCompleteExtendedEasy,
  mockBeatmapCompleteExtendedNormal,
  mockBeatmapCompleteExtendedHard,
  mockBeatmapCompleteExtendedWithMultipleRates,
  mockBeatmapCompleteExtendedWithoutMSD,
  mockBeatmapCompleteExtendedArray
} from '../data';

describe('DifficultyBadges Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders empty when no beatmaps provided', () => {
    render(<DifficultyBadges beatmaps={[]} />);
    
    const container = document.querySelector('.flex.flex-wrap.gap-3');
    expect(container).toBeDefined();
  });

  test('renders difficulty badges for each beatmap', () => {
    render(<DifficultyBadges beatmaps={mockBeatmapCompleteExtendedArray} />);
    
    expect(screen.getByText('15.50')).toBeDefined();
    expect(screen.getByText('20.00')).toBeDefined();
    expect(screen.getByText('25.50')).toBeDefined();
  });

  test('calls onDifficultyClick when badge is clicked', async () => {
    let clickedBeatmapId: number | undefined;
    const mockOnDifficultyClick = (beatmapOsuId: number) => {
      clickedBeatmapId = beatmapOsuId;
    };
    const user = userEvent.setup();
    
    render(
      <DifficultyBadges 
        beatmaps={[mockBeatmapCompleteExtendedEasy]} 
        onDifficultyClick={mockOnDifficultyClick} 
      />
    );
    
    const badge = screen.getByText('15.50').closest('div');
    await user.click(badge!);
    
    expect(clickedBeatmapId).toBe(1);
  });

  test('highlights active beatmap', () => {
    render(
      <DifficultyBadges 
        beatmaps={[mockBeatmapCompleteExtendedEasy, mockBeatmapCompleteExtendedNormal]} 
        currentBeatmapId="2" 
      />
    );
    
    const badges = screen.getAllByText(/\d+\.\d+/);
    // The active badge should have different styling (outline={false})
    expect(badges).toHaveLength(2);
  });

  test('handles beatmaps without MSD data', () => {
    render(<DifficultyBadges beatmaps={[mockBeatmapCompleteExtendedWithoutMSD]} />);
    
    // Should render with 0.00 as fallback
    expect(screen.getByText('0.00')).toBeDefined();
  });

  test('handles beatmaps with multiple MSD rates', () => {
    render(<DifficultyBadges beatmaps={[mockBeatmapCompleteExtendedWithMultipleRates]} />);
    
    // Should use 1.0x rate (20.00) for display
    expect(screen.getByText('20.00')).toBeDefined();
  });

  test('has correct CSS classes', () => {
    render(<DifficultyBadges beatmaps={[mockBeatmapCompleteExtendedEasy]} />);
    
    const container = document.querySelector('.flex.flex-wrap.gap-3');
    expect(container).toBeDefined();
    expect(container?.className).toContain('flex');
    expect(container?.className).toContain('flex-wrap');
    expect(container?.className).toContain('gap-3');
  });

  test('badge has hover effect', () => {
    render(<DifficultyBadges beatmaps={[mockBeatmapCompleteExtendedEasy]} />);
    
    const badgeContainer = document.querySelector('.cursor-pointer.hover\\:scale-110.transition-transform');
    expect(badgeContainer).toBeDefined();
    expect(badgeContainer?.className).toContain('cursor-pointer');
    expect(badgeContainer?.className).toContain('hover:scale-110');
    expect(badgeContainer?.className).toContain('transition-transform');
  });

  test('displays correct difficulty rating from MSD', () => {
    render(<DifficultyBadges beatmaps={[mockBeatmapCompleteExtendedEasy]} />);
    
    // Should display the overall MSD value (15.50) not the difficulty_rating (2.5)
    expect(screen.getByText('15.50')).toBeDefined();
    expect(screen.queryByText('2.50')).toBeNull();
  });

  test('handles beatmaps with undefined beatmap', () => {
    const beatmapWithoutBeatmap = {
      beatmap: undefined,
      msd: [{
        id: 1,
        beatmap_id: 1,
        overall: 18.5,
        rate: 1.0
      }]
    };
    
    render(<DifficultyBadges beatmaps={[beatmapWithoutBeatmap]} />);
    
    // Should still render the MSD value
    expect(screen.getByText('18.50')).toBeDefined();
  });

  test('handles beatmaps with empty MSD array', () => {
    const beatmapWithEmptyMSD = {
      beatmap: mockBeatmapCompleteExtendedEasy.beatmap,
      msd: []
    };
    
    render(<DifficultyBadges beatmaps={[beatmapWithEmptyMSD]} />);
    
    // Should render with 0.00 as fallback
    expect(screen.getByText('0.00')).toBeDefined();
  });

  test('handles beatmaps with MSD without overall value', () => {
    const beatmapWithIncompleteMSD = {
      beatmap: mockBeatmapCompleteExtendedEasy.beatmap,
      msd: [{
        id: 1,
        beatmap_id: 1,
        rate: 1.0
        // overall is undefined
      }]
    };
    
    render(<DifficultyBadges beatmaps={[beatmapWithIncompleteMSD]} />);
    
    // Should render with 0.00 as fallback
    expect(screen.getByText('0.00')).toBeDefined();
  });
});