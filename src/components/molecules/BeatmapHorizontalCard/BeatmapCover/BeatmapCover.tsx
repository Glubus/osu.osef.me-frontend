import React from "react";
import { Image } from "@/components/atoms/Image/Image";
import type { BeatmapsetCompleteShort } from "@/types/beatmap/short";

export type BeatmapCoverProps = {
  beatmapset: BeatmapsetCompleteShort;
  className?: string;
};

const BeatmapCover: React.FC<BeatmapCoverProps> = ({ beatmapset, className }) => {
  if (!beatmapset.beatmapset) return null;

  return (
    <div className={`absolute inset-0 ${className || ''}`}>
      <Image
        src={beatmapset.beatmapset.cover_url || "/default-cover.jpg"}
        alt={`${beatmapset.beatmapset.artist || "Unknown Artist"} - ${beatmapset.beatmapset.title || "Unknown Title"}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
};

export default BeatmapCover;
