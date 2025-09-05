import React from "react";
import type { BeatmapsetCompleteShort } from "@/types/beatmap/short";
import { useBeatmapHorizontalCard } from "@/hooks/molecules/useBeatmapHorizontalCard";
import BeatmapCover from "./BeatmapCover/BeatmapCover";
import BeatmapInfo from "./BeatmapInfo/BeatmapInfo";
import BeatmapActions from "./BeatmapActions/BeatmapActions";
import BeatmapBadges from "./BeatmapBadges/BeatmapBadges";
import BeatmapFooter from "./BeatmapFooter/BeatmapFooter";

export type BeatmapCardProps = {
  beatmapset: BeatmapsetCompleteShort;
};

const BeatmapHorizontalCard: React.FC<BeatmapCardProps> = ({ beatmapset }) => {
  const {
    displayedMaps,
    remainingCount,
    uniquePatterns,
    priorityStatus,
    difficultyRange,
    handleClick,
    handleDownload
  } = useBeatmapHorizontalCard(beatmapset);

  if (!beatmapset.beatmapset || !difficultyRange) return null;

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group h-32 overflow-hidden relative"
      onClick={handleClick}
    >
      <BeatmapCover beatmapset={beatmapset} />
      <BeatmapActions 
        beatmapset={beatmapset} 
        onDownload={handleDownload} 
      />

      {/* Contenu */}
      <div className="relative h-full p-4 flex flex-col justify-between text-white">
        <BeatmapBadges
          displayedMaps={displayedMaps}
          remainingCount={remainingCount}
          uniquePatterns={uniquePatterns}
        />

        <BeatmapInfo beatmapset={beatmapset} />

        <BeatmapFooter
          priorityStatus={priorityStatus}
          minRating={difficultyRange.minRating}
          maxRating={difficultyRange.maxRating}
        />
      </div>
    </div>
  );
};

export default BeatmapHorizontalCard;
