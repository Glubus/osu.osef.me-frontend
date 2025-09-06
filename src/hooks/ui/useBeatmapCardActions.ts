import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDownload } from "@/hooks";
import type { BeatmapsetCompleteShort, BeatmapCompleteShort } from "@/types/beatmap/short";

export const useBeatmapCardActions = (beatmapset: BeatmapsetCompleteShort, sortedMaps: BeatmapCompleteShort[]) => {
  const navigate = useNavigate();
  const { downloadBeatmap } = useDownload();

  // Memoize click handler
  const handleClick = useCallback(() => {
    if (!beatmapset.beatmapset?.osu_id) return;
    
    const firstMap = sortedMaps.find(m => m.beatmap?.osu_id);
    if (firstMap?.beatmap?.osu_id) {
      navigate(`/beatmapsets/${beatmapset.beatmapset.osu_id}/${firstMap.beatmap.osu_id}`);
    }
  }, [beatmapset.beatmapset?.osu_id, sortedMaps, navigate]);

  // Memoize download handler
  const handleDownload = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la navigation
    downloadBeatmap(beatmapset.beatmapset?.osu_id);
  }, [downloadBeatmap, beatmapset.beatmapset?.osu_id]);

  return {
    handleClick,
    handleDownload
  };
};
