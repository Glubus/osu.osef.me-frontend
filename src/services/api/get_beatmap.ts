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
  try {
    const response = await axios.get<BeatmapFiltersResponse>(`${API_BASE_URL}/api/beatmap`, {
        params: filters, // Les filtres sont envoyés en query string
      });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des beatmaps :", error);
    throw error;
  }
}
