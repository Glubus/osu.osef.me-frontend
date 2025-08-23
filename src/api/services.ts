import axios from "axios";
import type {
	BeatmapFiltersResponse,
	BeatmapFilters,
	BeatmapsetCompleteExtended,
} from "../types/beatmap";

const API_BASE_URL = "https://api.osef.me/api";

// Instance axios avec configuration de base
const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Type étendu pour les paramètres de requête incluant la pagination
type QueryParams = BeatmapFilters & {
	page?: number;
	per_page?: number;
};

// Fonction utilitaire pour construire les paramètres de requête
const buildQueryParams = (filters: QueryParams): string => {
	const params = new URLSearchParams();

	Object.entries(filters).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			params.append(key, value.toString());
		}
	});

	return params.toString();
};

// Service pour les beatmaps
export const beatmapService = {
	// Récupérer les beatmaps avec filtres et pagination
	getBeatmaps: async (
		filters: BeatmapFilters = {},
		page: number = 1,
		perPage: number = 30,
	): Promise<BeatmapFiltersResponse> => {
		try {
			const queryParams = buildQueryParams({
				...filters,
				page,
				per_page: perPage,
			});
			const url = `/beatmap/filters${queryParams ? `?${queryParams}` : ""}`;

			console.log("🔍 API Request URL:", url);
			const response = await apiClient.get(url);
			console.log("📦 API Response:", response.data);
			return response.data;
		} catch (error) {
			console.error("❌ Erreur lors de la récupération des beatmaps:", error);
			throw error;
		}
	},

	// Récupérer une beatmap par ID (pour la page de détail)
	getBeatmapById: async (id: number) => {
		try {
			const response = await apiClient.get(`/beatmap/${id}`);
			return response.data;
		} catch (error) {
			console.error(
				`Erreur lors de la récupération de la beatmap ${id}:`,
				error,
			);
			throw error;
		}
	},

	// Nouvelle méthode pour récupérer un beatmapset complet avec toutes ses beatmaps
	getBeatmapsetById: async (
		beatmapsetOsuId: number,
	): Promise<BeatmapsetCompleteExtended> => {
		try {
			const url = `/beatmapset/${beatmapsetOsuId}`;

			console.log("🔍 Beatmapset API Request URL:", url);
			const response = await apiClient.get(url);
			console.log("📦 Beatmapset API Response:", response.data);
			return response.data;
		} catch (error) {
			console.error(
				`❌ Erreur lors de la récupération du beatmapset ${beatmapsetOsuId}:`,
				error,
			);
			throw error;
		}
	},

	// Récupérer la première page avec paramètres par défaut
	getDefaultBeatmaps: async (): Promise<BeatmapFiltersResponse> => {
		return beatmapService.getBeatmaps({}, 1, 30);
	},

	// Recherche simple par terme
	searchBeatmaps: async (
		searchTerm: string,
		page: number = 1,
	): Promise<BeatmapFiltersResponse> => {
		return beatmapService.getBeatmaps(
			{
				search_term: searchTerm,
			},
			page,
			30,
		);
	},

	// Filtrage par difficulté
	getBeatmapsByDifficulty: async (
		overallMin: number,
		overallMax: number,
		page: number = 1,
	): Promise<BeatmapFiltersResponse> => {
		return beatmapService.getBeatmaps(
			{
				overall_min: overallMin,
				overall_max: overallMax,
			},
			page,
			30,
		);
	},

	// Filtrage par pattern
	getBeatmapsByPattern: async (
		pattern: string,
		patternMin: number,
		patternMax: number,
		page: number = 1,
	): Promise<BeatmapFiltersResponse> => {
		return beatmapService.getBeatmaps(
			{
				selected_pattern: pattern,
				pattern_min: patternMin,
				pattern_max: patternMax,
			},
			page,
			30,
		);
	},

	// Récupérer le fichier .osu d'une beatmap
	getOsuFile: async (beatmapId: number): Promise<string> => {
		try {
			const response = await apiClient.get(`/beatmap/${beatmapId}/osu`, {
				headers: {
					Accept: "text/plain",
				},
			});
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la récupération du fichier .osu:", error);
			throw error;
		}
	},
};

// Export par défaut pour faciliter l'import
export default beatmapService;
