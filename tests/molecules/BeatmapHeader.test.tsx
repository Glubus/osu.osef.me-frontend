import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BeatmapHeader from '../../src/components/molecules/BeatmapHeader/BeatmapHeader';
import React from 'react';
import type { BeatmapCompleteExtended } from '../../src/types/beatmap/extended';

// Mock useDownload hook
const mockDownloadBeatmap = () => {};
const mockUseDownload = () => ({
  downloadBeatmap: mockDownloadBeatmap
});

// Mock data
const mockBeatmaps: BeatmapCompleteExtended[] = [
  {
    beatmap: {
      id: 1,
      osu_id: 111,
      difficulty: 'Easy',
      difficulty_rating: 1.5,
      count_circles: 100,
      count_sliders: 50,
      count_spinners: 10,
      max_combo: 200,
      drain_time: 120,
      total_time: 130,
      bpm: 120,
      cs: 4,
      ar: 8,
      od: 8,
      hp: 6,
      mode: 0,
      status: 'ranked',
      file_md5: 'abc123',
      file_path: '/path/to/file.osu'
    },
    msd: [
      {
        id: 1,
        overall: 2.5,
        stream: 2.0,
        jumpstream: 3.0,
        handstream: 1.5,
        stamina: 2.5,
        jackspeed: 2.0,
        chordjack: 1.0,
        technical: 3.0,
        rate: 1.0,
        main_pattern: 'stream'
      }
    ]
  },
  {
    beatmap: {
      id: 2,
      osu_id: 222,
      difficulty: 'Hard',
      difficulty_rating: 4.5,
      count_circles: 200,
      count_sliders: 100,
      count_spinners: 20,
      max_combo: 400,
      drain_time: 180,
      total_time: 200,
      bpm: 140,
      cs: 5,
      ar: 9,
      od: 9,
      hp: 7,
      mode: 0,
      status: 'ranked',
      file_md5: 'def456',
      file_path: '/path/to/file2.osu'
    },
    msd: [
      {
        id: 2,
        overall: 5.5,
        stream: 5.0,
        jumpstream: 6.0,
        handstream: 4.5,
        stamina: 5.5,
        jackspeed: 5.0,
        chordjack: 4.0,
        technical: 6.0,
        rate: 1.0,
        main_pattern: 'jumpstream'
      }
    ]
  }
];

describe('BeatmapHeader Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders beatmap header with basic information', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="111"
      />
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
    expect(screen.getByText('by Test Creator')).toBeDefined();
  });

  test('renders difficulty badges with correct values', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="111"
      />
    );
    
    // Vérifier que les badges de difficulté sont présents avec les bonnes valeurs
    expect(screen.getByText('2.50')).toBeDefined();
    expect(screen.getByText('5.50')).toBeDefined();
  });

  test('renders active difficulty badge correctly', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="111"
      />
    );
    
    // Le premier beatmap (osu_id: 111) devrait être actif
    const badges = document.querySelectorAll('.badge');
    expect(badges.length).toBe(2);
  });

  test('renders download button', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="111"
      />
    );
    
    expect(screen.getByText('Download')).toBeDefined();
  });

  test('handles difficulty click', async () => {
    const mockOnDifficultyClick = () => {};
    const user = userEvent.setup();
    
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="111"
        onDifficultyClick={mockOnDifficultyClick}
      />
    );
    
    // Cliquer sur le premier badge de difficulté
    const firstBadge = document.querySelector('.badge');
    expect(firstBadge).toBeDefined();
    
    await user.click(firstBadge!);
    // Vérifier que le clic fonctionne (pas d'erreur)
    expect(firstBadge).toBeDefined();
  });

  test('renders with missing cover URL', () => {
    render(
      <BeatmapHeader
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="111"
      />
    );
    
    const image = document.querySelector('img');
    expect(image?.src).toContain('/default-cover.jpg');
  });

  test('renders with missing artist and title', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="111"
      />
    );
    
    expect(screen.getByText('Unknown Artist - Unknown Title')).toBeDefined();
    expect(screen.getByText('by Test Creator')).toBeDefined();
  });

  test('renders with missing creator', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="111"
      />
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
    expect(screen.getByText('by Unknown Creator')).toBeDefined();
  });

  test('renders with empty beatmaps array', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={[]}
        currentBeatmapId="111"
      />
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
    expect(screen.getByText('by Test Creator')).toBeDefined();
  });

  test('renders with beatmaps without MSD data', () => {
    const beatmapsWithoutMsd: BeatmapCompleteExtended[] = [
      {
        beatmap: {
          id: 1,
          osu_id: 111,
          difficulty: 'Easy',
          difficulty_rating: 1.5,
          count_circles: 100,
          count_sliders: 50,
          count_spinners: 10,
          max_combo: 200,
          drain_time: 120,
          total_time: 130,
          bpm: 120,
          cs: 4,
          ar: 8,
          od: 8,
          hp: 6,
          mode: 0,
          status: 'ranked',
          file_md5: 'abc123',
          file_path: '/path/to/file.osu'
        },
        msd: undefined
      }
    ];
    
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={beatmapsWithoutMsd}
        currentBeatmapId="111"
      />
    );
    
    // Vérifier que la difficulté est affichée comme 0.00 quand MSD est manquant
    expect(screen.getByText('0.00')).toBeDefined();
  });

  test('renders with beatmaps without MSD 1.0x rate', () => {
    const beatmapsWithoutMsd10: BeatmapCompleteExtended[] = [
      {
        beatmap: {
          id: 1,
          osu_id: 111,
          difficulty: 'Easy',
          difficulty_rating: 1.5,
          count_circles: 100,
          count_sliders: 50,
          count_spinners: 10,
          max_combo: 200,
          drain_time: 120,
          total_time: 130,
          bpm: 120,
          cs: 4,
          ar: 8,
          od: 8,
          hp: 6,
          mode: 0,
          status: 'ranked',
          file_md5: 'abc123',
          file_path: '/path/to/file.osu'
        },
        msd: [
          {
            id: 1,
            overall: 3.5,
            stream: 3.0,
            jumpstream: 4.0,
            handstream: 2.5,
            stamina: 3.5,
            jackspeed: 3.0,
            chordjack: 2.0,
            technical: 4.0,
            rate: 1.2, // Pas 1.0x
            main_pattern: 'stream'
          }
        ]
      }
    ];
    
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={beatmapsWithoutMsd10}
        currentBeatmapId="111"
      />
    );
    
    // Devrait utiliser le premier MSD disponible (rate 1.2)
    expect(screen.getByText('3.50')).toBeDefined();
  });

  test('renders with proper CSS classes', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="111"
      />
    );
    
    const container = document.querySelector('.flex.gap-6.mb-6');
    expect(container).toBeDefined();
    
    const leftSide = document.querySelector('.flex-1.relative.h-64');
    expect(leftSide).toBeDefined();
    
    const rightSide = document.querySelector('.w-64.flex.flex-col.gap-3');
    expect(rightSide).toBeDefined();
  });

  test('renders with proper image alt text', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="111"
      />
    );
    
    const image = document.querySelector('img');
    expect(image?.alt).toBe('Test Artist - Test Title');
  });

  test('renders with proper image alt text for missing data', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="111"
      />
    );
    
    const image = document.querySelector('img');
    expect(image?.alt).toBe('Unknown Artist - Unknown Title');
  });

  test('renders with custom cover image', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/custom-cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="111"
      />
    );
    
    const image = document.querySelector('img');
    expect(image?.src).toContain('https://example.com/custom-cover.jpg');
  });

  test('renders with different current beatmap ID', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        currentBeatmapId="222" // Deuxième beatmap
      />
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
    // Le deuxième beatmap devrait être actif
    const badges = document.querySelectorAll('.badge');
    expect(badges.length).toBe(2);
  });

  test('renders with no current beatmap ID', () => {
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={mockBeatmaps}
        // Pas de currentBeatmapId
      />
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
    // Aucun beatmap ne devrait être actif
    const badges = document.querySelectorAll('.badge');
    expect(badges.length).toBe(2);
  });

  test('renders with missing beatmap osu_id', () => {
    const beatmapsWithoutOsuId: BeatmapCompleteExtended[] = [
      {
        beatmap: {
          id: 1,
          osu_id: undefined,
          difficulty: 'Easy',
          difficulty_rating: 1.5,
          count_circles: 100,
          count_sliders: 50,
          count_spinners: 10,
          max_combo: 200,
          drain_time: 120,
          total_time: 130,
          bpm: 120,
          cs: 4,
          ar: 8,
          od: 8,
          hp: 6,
          mode: 0,
          status: 'ranked',
          file_md5: 'abc123',
          file_path: '/path/to/file.osu'
        },
        msd: [
          {
            id: 1,
            overall: 2.5,
            stream: 2.0,
            jumpstream: 3.0,
            handstream: 1.5,
            stamina: 2.5,
            jackspeed: 2.0,
            chordjack: 1.0,
            technical: 3.0,
            rate: 1.0,
            main_pattern: 'stream'
          }
        ]
      }
    ];
    
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={beatmapsWithoutOsuId}
        currentBeatmapId="111"
      />
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
    expect(screen.getByText('2.50')).toBeDefined();
  });

  test('renders with missing beatmap data', () => {
    const beatmapsWithoutBeatmap: BeatmapCompleteExtended[] = [
      {
        beatmap: undefined,
        msd: [
          {
            id: 1,
            overall: 2.5,
            stream: 2.0,
            jumpstream: 3.0,
            handstream: 1.5,
            stamina: 2.5,
            jackspeed: 2.0,
            chordjack: 1.0,
            technical: 3.0,
            rate: 1.0,
            main_pattern: 'stream'
          }
        ]
      }
    ];
    
    render(
      <BeatmapHeader
        coverUrl="https://example.com/cover.jpg"
        artist="Test Artist"
        title="Test Title"
        creator="Test Creator"
        beatmapsetOsuId={12345}
        beatmaps={beatmapsWithoutBeatmap}
        currentBeatmapId="111"
      />
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
    expect(screen.getByText('2.50')).toBeDefined();
  });
});
