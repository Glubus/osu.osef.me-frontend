/**
 * Centralized entry point for all API services
 * Exports all API functions and utilities
 */

// Centralized API client
export { api, apiClient } from './client';

// Beatmap services
export { getBeatmaps, getRandomBeatmaps } from './get_beatmap';
export { getBeatmapCount } from './get_beatmap_count';
export { getBeatmapsetById } from './get_beatmapset';
export { postBeatmapById, type PostBeatmapByIdRequest, type PostBeatmapByIdResponse } from './post_beatmap_by_id';

// External services
export { fetchOsuFile } from './fetch_osu';

// Leaderboard services
export { getLeaderboard } from './get_leaderboard';

// Error types and utilities
export type { ApiError } from '@/types/api/errors';
export { ApiErrorCode } from '@/types/api/errors';
export { normalizeError, isApiError, createApiError } from '@/utils/errorHandler';

// Logging
export { createLogger } from '@/utils/logger';
