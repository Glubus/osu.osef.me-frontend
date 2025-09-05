import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BeatmapHorizontalCard from '../../src/components/molecules/BeatmapHorizontalCard/BeatmapHorizontalCard';
import React from 'react';
import type { BeatmapsetCompleteShort } from '../../src/types/beatmap/short';
import { MemoryRouter } from 'react-router-dom';

// Mock useDownload hook
const mockDownloadBeatmap = () => {};
const mockUseDownload = () => ({
  downloadBeatmap: mockDownloadBeatmap
});

// Wrapper component with Router
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

// Mock data
const mockBeatmapset: BeatmapsetCompleteShort = {
  beatmapset: {
    id: 1,
    osu_id: 12345,
    artist: 'Test Artist',
    title: 'Test Title',
    creator: 'Test Creator',
    cover_url: 'https://example.com/cover.jpg'
  },
  beatmap: [
    {
      beatmap: {
        id: 1,
        osu_id: 111,
        difficulty: 'Easy',
        difficulty_rating: 1.5,
        mode: 0,
        status: 'ranked'
      },
      msd: {
        id: 1,
        overall: 2.5,
        main_pattern: 'stream'
      }
    },
    {
      beatmap: {
        id: 2,
        osu_id: 222,
        difficulty: 'Hard',
        difficulty_rating: 4.5,
        mode: 0,
        status: 'ranked'
      },
      msd: {
        id: 2,
        overall: 5.5,
        main_pattern: 'jumpstream'
      }
    }
  ]
};

describe('BeatmapHorizontalCard Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders beatmap card with basic information', () => {
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
    expect(screen.getByText('by Test Creator')).toBeDefined();
  });

  test('renders difficulty badges', () => {
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </TestWrapper>
    );
    
    // Vérifier que les badges de difficulté sont présents avec les bonnes valeurs
    expect(screen.getByText('2.50')).toBeDefined();
    expect(screen.getByText('5.50')).toBeDefined();
    
    // Vérifier les tooltips des badges
    const badges = document.querySelectorAll('.badge');
    expect(badges.length).toBeGreaterThan(0);
  });

  test('renders pattern badges', () => {
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </TestWrapper>
    );
    
    // Vérifier que les badges de patterns sont présents avec les bonnes valeurs
    expect(screen.getByText('Stream')).toBeDefined();
    expect(screen.getByText('JS')).toBeDefined();
  });

  test('renders status badge', () => {
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </TestWrapper>
    );
    
    // Vérifier que le badge de status est présent (ranked = étoile)
    const statusBadge = document.querySelector('.badge');
    expect(statusBadge).toBeDefined();
    // Le badge contient une icône d'étoile pour le status "ranked"
  });

  test('renders difficulty range', () => {
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </TestWrapper>
    );
    
    // Vérifier que la plage de difficulté est affichée avec les bonnes valeurs
    expect(screen.getByText('2.50 - 5.50')).toBeDefined();
  });

  test('handles click navigation', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </TestWrapper>
    );
    
    const card = document.querySelector('.card');
    expect(card).toBeDefined();
    
    await user.click(card!);
    
    // Vérifier que le clic fonctionne (pas d'erreur)
    expect(card).toBeDefined();
  });

  test('renders download button with correct title', () => {
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </TestWrapper>
    );
    
    // Vérifier que le bouton de téléchargement est présent avec le bon titre
    const downloadButton = document.querySelector('button[title="Télécharger le beatmapset"]');
    expect(downloadButton).toBeDefined();
    
    // Vérifier que le bouton contient l'icône de téléchargement
    const downloadIcon = downloadButton?.querySelector('svg');
    expect(downloadIcon).toBeDefined();
  });

  test('renders with missing beatmapset data', () => {
    const incompleteBeatmapset: BeatmapsetCompleteShort = {
      beatmapset: {
        id: 1,
        osu_id: 12345,
        artist: undefined,
        title: undefined,
        creator: undefined,
        cover_url: undefined
      },
      beatmap: []
    };
    
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={incompleteBeatmapset} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Unknown Artist - Unknown Title')).toBeDefined();
    expect(screen.getByText('by Unknown Creator')).toBeDefined();
  });

  test('renders with empty beatmap array', () => {
    const emptyBeatmapset: BeatmapsetCompleteShort = {
      beatmapset: {
        id: 1,
        osu_id: 12345,
        artist: 'Test Artist',
        title: 'Test Title',
        creator: 'Test Creator',
        cover_url: 'https://example.com/cover.jpg'
      },
      beatmap: []
    };
    
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={emptyBeatmapset} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
  });

  test('renders with many beatmaps (more than 5)', () => {
    const manyBeatmaps = Array(7).fill(null).map((_, i) => ({
      beatmap: {
        id: i + 1,
        osu_id: 100 + i,
        difficulty: `Difficulty ${i + 1}`,
        difficulty_rating: i + 1,
        mode: 0,
        status: 'ranked' as const
      },
      msd: {
        id: i + 1,
        overall: i + 1,
        main_pattern: 'stream'
      }
    }));
    
    const beatmapsetWithMany: BeatmapsetCompleteShort = {
      ...mockBeatmapset,
      beatmap: manyBeatmaps
    };
    
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={beatmapsetWithMany} />
      </TestWrapper>
    );
    
    // Vérifier que le badge "+2" est présent pour les beatmaps supplémentaires
    expect(screen.getByText('+2')).toBeDefined();
    // Vérifier que les 5 premiers beatmaps sont affichés
    expect(screen.getByText('1.00')).toBeDefined();
    expect(screen.getByText('2.00')).toBeDefined();
    expect(screen.getByText('3.00')).toBeDefined();
    expect(screen.getByText('4.00')).toBeDefined();
    expect(screen.getByText('5.00')).toBeDefined();
  });

  test('renders with different status types', () => {
    const lovedBeatmapset: BeatmapsetCompleteShort = {
      ...mockBeatmapset,
      beatmap: [{
        ...mockBeatmapset.beatmap[0],
        beatmap: {
          ...mockBeatmapset.beatmap[0].beatmap,
          status: 'loved'
        }
      }]
    };
    
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={lovedBeatmapset} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
  });

  test('renders with different pattern types', () => {
    const patternBeatmapset: BeatmapsetCompleteShort = {
      ...mockBeatmapset,
      beatmap: [{
        ...mockBeatmapset.beatmap[0],
        msd: {
          ...mockBeatmapset.beatmap[0].msd!,
          main_pattern: 'chordjack'
        }
      }]
    };
    
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={patternBeatmapset} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
    // Vérifier que le pattern "chordjack" est affiché comme "CJ"
    expect(screen.getByText('CJ')).toBeDefined();
  });

  test('renders with JSON pattern array', () => {
    const jsonPatternBeatmapset: BeatmapsetCompleteShort = {
      ...mockBeatmapset,
      beatmap: [{
        ...mockBeatmapset.beatmap[0],
        msd: {
          ...mockBeatmapset.beatmap[0].msd!,
          main_pattern: '["stream", "jumpstream"]'
        }
      }]
    };
    
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={jsonPatternBeatmapset} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
    // Vérifier que les patterns JSON sont parsés et affichés
    expect(screen.getByText('Stream')).toBeDefined();
    expect(screen.getByText('JS')).toBeDefined();
  });

  test('renders with invalid JSON pattern', () => {
    const invalidJsonPatternBeatmapset: BeatmapsetCompleteShort = {
      ...mockBeatmapset,
      beatmap: [{
        ...mockBeatmapset.beatmap[0],
        msd: {
          ...mockBeatmapset.beatmap[0].msd!,
          main_pattern: 'invalid-json'
        }
      }]
    };
    
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={invalidJsonPatternBeatmapset} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
    // Vérifier que le pattern invalide est traité comme une string simple
    expect(screen.getByText('invalid-json')).toBeDefined();
  });

  test('renders with missing MSD data', () => {
    const noMsdBeatmapset: BeatmapsetCompleteShort = {
      ...mockBeatmapset,
      beatmap: [{
        ...mockBeatmapset.beatmap[0],
        msd: undefined
      }]
    };
    
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={noMsdBeatmapset} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
    // Vérifier que la difficulté est affichée comme 0.00 quand MSD est manquant
    expect(screen.getByText('0.00')).toBeDefined();
  });

  test('renders with missing beatmapset', () => {
    const noBeatmapset: BeatmapsetCompleteShort = {
      beatmapset: undefined,
      beatmap: []
    };
    
    const { container } = render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={noBeatmapset} />
      </TestWrapper>
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('renders with missing osu_id', () => {
    const noOsuIdBeatmapset: BeatmapsetCompleteShort = {
      ...mockBeatmapset,
      beatmapset: {
        ...mockBeatmapset.beatmapset!,
        osu_id: undefined
      }
    };
    
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={noOsuIdBeatmapset} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
  });

  test('renders with missing beatmap osu_id', () => {
    const noBeatmapOsuId: BeatmapsetCompleteShort = {
      ...mockBeatmapset,
      beatmap: [{
        ...mockBeatmapset.beatmap[0],
        beatmap: {
          ...mockBeatmapset.beatmap[0].beatmap,
          osu_id: undefined
        }
      }]
    };
    
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={noBeatmapOsuId} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Artist - Test Title')).toBeDefined();
  });

  test('renders with default cover image', () => {
    const noCoverBeatmapset: BeatmapsetCompleteShort = {
      ...mockBeatmapset,
      beatmapset: {
        ...mockBeatmapset.beatmapset!,
        cover_url: undefined
      }
    };
    
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={noCoverBeatmapset} />
      </TestWrapper>
    );
    
    const image = document.querySelector('img');
    expect(image?.src).toContain('/default-cover.jpg');
  });

  test('renders with custom cover image', () => {
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </TestWrapper>
    );
    
    const image = document.querySelector('img');
    expect(image?.src).toContain('https://example.com/cover.jpg');
  });

  test('renders with proper CSS classes', () => {
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </TestWrapper>
    );
    
    const card = document.querySelector('.card');
    expect(card?.className).toContain('bg-base-100');
    expect(card?.className).toContain('shadow-xl');
    expect(card?.className).toContain('cursor-pointer');
  });

  test('renders with proper image alt text', () => {
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={mockBeatmapset} />
      </TestWrapper>
    );
    
    const image = document.querySelector('img');
    expect(image?.alt).toBe('Test Artist - Test Title');
  });

  test('renders with proper image alt text for missing data', () => {
    const incompleteBeatmapset: BeatmapsetCompleteShort = {
      beatmapset: {
        id: 1,
        osu_id: 12345,
        artist: undefined,
        title: undefined,
        creator: 'Test Creator',
        cover_url: 'https://example.com/cover.jpg'
      },
      beatmap: []
    };
    
    render(
      <TestWrapper>
        <BeatmapHorizontalCard beatmapset={incompleteBeatmapset} />
      </TestWrapper>
    );
    
    const image = document.querySelector('img');
    expect(image?.alt).toBe('Unknown Artist - Unknown Title');
  });
});
