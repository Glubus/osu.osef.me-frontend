import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import CanvasContainer from "../../../atom/CanvasContainer/CanvasContainer";
import ProgressBar from "../../../atom/ProgressBar/ProgressBar";
import HeaderControls from "../../../molecules/beatmap/BeatmapPreview/HeaderControls";
import SettingsPanel from "../../../molecules/beatmap/BeatmapPreview/SettingsPanel";
import HistogramWrapper from "../../../molecules/beatmap/BeatmapPreview/HistogramWrapper";
import { useOsuManiaPixi } from "../../../../hooks/useOsuManiaPixi";
import type { Beatmap, NPSDataPoint } from "../../../../types/beatmap";
import type { HitObject } from "../../../../services/map_parser";
import { MapParserService } from "../../../../services/map_parser";

interface OsuManiaPreviewProps {
	currentTime: number;
	totalTime: number;
	beatmap: Beatmap;
	isPlaying: boolean;
	onPlayPause: () => void;
	onReset: () => void;
	npsData: NPSDataPoint[];
	onBarClick?: (time: number) => void;
}

const OsuManiaPreviewWebGL: React.FC<OsuManiaPreviewProps> = ({
	currentTime,
	totalTime,
	beatmap,
	isPlaying,
	onPlayPause,
	onReset,
	npsData,
	onBarClick,
}) => {
	const [hitObjects, setHitObjects] = useState<HitObject[]>([]);
	const [scrollSpeed, setScrollSpeed] = useState(20);
	const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
	const [showSettings, setShowSettings] = useState(true);
	const [loading, setLoading] = useState(false);

	const mountRef = useRef<HTMLDivElement | null>(null);

	// --- Decode .osu map ---
	const decodeOsuFile = useCallback(async () => {
		if (!beatmap?.id) return;
		console.log(
			"OsuManiaPreviewWebGL: Decoding .osu file for beatmap:",
			beatmap.id,
		);
		setLoading(true);
		try {
			const ho = await MapParserService.parseOsuFile(beatmap.id);
			console.log("OsuManiaPreviewWebGL: HitObjects loaded:", ho.length);
			setHitObjects(ho);
		} catch (e) {
			console.error("Map decode error:", e);
			const fallback = MapParserService.generateFallbackData(totalTime);
			setHitObjects(fallback);
		} finally {
			setLoading(false);
		}
	}, [beatmap?.id, totalTime]);

	useEffect(() => {
		decodeOsuFile();
	}, [decodeOsuFile]);

	// --- Hook Canvas 2D ---
	const canvasElement = useOsuManiaPixi({
		mountRef,
		hitObjects,
		scrollSpeed,
		currentTime,
		scrollDirection,
	});

	const progress = (currentTime / totalTime) * 100;

	return (
		<div
			className="w-full bg-transparent rounded-lg flex flex-col"
			style={{ height: "1000px" }}
		>
			<HeaderControls
				currentTime={currentTime}
				totalTime={totalTime}
				isPlaying={isPlaying}
				onPlayPause={onPlayPause}
				onReset={onReset}
				onToggleSettings={() => setShowSettings(!showSettings)}
			/>

			{showSettings && (
				<SettingsPanel
					scrollSpeed={scrollSpeed}
					onChangeSpeed={setScrollSpeed}
					scrollDirection={scrollDirection}
					onChangeDirection={setScrollDirection}
				/>
			)}

			<HistogramWrapper
				npsData={npsData}
				currentTime={currentTime}
				totalTime={totalTime}
				onBarClick={onBarClick}
			/>

			<CanvasContainer ref={mountRef}>
				{loading && <div className="loading loading-spinner loading-lg" />}
				{canvasElement}
			</CanvasContainer>

			<div className="p-4">
				<ProgressBar progress={progress} />
			</div>
		</div>
	);
};

export default OsuManiaPreviewWebGL;
