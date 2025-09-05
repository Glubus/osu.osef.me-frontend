import { useMemo } from "react";
import type { BeatmapCompleteShort } from "@/types/beatmap/short";

export const useDifficultyRange = (beatmaps: BeatmapCompleteShort[]) => {
  return useMemo(() => {
    if (beatmaps.length === 0) return null;
    
    const sortedMaps = [...beatmaps].sort((a, b) => {
      const aOverall = Number(a.msd?.overall ?? 0);
      const bOverall = Number(b.msd?.overall ?? 0);
      return aOverall - bOverall;
    });
    
    const minRating = Number(sortedMaps[0].msd?.overall ?? 0);
    const maxRating = Number(sortedMaps[sortedMaps.length - 1].msd?.overall ?? 0);
    
    return { minRating, maxRating };
  }, [beatmaps]);
};
