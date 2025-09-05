import React from "react";
import { Image } from "@/components/atoms/Image/Image";
import Button from "@/components/atoms/Button/Button";
import Badge from "@/components/atoms/Badge/Badge";
import type { BeatmapCompleteExtended } from "@/types/beatmap/extended";
import { getRatingColor } from "@/utils/getRatingColor";
import { useDownload } from "@/hooks/useDownload";

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
  const { downloadBeatmap } = useDownload();

  const handleDownload = () => {
    downloadBeatmap(beatmapsetOsuId);
  };

  return (
    <div className="flex gap-6 mb-6">
      {/* Left side: Cover with info */}
      <div className="flex-1 relative h-64 overflow-hidden rounded-lg">
        {/* Cover Image Background */}
        <div className="absolute inset-0">
          <Image
            src={coverUrl || "/default-cover.jpg"}
            alt={`${artist || "Unknown Artist"} - ${title || "Unknown Title"}`}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6">
          {/* Difficulty badges - Top left */}
          <div className="flex flex-wrap gap-3">
            {beatmaps.map((beatmap) => {
              // Get MSD 1.0x for display
              const msd10 = beatmap.msd?.find(msd => Number(msd.rate) === 1.0);
              const overall = Number(msd10?.overall ?? beatmap.msd?.[0]?.overall ?? 0);
              const isActive = String(beatmap.beatmap?.osu_id) === String(currentBeatmapId);
              
              return (
                <div
                  key={beatmap.beatmap?.osu_id}
                  className="cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => onDifficultyClick?.(beatmap.beatmap?.osu_id || 0)}
                >
                  <Badge
                    color={getRatingColor(overall)}
                    outline={!isActive}
                    title={`${beatmap.beatmap?.difficulty || "Unknown"}: ${overall.toFixed(2)}`}
                  >
                    <span className="text-lg font-semibold">{overall.toFixed(2)}</span>
                  </Badge>
                </div>
              );
            })}
          </div>
          
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
      <div className="w-64 flex flex-col gap-3">
        <Button
          onClick={handleDownload}
          color="secondary"
          style="outline"
          size="lg"
          className="w-full"
        >
          Download
        </Button>
        {/* Future buttons can be added here */}
      </div>
    </div>
  );
};

export default BeatmapHeader;
