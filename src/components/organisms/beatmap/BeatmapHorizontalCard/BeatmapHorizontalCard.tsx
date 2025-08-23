import type React from "react";
import type { BeatmapCardProps } from "../../../../types/beatmap";
import { getRatingColorClass } from "../../../../types/beatmap";
import Image from "../../../atom/Image/Image";
import Badge from "../../../atom/Badge/Badge";

const BeatmapHorizontalCard: React.FC<BeatmapCardProps> = ({
	beatmap,
	onClick,
}) => {
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

	// Vérification de sécurité pour beatmapset null
	if (!beatmapset) {
		return (
			<div className="card bg-base-100 shadow-xl h-32 overflow-hidden">
				<div className="h-full p-4 flex flex-col justify-center items-center text-center">
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
			className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group h-32 overflow-hidden"
			onClick={handleClick}
		>
			{/* Image de couverture en arrière-plan */}
			<div className="absolute inset-0">
				<Image
					src={beatmapset.cover_url || "/default-cover.jpg"}
					alt={`${beatmapset.artist || "Unknown Artist"} - ${beatmapset.title || "Unknown Title"}`}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
				/>
				<div className="absolute inset-0 bg-black/70" />
			</div>

			{/* Contenu par-dessus l'image */}
			<div className="relative h-full p-4 flex flex-col justify-between text-white">
				{/* En-tête avec rating et difficulté */}
				<div className="flex justify-between items-start">
					<div className="flex flex-wrap gap-2">
						<Badge color={getOverallColor(msd.overall)}>{msd.overall}★</Badge>
					</div>
					<div className="text-right">
						<div className="text-sm font-semibold text-primary-content">
							{map.difficulty}
						</div>
					</div>
				</div>

				{/* Informations principales */}
				<div className="flex-1 flex flex-col justify-center">
					<h3 className="text-lg font-bold mb-1 line-clamp-1">
						{beatmapset.artist || "Unknown Artist"} -{" "}
						{beatmapset.title || "Unknown Title"}
					</h3>
					<p className="text-xs text-base-content/80">
						by {beatmapset.creator || "Unknown Creator"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default BeatmapHorizontalCard;
