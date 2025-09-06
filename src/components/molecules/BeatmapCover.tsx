import React from "react";
import { Image } from "@/components/atoms/Image/Image";

interface BeatmapCoverProps {
	coverUrl?: string;
	artist?: string;
	title?: string;
}

const BeatmapCover: React.FC<BeatmapCoverProps> = ({ coverUrl, artist, title }) => {
	return (
		<div className="flex-1 relative h-64 overflow-hidden rounded-lg">
			{/* Cover Image Background */}
			<div className="absolute inset-0">
				<Image
					src={coverUrl || "/default-cover.jpg"}
					alt={`${artist || "Unknown Artist"} - ${title || "Unknown Title"}`}
					className="w-full h-full object-cover"
				/>
				{/* Dark overlay for better text readability */}
				<div className="absolute inset-0 bg-black/60" />
			</div>
		</div>
	);
};

export default BeatmapCover;
