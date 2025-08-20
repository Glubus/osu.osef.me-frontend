export interface Beatmap {
  id: number;
  osu_id: number;
  difficulty: string;
  difficulty_rating: string;
  mode: number;
  status: string;
}

export interface Beatmapset {
  id: number;
  osu_id: number;
  artist: string;
  title: string;
  creator: string;
  cover_url: string;
}

export interface MSD {
  id: number;
  overall: string;
}

export interface BeatmapWithDetails {
  beatmap: Beatmap;
  beatmapset: Beatmapset;
  msd: MSD;
}

export interface BeatmapFiltersResponse {
  beatmaps: BeatmapWithDetails[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface BeatmapFilters {
  search_term?: string;
  overall_min?: number;
  overall_max?: number;
  selected_pattern?: string;
  pattern_min?: number;
  pattern_max?: number;
}

export interface BeatmapCardProps {
  beatmap: BeatmapWithDetails;
  onClick?: (beatmap: BeatmapWithDetails) => void;
}

export interface BeatmapListProps {
  beatmaps: BeatmapWithDetails[];
  loading?: boolean;
  onBeatmapClick?: (beatmap: BeatmapWithDetails) => void;
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export interface AdvancedFiltersProps {
  filters: BeatmapFilters;
  onFiltersChange: (filters: BeatmapFilters) => void;
  onApplyFilters: () => void;
  loading?: boolean;
}

export interface BeatmapDetailData {
  beatmap: {
    id: number;
    osu_id: number;
    beatmapset_id: number;
    difficulty: string;
    difficulty_rating: string;
    count_circles: number;
    count_sliders: number;
    count_spinners: number;
    max_combo: number;
    drain_time: number;
    total_time: number;
    bpm: string;
    cs: string;
    ar: string;
    od: string;
    hp: string;
    mode: number;
    status: string;
    file_md5: string;
    file_path: string;
    created_at: string;
    updated_at: string;
  };
  beatmapset: {
    id: number;
    osu_id: number;
    artist: string;
    artist_unicode?: string;
    title: string;
    title_unicode?: string;
    creator: string;
    source: string;
    tags: string[];
    has_video: boolean;
    has_storyboard: boolean;
    is_explicit: boolean;
    is_featured: boolean;
    cover_url: string;
    preview_url?: string;
    osu_file_url?: string;
    created_at: string;
    updated_at: string;
  };
  msd: {
    id: number;
    beatmap_id: number;
    overall: string;
    stream: string;
    jumpstream: string;
    handstream: string;
    stamina: string;
    jackspeed: string;
    chordjack: string;
    technical: string;
    rate: string;
    main_pattern: string;
    created_at: string;
    updated_at: string;
  };
}

export interface MSDDataPoint {
  name: string;
  value: number;
}

export interface NPSDataPoint {
  time: number;
  density: number;
}
