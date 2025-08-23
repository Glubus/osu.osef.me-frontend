import type React from "react";
import type { BeatmapCardProps } from "../../../../types/beatmap";
import { getRatingColorClass } from "../../../../types/beatmap";
import Image from "../../../atom/Image/Image";
import Badge from "../../../atom/Badge/Badge";

const BeatmapTableRow: React.FC<BeatmapCardProps> = ({ beatmap, onClick }) => {
	const { beatmap: map, beatmapset, msd } = beatmap;

	const handleClick = () => {
		if (onClick) {
			onClick(beatmap);
		}
	};

	const getOverallColor = (overall: string) => {
		const num = parseFloat(overall);
		return getRatingColorClass(num);
	};

	return (
		<tr
			className="hover:bg-base-200 cursor-pointer transition-colors duration-200"
			onClick={handleClick}
		>
			<td className="p-3">
				<div className="w-12 h-12 rounded overflow-hidden">
					<Image
						src={beatmapset.cover_url}
						alt={`${beatmapset.artist} - ${beatmapset.title}`}
						className="w-full h-full object-cover"
					/>
				</div>
			</td>
			<td className="p-3">
				<div className="flex flex-col">
					<div className="font-semibold text-base">
						{beatmapset.artist} - {beatmapset.title}
					</div>
					<div className="text-sm text-base-content/70">
						by {beatmapset.creator}
					</div>
				</div>
			</td>
			<td className="p-3">
				<div className="text-sm font-medium">{map.difficulty}</div>
			</td>
			<td className="p-3">
				<Badge color={getOverallColor(msd.overall)}>{msd.overall}★</Badge>
			</td>
		</tr>
	);
};

export default BeatmapTableRow;
