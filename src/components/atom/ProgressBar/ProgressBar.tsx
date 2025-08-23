import type React from "react";

interface ProgressBarProps {
	progress: number; // 0 - 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
	return (
		<div className="w-full bg-base-300 rounded-full h-2">
			<div
				className="bg-primary h-2 rounded-full transition-[width] duration-200"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
};

export default ProgressBar;
