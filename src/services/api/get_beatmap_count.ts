// services/api/get_beatmap_count.ts
import type { BeatmapCountResponse } from "@/types/beatmap/count";
import { api } from "./client";
import { createLogger } from "@/utils/logger";

const logger = createLogger('API:BeatmapCount');

/**
 * Fetches beatmap count statistics from the API
 * @returns A promise containing beatmap statistics
 */
export async function getBeatmapCount(): Promise<BeatmapCountResponse> {
  logger.debug('Fetching beatmap count statistics');
  
  return api.get<BeatmapCountResponse>('/api/beatmap/count');
}
