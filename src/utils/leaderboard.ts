import type { Score } from '@/types/leaderboard';

export const formatAccuracy = (accuracy: string): string => {
  return `${parseFloat(accuracy).toFixed(2)}%`;
};

export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const getRankColor = (rank: string): string => {
  switch (rank) {
    case 'X':
    case 'SS':
      return 'text-yellow-400';
    case 'S':
      return 'text-green-400';
    case 'A':
      return 'text-blue-400';
    case 'B':
      return 'text-orange-400';
    case 'C':
      return 'text-red-400';
    case 'D':
      return 'text-gray-400';
    default:
      return 'text-base-content';
  }
};

// Hit colors constants
export const HIT_COLORS = {
  MARVELOUS: 'text-sky-400', // 300g - Bleu ciel
  PERFECT: 'text-yellow-400', // 300 - Jaune
  GREAT: 'text-green-500', // 200 - Vert
  GOOD: 'text-blue-700', // 100 - Bleu foncé
  BAD: 'text-pink-400', // 50 - Rose
  MISS: 'text-red-500', // 0 - Rouge
} as const;

export const getHitColor = (hitType: string): string => {
  switch (hitType) {
    case 'geki':
      return HIT_COLORS.MARVELOUS;
    case '300':
      return HIT_COLORS.PERFECT;
    case 'katu':
      return HIT_COLORS.GREAT;
    case '100':
      return HIT_COLORS.GOOD;
    case '50':
      return HIT_COLORS.BAD;
    case 'miss':
      return HIT_COLORS.MISS;
    default:
      return 'text-gray-600';
  }
};

export const sortScoresByRank = (scores: Score[]): Score[] => {
  return [...scores].sort((a, b) => {
    // Sort by score descending, then by accuracy descending, then by date ascending
    if (a.performance.accuracy !== b.performance.accuracy) {
      return parseFloat(b.performance.accuracy) - parseFloat(a.performance.accuracy);
    }
    if (a.performance.score !== b.performance.score) {
      return b.performance.score - a.performance.score;
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
};
