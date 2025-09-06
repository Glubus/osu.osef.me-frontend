import React from "react";
import Button from "@/components/atoms/Button/Button";

interface PreviewControlsProps {
	isPlaying: boolean;
	scrollSpeed: number;
	showSettings: boolean;
	onPlayPause: () => void;
	onReset: () => void;
	onToggleSettings: () => void;
	onScrollSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PreviewControls: React.FC<PreviewControlsProps> = ({
	isPlaying,
	scrollSpeed,
	showSettings,
	onPlayPause,
	onReset,
	onToggleSettings,
	onScrollSpeedChange
}) => {
	return (
		<>
			{/* Header */}
			<div className="mb-3 flex-shrink-0">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold text-base-content">Beatmap Preview</h3>
					<div className="flex items-center gap-2">
						<Button
							onClick={onToggleSettings}
							color="secondary"
							size="sm"
						>
							{showSettings ? "Hide" : "Settings"}
						</Button>
						<Button
							onClick={onPlayPause}
							color="primary"
							size="sm"
						>
							{isPlaying ? "Pause" : "Play"}
						</Button>
						<Button
							onClick={onReset}
							color="secondary"
							style="ghost"
							size="sm"
						>
							Reset
						</Button>
					</div>
				</div>
			</div>

			{/* Scroll Speed Slider */}
			<div className="mb-3 flex-shrink-0">
				<div className="flex items-center justify-between mb-1">
					<label className="text-sm text-base-content/70">Scroll Speed</label>
					<span className="text-sm text-base-content/60">{scrollSpeed.toFixed(1)}x</span>
				</div>
				<input
					type="range"
					min="0.1"
					max="0.9"
					step="0.1"
					value={scrollSpeed}
					onChange={onScrollSpeedChange}
					className="range range-primary w-full"
				/>
			</div>
		</>
	);
};

export default PreviewControls;
