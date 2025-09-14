// services/api/get_beatmap.ts
import type { Filters, BeatmapFiltersResponse, BeatmapRandomResponse } from "@/types/beatmap/short";
import { api } from "./client";
import { createLogger } from "@/utils/logger";

const logger = createLogger('API:Beatmap');

/**
 * Fetches beatmaps from the API with given filters
 * @param filters Optional filters for the search
 * @returns A promise containing filtered beatmaps
 */
export async function getBeatmaps(filters: Filters): Promise<BeatmapFiltersResponse> {
  logger.debug('Fetching beatmaps with filters', filters);
  
  // Construire l'URL complète pour debug
  const baseUrl = 'http://localhost:3001';
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  
  const fullUrl = `${baseUrl}/api/beatmap?${params.toString()}`;
  console.log('🔗 URL complète envoyée à l\'API:', fullUrl);
  
  return api.get<BeatmapFiltersResponse>('/api/beatmap', {
    params: filters, // Filters are sent as query string
  });
}

/**
 * Fetches random beatmaps from the API with given filters
 * @param filters Optional filters for the search (without pagination)
 * @returns A promise containing random beatmaps
 */
export async function getRandomBeatmaps(filters: Omit<Filters, 'page' | 'per_page'>): Promise<BeatmapRandomResponse> {
  logger.debug('Fetching random beatmaps with filters', filters);
  
  return api.get<BeatmapRandomResponse>('/api/beatmap/random', {
    params: filters, // Filters are sent as query string
  });
}
