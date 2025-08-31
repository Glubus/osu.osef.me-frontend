// services/api/get_beatmapset.ts
import type { BeatmapByIdExtendedResponse } from "@/types/beatmap/extended";
import { api } from "./client";
import { createLogger } from "@/utils/logger";

const logger = createLogger('API:Beatmapset');

/**
 * Fetches a complete beatmapset by its ID
 * @param id The ID of the beatmapset to fetch
 * @returns A promise containing the complete beatmapset data
 */
export async function getBeatmapsetById(id: string): Promise<BeatmapByIdExtendedResponse> {
  logger.debug('Fetching beatmapset by ID', { id });
  
  return api.get<BeatmapByIdExtendedResponse>(`/api/beatmapset/${id}`);
}
