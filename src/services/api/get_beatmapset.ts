// services/api/get_beatmapset.ts
import axios from "axios";
import { API_BASE_URL } from "@/types/global";
import type { BeatmapByIdExtendedResponse } from "@/types/beatmap/extended";

export async function getBeatmapsetById(id: string): Promise<BeatmapByIdExtendedResponse> {
  const res = await axios.get<BeatmapByIdExtendedResponse>(`${API_BASE_URL}/api/beatmapset/${id}`);
  console.log(res.data);
  return res.data;
}
