import type { Score, User, Performance, Hits } from '../../src/types/leaderboard';

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  username: 'TestPlayer',
  ...overrides
});

export const createMockPerformance = (overrides: Partial<Performance> = {}): Performance => ({
  score: 1000000,
  accuracy: '95.50',
  max_combo: 500,
  perfect: false,
  pause_count: 0,
  ...overrides
});

export const createMockHits = (overrides: Partial<Hits> = {}): Hits => ({
  count_300: 100,
  count_100: 50,
  count_50: 10,
  count_miss: 5,
  count_katu: 20,
  count_geki: 80,
  ...overrides
});

export const createMockScore = (overrides: Partial<Score> = {}): Score => ({
  id: 1,
  user: createMockUser(),
  beatmap_id: 12345,
  rate: '1.0',
  mods: 0,
  rank: 'A',
  created_at: '2023-01-01T00:00:00Z',
  performance: createMockPerformance(),
  hits: createMockHits(),
  ...overrides
});

// Mock scores for different scenarios
export const mockScoreFirstPlace: Score = createMockScore({
  id: 1,
  user: createMockUser({ id: 1, username: 'FirstPlayer' }),
  performance: createMockPerformance({ score: 2000000, accuracy: '99.50' }),
  rank: 'SS',
  hits: createMockHits({ count_300: 200, count_miss: 0 })
});

export const mockScoreSecondPlace: Score = createMockScore({
  id: 2,
  user: createMockUser({ id: 2, username: 'SecondPlayer' }),
  performance: createMockPerformance({ score: 1800000, accuracy: '98.00' }),
  rank: 'S',
  hits: createMockHits({ count_300: 180, count_miss: 2 })
});

export const mockScoreThirdPlace: Score = createMockScore({
  id: 3,
  user: createMockUser({ id: 3, username: 'ThirdPlayer' }),
  performance: createMockPerformance({ score: 1600000, accuracy: '96.50' }),
  rank: 'A',
  hits: createMockHits({ count_300: 160, count_miss: 5 })
});

export const mockScoreWithMisses: Score = createMockScore({
  id: 4,
  user: createMockUser({ id: 4, username: 'MissPlayer' }),
  performance: createMockPerformance({ score: 800000, accuracy: '85.00' }),
  rank: 'C',
  hits: createMockHits({ 
    count_300: 80, 
    count_100: 40, 
    count_50: 20, 
    count_miss: 30,
    count_katu: 10,
    count_geki: 70
  })
});

export const mockScores: Score[] = [
  mockScoreFirstPlace,
  mockScoreSecondPlace,
  mockScoreThirdPlace,
  mockScoreWithMisses
];
