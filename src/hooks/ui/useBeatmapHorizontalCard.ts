import { useSortedBeatmaps } from "./useSortedBeatmaps";
import { useDisplayedBeatmaps } from "./useDisplayedBeatmaps";
import { useBeatmapPatterns } from "./useBeatmapPatterns";
import { useBeatmapStatus } from "./useBeatmapStatus";
import { useDifficultyRange } from "./useDifficultyRange";
import { useBeatmapCardActions } from "./useBeatmapCardActions";
import type { BeatmapsetCompleteShort } from "@/types/beatmap/short";

export const useBeatmapHorizontalCard = (beatmapset: BeatmapsetCompleteShort) => {
  // Sort beatmaps by difficulty
  const sortedMaps = useSortedBeatmaps(beatmapset.beatmap);
  
  // Get displayed maps and remaining count
  const { displayedMaps, remainingCount } = useDisplayedBeatmaps(sortedMaps);
  
  // Get unique patterns
  const uniquePatterns = useBeatmapPatterns(sortedMaps);
  
  // Get priority status
  const priorityStatus = useBeatmapStatus(sortedMaps);
  
  // Get difficulty range
  const difficultyRange = useDifficultyRange(sortedMaps);
  
  // Get actions
  const { handleClick, handleDownload } = useBeatmapCardActions(beatmapset, sortedMaps);

  return {
    sortedMaps,
    displayedMaps,
    remainingCount,
    uniquePatterns,
    priorityStatus,
    difficultyRange,
    handleClick,
    handleDownload
  };
};
