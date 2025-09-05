import React from "react";
import { Badge, PatternBadge } from "@/components/atoms";
import DifficultyBadge from "@/components/atoms/Badge/DifficultyBadge/DifficultyBadge";
import type { BeatmapCompleteShort } from "@/types/beatmap/short";

export type BeatmapBadgesProps = {
  displayedMaps: BeatmapCompleteShort[];
  remainingCount: number;
  uniquePatterns: string[];
  className?: string;
};

const BeatmapBadges: React.FC<BeatmapBadgesProps> = ({ 
  displayedMaps, 
  remainingCount, 
  uniquePatterns, 
  className 
}) => {
  return (
    <div className={`flex justify-between items-start ${className || ''}`}>
      {/* Bubbles pour chaque beatmap - à gauche */}
      <div className="flex gap-2">
        {displayedMaps.map((m, i) => {
          const overall = Number(m.msd?.overall ?? 0);
          return (
            <DifficultyBadge
              key={i}
              rating={overall}
              difficulty={m.beatmap.difficulty}
            />
          );
        })}
        {remainingCount > 0 && (
          <Badge color="gray" title={`${remainingCount} difficultés supplémentaires`}>
            +{remainingCount}
          </Badge>
        )}
      </div>

      {/* Patterns badges - à droite */}
      {uniquePatterns.length > 0 && (
        <div className="flex gap-1">
          {uniquePatterns.map((pattern, i) => (
            <PatternBadge
              key={i}
              pattern={pattern}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BeatmapBadges;
