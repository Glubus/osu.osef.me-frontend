import type React from "react";

interface SettingsPanelProps {
	scrollSpeed: number;
	onChangeSpeed: (value: number) => void;
	scrollDirection: "up" | "down";
	onChangeDirection: (direction: "up" | "down") => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
	scrollSpeed,
	onChangeSpeed,
	scrollDirection,
	onChangeDirection,
}) => (
	<div className="mt-3 p-3 bg-base-300 rounded-lg">
		<div className="flex items-center gap-4 mb-3">
			<label className="text-sm font-medium">Scroll Speed:</label>
			<input
				type="range"
				min={0.5}
				max={100}
				step={0.1}
				value={scrollSpeed}
				onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
				className="range range-xs range-primary"
			/>
			<span className="text-sm text-base-content/60">{scrollSpeed}x</span>
		</div>
		<div className="flex items-center gap-4">
			<label className="text-sm font-medium">Scroll Direction:</label>
			<div className="flex gap-2">
				<button
					className={`btn btn-xs ${scrollDirection === "down" ? "btn-primary" : "btn-outline"}`}
					onClick={() => onChangeDirection("down")}
				>
					Down
				</button>
				<button
					className={`btn btn-xs ${scrollDirection === "up" ? "btn-primary" : "btn-outline"}`}
					onClick={() => onChangeDirection("up")}
				>
					Up
				</button>
			</div>
		</div>
	</div>
);

export default SettingsPanel;
