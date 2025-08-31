import { CATBOY_API_BASE_URL } from "@/types/global";
import axios from "axios";
import { createLogger } from "@/utils/logger";
import { normalizeError } from "@/utils/errorHandler";

const logger = createLogger('API:OsuFile');

/**
 * Fetches the .osu file of a beatmap from the Catboy API
 * Note: Uses a different external API, so doesn't use the centralized client
 * @param beatmapId The ID of the beatmap to fetch the .osu file for
 * @returns A promise containing the .osu file content
 */
export async function fetchOsuFile(beatmapId: number): Promise<string> {
  logger.debug('Fetching .osu file', { beatmapId });
  
  try {
    const response = await axios.get(`${CATBOY_API_BASE_URL}/osu/${beatmapId}`, {
      headers: {
        Accept: "text/plain",
      },
      timeout: 10000, // 10 seconds timeout
    });
    
    logger.debug('Successfully fetched .osu file', { beatmapId, size: response.data.length });
    return response.data;
  } catch (error) {
    const normalizedError = normalizeError(error, 'OsuFile');
    logger.error('Failed to fetch .osu file', { beatmapId, error: normalizedError });
    throw normalizedError;
  }
}