export interface User {
  id: number;
  username: string;
}

export interface Performance {
  score: number;
  accuracy: string;
  max_combo: number;
  perfect: boolean;
  pause_count: number;
}

export interface Hits {
  count_300: number;
  count_100: number;
  count_50: number;
  count_miss: number;
  count_katu: number;
  count_geki: number;
}

export interface Score {
  id: number;
  user: User;
  beatmap_id: number;
  rate: string;
  mods: number;
  rank: string;
  created_at: string;
  performance: Performance;
  hits: Hits;
}

export interface LeaderboardResponse {
  scores: Score[];
  total: number;
  page: number;
  per_page: number;
}
