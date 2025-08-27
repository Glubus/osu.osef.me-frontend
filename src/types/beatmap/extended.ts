// types/beatmap/extended.ts
export interface BeatmapByIdExtendedResponse {
  beatmap: BeatmapsetCompleteExtended;
}

export interface BeatmapsetCompleteExtended {
  beatmapset?: BeatmapsetExtended;
  beatmap: BeatmapCompleteExtended[];
}

export interface BeatmapsetExtended {
  id: number;
  osu_id?: number;
  artist: string;
  artist_unicode?: string;
  title: string;
  title_unicode?: string;
  creator: string;
  source?: string;
  tags?: string[];
  has_video: boolean;
  has_storyboard: boolean;
  is_explicit: boolean;
  is_featured: boolean;
  cover_url?: string;
  preview_url?: string;
  osu_file_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BeatmapCompleteExtended {
  beatmap?: BeatmapExtended;
  msd?: MSDExtended[];
}

export interface MSDExtended {
  id?: number;
  beatmap_id?: number;
  overall?: number;
  stream?: number;
  jumpstream?: number;
  handstream?: number;
  stamina?: number;
  jackspeed?: number;
  chordjack?: number;
  technical?: number;
  rate?: number;
  main_pattern?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BeatmapExtended {
  id: number;
  osu_id?: number;
  beatmapset_id?: number;
  difficulty: string;
  difficulty_rating: number;
  count_circles: number;
  count_sliders: number;
  count_spinners: number;
  max_combo: number;
  drain_time: number;
  total_time: number;
  bpm: number;
  cs: number;
  ar: number;
  od: number;
  hp: number;
  mode: number;
  status: string;
  file_md5: string;
  file_path: string;
  created_at?: string;
  updated_at?: string;
}
