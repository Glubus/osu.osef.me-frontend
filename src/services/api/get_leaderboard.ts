import type { Score } from "@/types/leaderboard";
import { api } from "./client";

export async function getLeaderboard(beatmapId: string, rate: number): Promise<Score[]> {
    return await api.get<Score[]>(`/api/scores/beatmap/${beatmapId}/${rate}`);
}