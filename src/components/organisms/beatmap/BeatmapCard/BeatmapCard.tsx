import type React from "react";
import type { BeatmapCardProps } from "../../../../types/beatmap";
import Image from "../../../atom/Image/Image";
import BeatmapHeaderInfo from "../../../molecules/beatmap/BeatmapHeaderInfo/BeatmapHeaderInfo";
import BeatmapFooterInfo from "../../../molecules/beatmap/BeatmapFooterInfo/BeatmapFooterInfo";

const BeatmapCard: React.FC<BeatmapCardProps> = ({ beatmap, onClick }) => {
	const { beatmap: map, beatmapset, msd } = beatmap;

	const handleClick = () => {
		if (onClick) {
			onClick(beatmap);
		}
	};

	// Vérification de sécurité pour beatmapset null
	if (!beatmapset) {
		return (
			<div className="card bg-base-100 shadow-xl h-64 overflow-hidden">
				<div className="h-full flex flex-col justify-center items-center text-center p-4">
					<div className="text-6xl mb-2">😵</div>
					<p className="text-sm text-base-content/60">
						Beatmapset non disponible
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
			onClick={handleClick}
		>
			<figure className="relative h-64 overflow-hidden">
				<Image
					src={beatmapset.cover_url || "/default-cover.jpg"}
					alt={`${beatmapset.artist || "Unknown Artist"} - ${beatmapset.title || "Unknown Title"}`}
					className="group-hover:scale-105 transition-transform duration-300"
				/>

				<div className="absolute inset-0 bg-black/70" />

				<div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
					<BeatmapHeaderInfo
						overall={msd.overall}
						difficulty={map.difficulty}
						mainPattern={msd.main_pattern}
					/>
					<BeatmapFooterInfo
						artist={beatmapset.artist || "Unknown Artist"}
						title={beatmapset.title || "Unknown Title"}
						creator={beatmapset.creator || "Unknown Creator"}
					/>
				</div>
			</figure>
		</div>
	);
};

export default BeatmapCard;
