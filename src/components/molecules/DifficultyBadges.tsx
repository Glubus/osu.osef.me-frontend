import React from "react";
import type { BeatmapCompleteExtended } from "@/types/beatmap/extended";
import Badge from "@/components/atoms/Badge/Badge";
import { getRatingColor } from "@/utils/getRatingColor";

interface DifficultyBadgesProps {
	beatmaps: BeatmapCompleteExtended[];
	currentBeatmapId?: string;
	onDifficultyClick?: (beatmapOsuId: number) => void;
}

const DifficultyBadges: React.FC<DifficultyBadgesProps> = ({
	beatmaps,
	currentBeatmapId,
	onDifficultyClick
}) => {
	return (
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
	);
};

export default DifficultyBadges;
