// services/api/get_beatmap.ts
import axios from "axios";
import type { Filters, BeatmapFiltersResponse } from "@/types/beatmap/short";
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
