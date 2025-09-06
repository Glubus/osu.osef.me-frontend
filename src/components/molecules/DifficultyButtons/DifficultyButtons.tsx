import React from "react";
import { useNavigate } from "react-router-dom";
import type { BeatmapCompleteExtended } from "@/types/beatmap/extended";
import Badge from "@/components/atoms/Badge/Badge";
import { getRatingColor } from "@/utils/getRatingColor";

export interface DifficultyButtonsProps {
  beatmaps: BeatmapCompleteExtended[];
  currentBeatmapId: string;
  beatmapsetId: string;
}

const DifficultyButtons: React.FC<DifficultyButtonsProps> = ({
  beatmaps,
  currentBeatmapId,
  beatmapsetId,
}) => {
  const navigate = useNavigate();

  const handleDifficultyClick = (beatmapOsuId: number | undefined) => {
    if (beatmapOsuId) {
      navigate(`/beatmapsets/${beatmapsetId}/${beatmapOsuId}`);
    }
  };

  return (
    <div className="mb-6">
             <h2 className="text-lg font-semibold mb-3">Difficulties:</h2>
      <div className="flex flex-wrap gap-2">
        {beatmaps.map((beatmap) => {
          // Get MSD 1.0x for display, otherwise take first
          const msd10 = beatmap.msd?.find(msd => Number(msd.rate) === 1.0);
          const overall = Number(msd10?.overall ?? beatmap.msd?.[0]?.overall ?? 0);
          const isActive = String(beatmap.beatmap?.osu_id) === String(currentBeatmapId);
          
          return (
            <button
              key={beatmap.beatmap?.osu_id}
              onClick={() => handleDifficultyClick(beatmap.beatmap?.osu_id)}
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Badge color={getRatingColor(overall)} outline={!isActive}>
                  {overall.toFixed(2)}
                </Badge>
                <span>{beatmap.beatmap?.difficulty}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultyButtons;
