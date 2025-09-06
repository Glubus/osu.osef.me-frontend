import type { BeatmapCompleteExtended } from '../../src/types/beatmap/extended';
import { createMockBeatmapExtended, mockBeatmapExtendedEasy, mockBeatmapExtendedNormal, mockBeatmapExtendedHard } from './beatmapExtended';
import { createMockMSDExtended, mockMSDExtendedStream, mockMSDExtendedJumpstream, mockMSDExtendedTechnical, mockMSDExtendedMultipleRates } from './msdExtended';

export const createMockBeatmapCompleteExtended = (overrides: Partial<BeatmapCompleteExtended> = {}): BeatmapCompleteExtended => ({
  beatmap: createMockBeatmapExtended(),
  msd: [createMockMSDExtended()],
  ...overrides
});

export const mockBeatmapCompleteExtendedEasy: BeatmapCompleteExtended = {
  beatmap: mockBeatmapExtendedEasy,
  msd: [mockMSDExtendedStream]
};

export const mockBeatmapCompleteExtendedNormal: BeatmapCompleteExtended = {
  beatmap: mockBeatmapExtendedNormal,
  msd: [mockMSDExtendedJumpstream]
};

export const mockBeatmapCompleteExtendedHard: BeatmapCompleteExtended = {
  beatmap: mockBeatmapExtendedHard,
  msd: [mockMSDExtendedTechnical]
};

export const mockBeatmapCompleteExtendedWithMultipleRates: BeatmapCompleteExtended = {
  beatmap: createMockBeatmapExtended({
    id: 1,
    osu_id: 1,
    difficulty: 'Normal',
    difficulty_rating: 5.0
  }),
  msd: mockMSDExtendedMultipleRates
};

export const mockBeatmapCompleteExtendedWithoutMSD: BeatmapCompleteExtended = {
  beatmap: createMockBeatmapExtended({
    id: 1,
    osu_id: 1,
    difficulty: 'Easy',
    difficulty_rating: 2.5
  }),
  msd: undefined
};

export const mockBeatmapCompleteExtendedWithoutBeatmap: BeatmapCompleteExtended = {
  beatmap: undefined,
  msd: [createMockMSDExtended()]
};

export const mockBeatmapCompleteExtendedEmpty: BeatmapCompleteExtended = {
  beatmap: undefined,
  msd: undefined
};

// Array of beatmaps for testing lists
export const mockBeatmapCompleteExtendedArray: BeatmapCompleteExtended[] = [
  mockBeatmapCompleteExtendedEasy,
  mockBeatmapCompleteExtendedNormal,
  mockBeatmapCompleteExtendedHard
];

export const mockBeatmapCompleteExtendedArrayWithVariations: BeatmapCompleteExtended[] = [
  mockBeatmapCompleteExtendedEasy,
  mockBeatmapCompleteExtendedNormal,
  mockBeatmapCompleteExtendedHard,
  mockBeatmapCompleteExtendedWithMultipleRates,
  mockBeatmapCompleteExtendedWithoutMSD
];

