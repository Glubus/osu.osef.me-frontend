import React, { useRef, useState, useEffect } from "react";
import { useBeatmapPreview, useBeatmapPreviewSettings, useBeatmapPreviewState } from "@/hooks";
import { MapParserService } from "@/utils/map_parser";
import type { HitObject } from "@/services/beatmapPreview/core/types";
import PreviewSettings from "@/components/molecules/PreviewSettings";
import PreviewControls from "@/components/molecules/PreviewControls";

interface BeatmapPreviewProps {
	beatmapId: number;
}

const BeatmapPreview: React.FC<BeatmapPreviewProps> = ({ beatmapId }) => {
	const mountRef = useRef<HTMLDivElement>(null);
	const [showSettings, setShowSettings] = useState(false);

	// Use custom hooks
	const { settings, updateSetting, resetSettings } = useBeatmapPreviewSettings();

	// Load hit objects
	const [hitObjects, setHitObjects] = useState<HitObject[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [totalDuration, setTotalDuration] = useState(60000);

	// Use preview state hook
	const {
		isPlaying,
		currentTime,
		progress,
		scrollSpeed,
		handlePlayPause,
		handleReset,
		handleScrollSpeedChange,
		handleProgressChange
	} = useBeatmapPreviewState(totalDuration);

	useEffect(() => {
		const loadBeatmap = async () => {
			try {
				setIsLoading(true);
				setError(null);

				
				
				let parsedHitObjects;
				try {
					parsedHitObjects = await MapParserService.parseOsuFile(beatmapId);
					
				} catch (parseError) {
					
					// Use test data - more spread out in time
					parsedHitObjects = [
						{ startTime: 2000, column: 0, type: "circle" },
						{ startTime: 4000, column: 1, type: "circle" },
						{ startTime: 6000, column: 2, type: "circle" },
						{ startTime: 8000, column: 3, type: "circle" },
						{ startTime: 10000, column: 1, type: "hold", endTime: 12000 },
					] as any[];
				}
				
				// Always add test notes at the beginning
				const testNotes = [
					{ startTime: 1000, column: 0, type: "circle" },
					{ startTime: 2000, column: 1, type: "circle" },
					{ startTime: 3000, column: 2, type: "circle" },
					{ startTime: 4000, column: 3, type: "circle" },
					{ startTime: 5000, column: 0, type: "hold", endTime: 7000 },
				];
				parsedHitObjects = [...testNotes, ...parsedHitObjects];
				
				const convertedHitObjects: HitObject[] = parsedHitObjects.map(hit => ({
					startTime: hit.startTime,
					endTime: hit.endTime,
					column: hit.column,
					type: hit.type === "hold" ? "hold" : "circle"
				}));

				setHitObjects(convertedHitObjects);

				// Calculate total duration
				if (convertedHitObjects.length > 0) {
					const lastNote = convertedHitObjects[convertedHitObjects.length - 1];
					const duration = lastNote.endTime ? lastNote.endTime : lastNote.startTime + 5000;
					setTotalDuration(duration);
				}

				setIsLoading(false);
			} catch (err) {
				
				setError(err instanceof Error ? err.message : "Failed to load beatmap");
				setIsLoading(false);
			}
		};

		loadBeatmap();
	}, [beatmapId]);

	const canvas = useBeatmapPreview({
		mountRef,
		hitObjects,
		scrollSpeed,
		currentTime,
		progress,
		totalTime: totalDuration,
		scrollDirection: settings.scrollDirection,
		lanes: 4,
		onProgressChange: handleProgressChange,
		settings: {
			noteType: settings.noteType,
			noteColor: settings.noteColor,
			lnColor: settings.lnColor,
			progressBarPosition: settings.progressBarPosition,
		},
	});


	return (
		<div className="h-full flex flex-col">
			<PreviewControls
				isPlaying={isPlaying}
				scrollSpeed={scrollSpeed}
				showSettings={showSettings}
				onPlayPause={handlePlayPause}
				onReset={handleReset}
				onToggleSettings={() => setShowSettings(!showSettings)}
				onScrollSpeedChange={handleScrollSpeedChange}
			/>

			{/* Settings Panel */}
			{showSettings && (
				<PreviewSettings
					settings={settings}
					onSettingChange={updateSetting}
					onReset={resetSettings}
				/>
			)}

			<div ref={mountRef} className="flex-1 min-h-0 w-full bg-base-300 rounded border border-base-300 overflow-hidden" style={{ maxHeight: "700px" }}>
				{isLoading && <div className="flex items-center justify-center h-full text-base-content/60">Loading preview...</div>}
				{error && <div className="flex items-center justify-center h-full text-error text-sm">{error}</div>}
				{!isLoading && !error && canvas}
			</div>
		</div>
	);
};

export default BeatmapPreview;

