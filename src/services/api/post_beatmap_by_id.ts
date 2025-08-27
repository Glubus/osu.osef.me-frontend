// services/api/post_beatmap_by_id.ts
import axios from "axios";
import { API_BASE_URL } from "@/types/global";

export interface PostBeatmapByIdRequest {
  id: number;
}

export interface PostBeatmapByIdResponse {
  message: string;
  status: string;
}

export async function postBeatmapById(id: number): Promise<PostBeatmapByIdResponse> {
  const res = await axios.post<PostBeatmapByIdResponse>(`${API_BASE_URL}/api/beatmap/by_osu_id`, {
    id
  });
  console.log(res.data);
  return res.data;
}
