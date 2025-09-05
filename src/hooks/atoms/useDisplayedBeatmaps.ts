import { useMemo } from "react";
import type { BeatmapCompleteShort } from "@/types/beatmap/short";

export const useDisplayedBeatmaps = (beatmaps: BeatmapCompleteShort[], maxDisplayed: number = 5) => {
  return useMemo(() => ({
    displayedMaps: beatmaps.slice(0, maxDisplayed),
    remainingCount: Math.max(0, beatmaps.length - maxDisplayed)
  }), [beatmaps, maxDisplayed]);
};
