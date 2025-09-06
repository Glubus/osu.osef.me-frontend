import React from "react";
import Button from "@/components/atoms/Button/Button";
import type { BeatmapPreviewSettings } from "@/hooks/preview/useBeatmapPreviewSettings";

interface PreviewSettingsProps {
	settings: BeatmapPreviewSettings;
	onSettingChange: (key: keyof BeatmapPreviewSettings, value: any) => void;
	onReset: () => void;
}

const PreviewSettings: React.FC<PreviewSettingsProps> = ({
	settings,
	onSettingChange,
	onReset
}) => {
	return (
		<div className="mb-3 p-3 bg-base-200 rounded border border-base-300 flex-shrink-0">
			<div className="flex items-center justify-between mb-3">
				<h4 className="text-sm font-semibold text-base-content">Preview Settings</h4>
				<Button
					onClick={onReset}
					color="error"
					size="sm"
				>
					Reset to Default
				</Button>
			</div>
			<div className="grid grid-cols-2 gap-4">
				{/* Scroll Direction */}
				<div>
					<label className="block text-sm text-base-content/70 mb-1">Scroll Direction</label>
					<select
						value={settings.scrollDirection}
						onChange={(e) => onSettingChange("scrollDirection", e.target.value)}
						className="select select-bordered w-full select-sm"
					>
						<option value="up">Upscroll</option>
						<option value="down">Downscroll</option>
					</select>
				</div>

				{/* Note Type */}
				<div>
					<label className="block text-sm text-base-content/70 mb-1">Note Type</label>
					<select
						value={settings.noteType}
						onChange={(e) => onSettingChange("noteType", e.target.value)}
						className="select select-bordered w-full select-sm"
					>
						<option value="circle">Circle</option>
						<option value="rectangle">Rectangle</option>
						<option value="diamond">Diamond</option>
					</select>
				</div>

				{/* Note Color */}
				<div>
					<label className="block text-sm text-base-content/70 mb-1">Note Color</label>
					<div className="flex items-center gap-2">
						<input
							type="color"
							value={settings.noteColor}
							onChange={(e) => onSettingChange("noteColor", e.target.value)}
							className="w-12 h-8 bg-base-100 border border-base-300 rounded cursor-pointer"
						/>
						<span className="text-xs text-base-content/60">{settings.noteColor}</span>
					</div>
				</div>

				{/* LN Color */}
				<div>
					<label className="block text-sm text-base-content/70 mb-1">LN Color</label>
					<div className="flex items-center gap-2">
						<input
							type="color"
							value={settings.lnColor}
							onChange={(e) => onSettingChange("lnColor", e.target.value)}
							className="w-12 h-8 bg-base-100 border border-base-300 rounded cursor-pointer"
						/>
						<span className="text-xs text-base-content/60">{settings.lnColor}</span>
					</div>
				</div>

				{/* Progress Bar Position */}
				<div>
					<label className="block text-sm text-base-content/70 mb-1">Progress Bar Position</label>
					<select
						value={settings.progressBarPosition}
						onChange={(e) => onSettingChange("progressBarPosition", e.target.value)}
						className="select select-bordered w-full select-sm"
					>
						<option value="bottom">Bottom</option>
						<option value="top">Top</option>
					</select>
				</div>
			</div>
		</div>
	);
};

export default PreviewSettings;
