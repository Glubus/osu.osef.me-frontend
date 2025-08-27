import { useEffect, useState } from "react";
import { getBeatmaps } from "@/services/api/get_beatmap";
import type { BeatmapsetCompleteShort } from "@/types/beatmap/short";
import type { Filters } from "@/types/beatmap/short";

export const useBeatmapList = (filters: Filters) => {
  const [beatmaps, setBeatmaps] = useState<BeatmapsetCompleteShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBeatmaps = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBeatmaps(filters);
        setBeatmaps(data.beatmaps);
      } catch (err) {
        setError("Error loading beatmaps");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBeatmaps();
  }, [filters]);

  return {
    beatmaps,
    loading,
    error,
  };
};
