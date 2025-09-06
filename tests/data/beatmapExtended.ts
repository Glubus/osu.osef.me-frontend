import type { BeatmapExtended } from '../../src/types/beatmap/extended';

export const createMockBeatmapExtended = (overrides: Partial<BeatmapExtended> = {}): BeatmapExtended => ({
  id: 1,
  osu_id: 12345,
  beatmapset_id: 67890,
  difficulty: 'Normal',
  difficulty_rating: 5.0,
  count_circles: 100,
  count_sliders: 50,
  count_spinners: 2,
  max_combo: 500,
  drain_time: 120000,
  total_time: 125000,
  bpm: 180,
  cs: 4,
  ar: 8,
  od: 8,
  hp: 6,
  mode: 0,
  status: 'ranked',
  file_md5: 'abc123def456',
  file_path: '/path/to/file.osu',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  ...overrides
});

export const mockBeatmapExtendedEasy: BeatmapExtended = createMockBeatmapExtended({
  id: 1,
  osu_id: 1,
  difficulty: 'Easy',
  difficulty_rating: 2.5
});

export const mockBeatmapExtendedNormal: BeatmapExtended = createMockBeatmapExtended({
  id: 2,
  osu_id: 2,
  difficulty: 'Normal',
  difficulty_rating: 5.0
});

export const mockBeatmapExtendedHard: BeatmapExtended = createMockBeatmapExtended({
  id: 3,
  osu_id: 3,
  difficulty: 'Hard',
  difficulty_rating: 7.5
});

export const mockBeatmapExtendedInsane: BeatmapExtended = createMockBeatmapExtended({
  id: 4,
  osu_id: 4,
  difficulty: 'Insane',
  difficulty_rating: 9.0
});

export const mockBeatmapExtendedExpert: BeatmapExtended = createMockBeatmapExtended({
  id: 5,
  osu_id: 5,
  difficulty: 'Expert',
  difficulty_rating: 10.0
});
