// Constantes
export const DIFFICULTY_MAX_LENGTH = 40;

// Helpers
export const truncateDifficulty = (difficulty: string, maxLength: number = DIFFICULTY_MAX_LENGTH): string => {
	if (difficulty.length <= maxLength) return difficulty;
	return difficulty.substring(0, maxLength - 3) + "...";
};

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
	main_pattern: string;
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

// Nouveaux types pour la structure d'API beatmapset
export interface BeatmapsetComplete {
	id: number;
	osu_id: number;
	title: string;
	artist: string;
	creator: string;
	source: string;
	tags: string;
	status: string;
	genre_id: number;
	language_id: number;
	favourite_count: number;
	play_count: number;
	created_at: string;
	updated_at: string;
}

export interface BeatmapComplete {
	id: number;
	osu_id: number;
	beatmapset_id: number;
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
	created_at: string;
	updated_at: string;
}

export interface MSDComplete {
	id: number;
	beatmap_id: number;
	overall: number;
	stream: number;
	jumpstream: number;
	handstream: number;
	stamina: number;
	jackspeed: number;
	chordjack: number;
	technical: number;
	rate: number;
	main_pattern: string;
	created_at: string;
	updated_at: string;
}

export interface BeatmapWithMSD {
	beatmap: BeatmapComplete;
	msd: MSDComplete;
}

export interface BeatmapsetCompleteExtended {
	beatmapset: BeatmapsetComplete;
	beatmap: BeatmapWithMSD[];
}

// Fonction utilitaire pour les couleurs de rating
export const getRatingColorClass = (rating: number): string => {
	if (rating < 15) return "badge-success";
	if (rating < 25) return "badge-info";
	if (rating < 30) return "badge-warning";
	if (rating < 35) return "badge-error";
	if (rating < 40) return "badge-accent";
	return "badge-primary"; // Pour les ratings très élevés (40+)
};
