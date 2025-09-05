import { useMemo } from "react";
import type { BeatmapCompleteShort } from "@/types/beatmap/short";

export const useSortedBeatmaps = (beatmaps: BeatmapCompleteShort[]) => {
  return useMemo(() => 
    [...beatmaps].sort((a, b) => {
      const aOverall = Number(a.msd?.overall ?? 0);
      const bOverall = Number(b.msd?.overall ?? 0);
      return aOverall - bOverall;
    }), [beatmaps]
  );
};
