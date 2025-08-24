import type React from "react";
import Badge from "../../../atom/Badge/Badge";
import { getRatingColorClass, truncateDifficulty } from "../../../../types/beatmap";
import PatternBadges from "../PatternBadges/PatternBadges";
import "./BeatmapHeaderInfo.module.css";

type Props = {
	overall: string;
	difficulty: string;
	mainPattern?: string;
};

const getOverallColor = (overall: string) => {
	const num = parseFloat(overall);
	return getRatingColorClass(num);
};

const BeatmapHeaderInfo: React.FC<Props> = ({ overall, difficulty, mainPattern }) => (
	<div className="flex justify-between items-start">
		<div className="flex flex-col gap-2">
			{mainPattern && <PatternBadges mainPattern={mainPattern} />}
			<div className="flex flex-wrap gap-1">
				<Badge color={getOverallColor(overall)}>{overall}★</Badge>
			</div>
		</div>
		<div className="text-right">
			<div className="text-sm font-semibold text-primary-content">
				{truncateDifficulty(difficulty)}
			</div>
		</div>
	</div>
);

export default BeatmapHeaderInfo;
