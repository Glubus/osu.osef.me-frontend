// types/beatmap/count.ts

/**
 * Interface pour les statistiques de patterns de beatmaps
 */
export interface BeatmapPatterns {
  jumpstream: number;
  technical: number;
  chordjack: number;
  stream: number;
  stamina: number;
  jackspeed: number;
  handstream: number;
}

/**
 * Interface pour la réponse de l'API /api/beatmap/count
 */
export interface BeatmapCountResponse {
  total_beatmaps: number;
  total_beatmapsets: number;
  patterns: BeatmapPatterns;
}
