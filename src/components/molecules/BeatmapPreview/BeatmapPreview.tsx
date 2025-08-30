import React, { useRef, useState, useEffect } from "react";
import { useBeatmapPreview } from "@/hooks/useBeatmapPreview";
import { MapParserService } from "@/utils/map_parser";
import type { HitObject } from "@/services/beatmapPreview/core/types";

interface BeatmapPreviewProps {
	beatmapId: number;
}

interface PreviewSettings {
	scrollDirection: "up" | "down";
	noteType: "circle" | "arrow" | "rectangle" | "diamond";
	noteColor: string;
	lnColor: string;
	progressBarPosition: "top" | "bottom";
}

// Default settings
const DEFAULT_SETTINGS: PreviewSettings = {
	scrollDirection: "up",
	noteType: "circle",
	noteColor: "#ff6b35",
	lnColor: "#ff6b35",
	progressBarPosition: "bottom"
};

// LocalStorage key
const SETTINGS_KEY = "beatmapPreviewSettings";

// Load settings from localStorage
const loadSettings = (): PreviewSettings => {
	try {
		const saved = localStorage.getItem(SETTINGS_KEY);
		if (saved) {
			return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
		}
	} catch (error) {
		console.error("Failed to load settings:", error);
	}
	return DEFAULT_SETTINGS;
};

// Save settings to localStorage
const saveSettings = (settings: PreviewSettings) => {
	try {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
	} catch (error) {
		console.error("Failed to save settings:", error);
	}
};

const BeatmapPreview: React.FC<BeatmapPreviewProps> = ({ beatmapId }) => {
	const mountRef = useRef<HTMLDivElement>(null);
	const [isPlaying, setIsPlaying] = useState(true);
	const [currentTime, setCurrentTime] = useState(0);
	const [progress, setProgress] = useState(0);
	const [scrollSpeed, setScrollSpeed] = useState(0.2);
	const [showSettings, setShowSettings] = useState(false);

	// Settings state with localStorage
	const [settings, setSettings] = useState<PreviewSettings>(() => loadSettings());

	// Save settings whenever they change
	useEffect(() => {
		saveSettings(settings);
	}, [settings]);

	// Load hit objects
	const [hitObjects, setHitObjects] = useState<HitObject[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [totalDuration, setTotalDuration] = useState(60000);

	useEffect(() => {
		const loadBeatmap = async () => {
			try {
				setIsLoading(true);
				setError(null);

				console.log("🎵 Loading beatmap with ID:", beatmapId);
				
				let parsedHitObjects;
				try {
					parsedHitObjects = await MapParserService.parseOsuFile(beatmapId);
					console.log("✅ Parsed hit objects:", parsedHitObjects.length);
				} catch (parseError) {
					console.error("❌ Parsing failed, using test data:", parseError);
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
				console.error("Error loading beatmap:", err);
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
		onProgressChange: (newProgress: number) => {
			const duration = totalDuration || 60000;
			const newTime = (newProgress / 100) * duration;
			setCurrentTime(newTime);
			setProgress(newProgress);
		},
	});

	// Animation loop pour mettre à jour le temps
	useEffect(() => {
		if (!isPlaying) return;

		const interval = setInterval(() => {
			setCurrentTime(prev => {
				const duration = totalDuration || 60000;
				const newTime = prev + 16;
				if (newTime >= duration) {
					setIsPlaying(false);
					return duration;
				}
				return newTime;
			});
		}, 16);

		return () => clearInterval(interval);
	}, [isPlaying, totalDuration]);

	// Mettre à jour la progression
	useEffect(() => {
		if (totalDuration) {
			setProgress((currentTime / totalDuration) * 100);
		}
	}, [currentTime, totalDuration]);

	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	const handleReset = () => {
		setCurrentTime(0);
		setProgress(0);
		setIsPlaying(true);
	};

	const handleScrollSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setScrollSpeed(parseFloat(e.target.value));
	};

	const handleSettingChange = (key: keyof PreviewSettings, value: any) => {
		setSettings(prev => {
			const newSettings = { ...prev, [key]: value };
			console.log(`Setting changed: ${key} = ${value}`, newSettings);
			return newSettings;
		});
	};

	const resetSettings = () => {
		setSettings(DEFAULT_SETTINGS);
	};

	return (
		<div className="h-full flex flex-col">
			{/* Header */}
			<div className="mb-3 flex-shrink-0">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold text-white">Beatmap Preview</h3>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setShowSettings(!showSettings)}
							className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
						>
							{showSettings ? "Hide" : "Settings"}
						</button>
						<button
							onClick={handlePlayPause}
							className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm text-white"
						>
							{isPlaying ? "Pause" : "Play"}
						</button>
						<button
							onClick={handleReset}
							className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm text-white"
						>
							Reset
						</button>
					</div>
				</div>
			</div>

			{/* Settings Panel */}
			{showSettings && (
				<div className="mb-3 p-3 bg-gray-800 rounded border border-gray-700 flex-shrink-0">
					<div className="flex items-center justify-between mb-3">
						<h4 className="text-sm font-semibold text-white">Preview Settings</h4>
						<button
							onClick={resetSettings}
							className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs text-white"
						>
							Reset to Default
						</button>
					</div>
					<div className="grid grid-cols-2 gap-4">
						{/* Scroll Direction */}
						<div>
							<label className="block text-sm text-gray-300 mb-1">Scroll Direction</label>
							<select
								value={settings.scrollDirection}
								onChange={(e) => handleSettingChange("scrollDirection", e.target.value)}
								className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
							>
								<option value="up">Upscroll</option>
								<option value="down">Downscroll</option>
							</select>
						</div>

						{/* Note Type */}
						<div>
							<label className="block text-sm text-gray-300 mb-1">Note Type</label>
							<select
								value={settings.noteType}
								onChange={(e) => handleSettingChange("noteType", e.target.value)}
								className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
							>
								<option value="circle">Circle</option>
								<option value="arrow">Arrow</option>
								<option value="rectangle">Rectangle</option>
								<option value="diamond">Diamond</option>
							</select>
						</div>

						{/* Note Color */}
						<div>
							<label className="block text-sm text-gray-300 mb-1">Note Color</label>
							<div className="flex items-center gap-2">
								<input
									type="color"
									value={settings.noteColor}
									onChange={(e) => handleSettingChange("noteColor", e.target.value)}
									className="w-12 h-8 bg-gray-700 border border-gray-600 rounded cursor-pointer"
								/>
								<span className="text-xs text-gray-400">{settings.noteColor}</span>
							</div>
						</div>

						{/* LN Color */}
						<div>
							<label className="block text-sm text-gray-300 mb-1">LN Color</label>
							<div className="flex items-center gap-2">
								<input
									type="color"
									value={settings.lnColor}
									onChange={(e) => handleSettingChange("lnColor", e.target.value)}
									className="w-12 h-8 bg-gray-700 border border-gray-600 rounded cursor-pointer"
								/>
								<span className="text-xs text-gray-400">{settings.lnColor}</span>
							</div>
						</div>

						{/* Progress Bar Position */}
						<div>
							<label className="block text-sm text-gray-300 mb-1">Progress Bar Position</label>
							<select
								value={settings.progressBarPosition}
								onChange={(e) => handleSettingChange("progressBarPosition", e.target.value)}
								className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
							>
								<option value="bottom">Bottom</option>
								<option value="top">Top</option>
							</select>
						</div>
					</div>
				</div>
			)}

			{/* Scroll Speed Slider */}
			<div className="mb-3 flex-shrink-0">
				<div className="flex items-center justify-between mb-1">
					<label className="text-sm text-gray-300">Scroll Speed</label>
					<span className="text-sm text-gray-400">{scrollSpeed.toFixed(1)}x</span>
				</div>
				<input
					type="range"
					min="0.1"
					max="0.9"
					step="0.1"
					value={scrollSpeed}
					onChange={handleScrollSpeedChange}
					className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
					style={{
						background: `linear-gradient(to right, #10b981 0%, #10b981 ${(scrollSpeed / 2.0) * 100}%, #374151 ${(scrollSpeed / 2.0) * 100}%, #374151 100%)`
					}}
				/>
			</div>

			<div ref={mountRef} className="flex-1 min-h-0 w-full bg-gray-900 rounded border border-gray-700 overflow-hidden" style={{ maxHeight: "700px" }}>
				{isLoading && <div className="flex items-center justify-center h-full text-gray-400">Loading preview...</div>}
				{error && <div className="flex items-center justify-center h-full text-red-400 text-sm">{error}</div>}
				{!isLoading && !error && canvas}
			</div>
		</div>
	);
};

export default BeatmapPreview;

