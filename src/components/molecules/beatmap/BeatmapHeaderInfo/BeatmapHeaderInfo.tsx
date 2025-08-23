import type React from "react";
import Badge from "../../../atom/Badge/Badge";
import { getRatingColorClass } from "../../../../types/beatmap";
import "./BeatmapHeaderInfo.module.css";

type Props = {
	overall: string;
	difficulty: string;
};

const getOverallColor = (overall: string) => {
	const num = parseFloat(overall);
	return getRatingColorClass(num);
};

const BeatmapHeaderInfo: React.FC<Props> = ({ overall, difficulty }) => (
	<div className="flex justify-between items-start">
		<div className="flex flex-wrap gap-1">
			<Badge color={getOverallColor(overall)}>{overall}★</Badge>
		</div>
		<div className="text-right">
			<div className="text-sm font-semibold text-primary-content">
				{difficulty}
			</div>
		</div>
	</div>
);

export default BeatmapHeaderInfo;
