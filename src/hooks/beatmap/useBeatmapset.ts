import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getBeatmapsetById } from "@/services/api/get_beatmapset";
import { postBeatmapById } from "@/services/api/post_beatmap_by_id";
import type { BeatmapsetCompleteExtended } from "@/types/beatmap/extended";

export const useBeatmapset = (beatmapsetId: string | undefined, beatmapId: string | undefined) => {
  const navigate = useNavigate();
  const [data, setData] = useState<BeatmapsetCompleteExtended | null>(null);
  const [lastBeatmapsetId, setLastBeatmapsetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch beatmapset data
  useEffect(() => {
    async function run() {
      if (!beatmapsetId) return;
      
      // Avoid refetching if only beatmap changes in same beatmapset
      if (lastBeatmapsetId === beatmapsetId) return;
      
      try {
        const res = await getBeatmapsetById(beatmapsetId);
        setData(res.beatmap);
        setLastBeatmapsetId(beatmapsetId);
        setError(null);
        
        // If beatmapset is null and we have a beatmapId, make POST call
        if (!res.beatmap.beatmapset?.id && beatmapId) {
          try {
            const postRes = await postBeatmapById(Number(beatmapId));
            if (postRes.status === "200") {
              window.location.reload();
            } else {
              setError(`Erreur: ${postRes.message}`);
            }
          } catch (postError) {
            setError("Error adding beatmap");
          }
        }
      } catch (error) {
        setError("Error loading beatmapset");
      }
    }
    run();
  }, [beatmapsetId, lastBeatmapsetId, beatmapId]);

  // Get current beatmap
  const currentBeatmap = useMemo(() => {
    if (!data || !beatmapId) return null;
    return data.beatmap.find(b => String(b.beatmap?.osu_id) === String(beatmapId)) || null;
  }, [data, beatmapId]);

  // Sort beatmaps by difficulty (using 1.0x rate)
  const sortedBeatmaps = useMemo(() => {
    if (!data) return [];
    return [...data.beatmap].sort((a, b) => {
      const aMSD10 = a.msd?.find(msd => Number(msd.rate) === 1.0);
      const bMSD10 = b.msd?.find(msd => Number(msd.rate) === 1.0);
      const aOverall = Number(aMSD10?.overall ?? a.msd?.[0]?.overall ?? 0);
      const bOverall = Number(bMSD10?.overall ?? b.msd?.[0]?.overall ?? 0);
      return aOverall - bOverall;
    });
  }, [data]);

  // Handle navigation to first valid beatmap
  useEffect(() => {
    if (!data || !beatmapsetId) return;
    if (!beatmapId) {
      const first = data.beatmap.find(b => b.beatmap?.osu_id && b.msd && b.msd.length > 0);
      if (first?.beatmap?.osu_id) navigate(`/beatmapsets/${beatmapsetId}/${first.beatmap.osu_id}`, { replace: true });
      return;
    }
    if (!currentBeatmap) {
      const first = data.beatmap.find(b => b.beatmap?.osu_id && b.msd && b.msd.length > 0);
      if (first?.beatmap?.osu_id) navigate(`/beatmapsets/${beatmapsetId}/${first.beatmap.osu_id}`, { replace: true });
    }
  }, [data, beatmapId, beatmapsetId, currentBeatmap, navigate]);

  return {
    data,
    currentBeatmap,
    sortedBeatmaps,
    error,
  };
};
