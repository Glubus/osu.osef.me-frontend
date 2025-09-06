import React from "react";
import type { BeatmapCompleteExtended } from "@/types/beatmap/extended";
import { useBeatmapHeader } from "@/hooks";
import BeatmapCover from "@/components/molecules/BeatmapCover";
import DifficultyBadges from "@/components/molecules/DifficultyBadges";
import BeatmapActions from "@/components/molecules/BeatmapActions";

export interface BeatmapHeaderProps {
  coverUrl?: string;
  artist?: string;
  title?: string;
  creator?: string;
  beatmapsetOsuId?: number;
  beatmaps?: BeatmapCompleteExtended[];
  currentBeatmapId?: string;
  onDifficultyClick?: (beatmapOsuId: number) => void;
}

const BeatmapHeader: React.FC<BeatmapHeaderProps> = ({
  coverUrl,
  artist,
  title,
  creator,
  beatmapsetOsuId,
  beatmaps = [],
  currentBeatmapId,
  onDifficultyClick,
}) => {
  const { handleDownload } = useBeatmapHeader();

  return (
    <div className="flex gap-6 mb-6">
      {/* Left side: Cover with info */}
      <div className="flex-1 relative h-64 overflow-hidden rounded-lg">
        <BeatmapCover coverUrl={coverUrl} artist={artist} title={title} />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          {/* Difficulty badges - Top left */}
          <DifficultyBadges
            beatmaps={beatmaps}
            currentBeatmapId={currentBeatmapId}
            onDifficultyClick={onDifficultyClick}
          />
          
          {/* Title and creator - Bottom */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {artist || "Unknown Artist"} - {title || "Unknown Title"}
            </h1>
            <p className="text-lg text-gray-200">
              by {creator || "Unknown Creator"}
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Action buttons */}
      <BeatmapActions onDownload={() => handleDownload(beatmapsetOsuId)} />
    </div>
  );
};

export default BeatmapHeader;
