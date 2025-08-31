// services/api/get_beatmap_count.ts
import axios from "axios";
import type { BeatmapCountResponse } from "@/types/beatmap/count";
import { API_BASE_URL } from "@/types/global";

/**
 * Récupère les statistiques de comptage de beatmaps depuis l'API
 * @returns Une promesse contenant les statistiques de beatmaps
 */
export async function getBeatmapCount(): Promise<BeatmapCountResponse> {
  const debugLog = (message: string, data?: any) => {
    console.log(`[API getBeatmapCount] ${message}`, data || '');
  };

  try {
    debugLog('Making API request to get beatmap count');
    
    console.log('URL', `${API_BASE_URL}/api/beatmap/count`);
    const response = await axios.get<BeatmapCountResponse>(`${API_BASE_URL}/api/beatmap/count`, {
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
