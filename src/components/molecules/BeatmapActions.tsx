import React from "react";
import Button from "@/components/atoms/Button/Button";

interface BeatmapActionsProps {
	onDownload: () => void;
}

const BeatmapActions: React.FC<BeatmapActionsProps> = ({ onDownload }) => {
	return (
		<div className="w-64 flex flex-col gap-3">
			<Button
				onClick={onDownload}
				color="secondary"
				style="outline"
				size="lg"
				className="w-full"
			>
				Download
			</Button>
			{/* Future buttons can be added here */}
		</div>
	);
};

export default BeatmapActions;

