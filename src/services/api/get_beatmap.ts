// services/api/get_beatmap.ts
import axios from "axios";
import type { Filters, BeatmapFiltersResponse, BeatmapRandomResponse } from "@/types/beatmap/short";
import { API_BASE_URL } from "@/types/global";

/**
 * Récupère les beatmaps depuis l'API avec les filtres donnés
 * @param filters Filtres optionnels pour la recherche
 * @returns Une promesse contenant les beatmaps filtrés
 */
export async function getBeatmaps(filters: Filters): Promise<BeatmapFiltersResponse> {
  const debugLog = (message: string, data?: any) => {
    console.log(`[API getBeatmaps] ${message}`, data || '');
  };

  try {
    debugLog('Making API request with filters:', filters);
    
    console.log('URL',`${API_BASE_URL}/api/beatmap`);
    console.log('filters', filters);
    const response = await axios.get<BeatmapFiltersResponse>(`${API_BASE_URL}/api/beatmap`, {
        params: filters, // Les filtres sont envoyés en query string
        timeout: 10000, // 10 secondes timeout
      });
    console.log('response.data', response.data);
    
    return response.data;
  } catch (error: any) {
    debugLog('API request failed:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - server took too long to respond');
    }
    
    if (error.response) {
      // Server responded with error status
      throw new Error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error - unable to reach the server');
    } else {
      // Other error
      throw new Error(`Request error: ${error.message}`);
    }
  }
}

/**
 * Récupère des beatmaps aléatoires depuis l'API avec les filtres donnés
 * @param filters Filtres optionnels pour la recherche (sans pagination)
 * @returns Une promesse contenant les beatmaps aléatoires
 */
export async function getRandomBeatmaps(filters: Omit<Filters, 'page' | 'per_page'>): Promise<BeatmapRandomResponse> {
  const debugLog = (message: string, data?: any) => {
    console.log(`[API getRandomBeatmaps] ${message}`, data || '');
  };

  try {
    debugLog('Making random API request with filters:', filters);
    
    console.log('URL',`${API_BASE_URL}/api/beatmap/random`);
    console.log('filters', filters);
    const response = await axios.get<BeatmapRandomResponse>(`${API_BASE_URL}/api/beatmap/random`, {
        params: filters, // Les filtres sont envoyés en query string
        timeout: 10000, // 10 secondes timeout
      });
    console.log('response.data', response.data);
    
    return response.data;
  } catch (error: any) {
    debugLog('Random API request failed:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - server took too long to respond');
    }
    
    if (error.response) {
      // Server responded with error status
      throw new Error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error - unable to reach the server');
    } else {
      // Other error
      throw new Error(`Request error: ${error.message}`);
    }
  }
}
