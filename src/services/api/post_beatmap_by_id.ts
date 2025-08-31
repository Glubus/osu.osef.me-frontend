// services/api/post_beatmap_by_id.ts
import { api } from "./client";
import { createLogger } from "@/utils/logger";

const logger = createLogger('API:BeatmapById');

export interface PostBeatmapByIdRequest {
  id: number;
}

export interface PostBeatmapByIdResponse {
  message: string;
  status: string;
}

/**
 * Adds a beatmap by its osu ID
 * @param id The osu ID of the beatmap to add
 * @returns A promise containing the server response
 */
export async function postBeatmapById(id: number): Promise<PostBeatmapByIdResponse> {
  logger.debug('Adding beatmap by osu ID', { id });
  
  return api.post<PostBeatmapByIdResponse>('/api/beatmap/by_osu_id', { id });
}
