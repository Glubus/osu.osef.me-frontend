import type React from "react";
import type { BeatmapListProps } from "../../../types/beatmap";

import BeatmapHorizontalCard from "../../organisms/beatmap/BeatmapHorizontalCard/BeatmapHorizontalCard";
import SkeletonCard from "../../molecules/beatmap/SkeletonCard/SkeletonCard";
import EmptyState from "../../molecules/beatmap/EmptyState/EmptyState";

const BeatmapHorizontal: React.FC<BeatmapListProps> = ({
	beatmaps,
	loading = false,
	onBeatmapClick,
}) => {
	if (loading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{Array.from({ length: 6 }).map((_, index) => (
					<SkeletonCard key={index} />
				))}
			</div>
		);
	}

	if (beatmaps.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{beatmaps.map((beatmap) => (
				<BeatmapHorizontalCard
					key={beatmap.beatmap.id}
					beatmap={beatmap}
					onClick={onBeatmapClick}
				/>
			))}
		</div>
	);
};

export default BeatmapHorizontal;
