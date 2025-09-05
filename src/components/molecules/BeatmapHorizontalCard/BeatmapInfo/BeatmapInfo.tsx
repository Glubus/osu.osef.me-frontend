import React from "react";
import type { BeatmapsetCompleteShort } from "@/types/beatmap/short";

export type BeatmapInfoProps = {
  beatmapset: BeatmapsetCompleteShort;
  className?: string;
};

const BeatmapInfo: React.FC<BeatmapInfoProps> = ({ beatmapset, className }) => {
  if (!beatmapset.beatmapset) return null;

  return (
    <div className={`flex-1 flex flex-col justify-center mt-2 ${className || ''}`}>
      <h3 className="text-lg font-bold mb-1 line-clamp-1">
        {beatmapset.beatmapset.artist || "Unknown Artist"} - {beatmapset.beatmapset.title || "Unknown Title"}
      </h3>
      <p className="text-xs text-base-content/80">
        by {beatmapset.beatmapset.creator || "Unknown Creator"}
      </p>
    </div>
  );
};

export default BeatmapInfo;
