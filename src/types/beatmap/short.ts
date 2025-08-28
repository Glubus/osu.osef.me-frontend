// types/beatmap/short.ts

// ---------- Types pour les filtres ----------
export interface Filters {
    search_term?: string;
    overall_min?: number;
    overall_max?: number;
    selected_pattern?: string;
    pattern_min?: number;
    pattern_max?: number;
    page?: number;
    per_page?: number;
  }
  
  // ---------- Types pour la réponse ----------
  export interface BeatmapFiltersResponse {
    beatmaps: BeatmapsetCompleteShort[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  }

  // ---------- Types pour la réponse aléatoire ----------
  export interface BeatmapRandomResponse {
    beatmaps: BeatmapsetCompleteShort[];
    count: number;
  }
  
  // ---------- Beatmapset complet court ----------
  export interface BeatmapsetCompleteShort {
    beatmapset?: BeatmapsetShort;
    beatmap: BeatmapCompleteShort[];
  }
  
  // ---------- Beatmapset court ----------
  export interface BeatmapsetShort {
    id?: number;
    osu_id?: number;
    artist: string;
    title: string;
    creator: string;
    cover_url?: string;
  }

  export interface BeatmapCompleteShort {
    beatmap: BeatmapShort;
    msd: MSDShort;
  }
  
  // ---------- Beatmap complet court ----------
  export interface BeatmapShort {
    id?: number;
    osu_id?: number;
    difficulty: string;
    difficulty_rating: number;
    mode: number;
    status: string;
  }
  
  // ---------- MSD court (si besoin) ----------
  export interface MSDShort {
    id?: number;
    overall?: number;
    main_pattern?: string;
  }
  