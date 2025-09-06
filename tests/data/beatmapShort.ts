import type { BeatmapCompleteShort } from '../../src/types/beatmap/short';

export const createMockBeatmapCompleteShort = (overrides: Partial<BeatmapCompleteShort> = {}): BeatmapCompleteShort => ({
  beatmap: {
    id: 1,
    osu_id: 12345,
    difficulty: 'Normal',
    difficulty_rating: 5.0,
    mode: 0,
    status: 'ranked'
  },
  msd: {
    id: 1,
    overall: 20.0,
    main_pattern: 'stream'
  },
  ...overrides
});

export const mockBeatmapCompleteShortStream: BeatmapCompleteShort = createMockBeatmapCompleteShort({
  beatmap: {
    id: 1,
    osu_id: 1,
    difficulty: 'Easy',
    difficulty_rating: 2.5,
    mode: 0,
    status: 'ranked'
  },
  msd: {
    id: 1,
    overall: 15.5,
    main_pattern: 'stream'
  }
});

export const mockBeatmapCompleteShortJumpstream: BeatmapCompleteShort = createMockBeatmapCompleteShort({
  beatmap: {
    id: 2,
    osu_id: 2,
    difficulty: 'Normal',
    difficulty_rating: 5.0,
    mode: 0,
    status: 'ranked'
  },
  msd: {
    id: 2,
    overall: 20.0,
    main_pattern: 'jumpstream'
  }
});

export const mockBeatmapCompleteShortTechnical: BeatmapCompleteShort = createMockBeatmapCompleteShort({
  beatmap: {
    id: 3,
    osu_id: 3,
    difficulty: 'Hard',
    difficulty_rating: 7.5,
    mode: 0,
    status: 'ranked'
  },
  msd: {
    id: 3,
    overall: 25.5,
    main_pattern: 'technical'
  }
});

export const mockBeatmapCompleteShortWithArrayPattern: BeatmapCompleteShort = createMockBeatmapCompleteShort({
  beatmap: {
    id: 4,
    osu_id: 4,
    difficulty: 'Insane',
    difficulty_rating: 9.0,
    mode: 0,
    status: 'ranked'
  },
  msd: {
    id: 4,
    overall: 30.0,
    main_pattern: '["stream", "jumpstream"]'
  }
});

export const mockBeatmapCompleteShortWithJSONPattern: BeatmapCompleteShort = createMockBeatmapCompleteShort({
  beatmap: {
    id: 5,
    osu_id: 5,
    difficulty: 'Expert',
    difficulty_rating: 10.0,
    mode: 0,
    status: 'ranked'
  },
  msd: {
    id: 5,
    overall: 35.0,
    main_pattern: '["technical", "chordjack"]'
  }
});

export const mockBeatmapCompleteShortWithoutPattern: BeatmapCompleteShort = createMockBeatmapCompleteShort({
  beatmap: {
    id: 6,
    osu_id: 6,
    difficulty: 'Normal',
    difficulty_rating: 5.0,
    mode: 0,
    status: 'ranked'
  },
  msd: {
    id: 6,
    overall: 20.0,
    main_pattern: undefined
  }
});

// Array of beatmaps for testing lists
export const mockBeatmapCompleteShortArray: BeatmapCompleteShort[] = [
  mockBeatmapCompleteShortStream,
  mockBeatmapCompleteShortJumpstream,
  mockBeatmapCompleteShortTechnical
];

export const mockBeatmapCompleteShortArrayWithVariations: BeatmapCompleteShort[] = [
  mockBeatmapCompleteShortStream,
  mockBeatmapCompleteShortJumpstream,
  mockBeatmapCompleteShortTechnical,
  mockBeatmapCompleteShortWithArrayPattern,
  mockBeatmapCompleteShortWithJSONPattern,
  mockBeatmapCompleteShortWithoutPattern
];

