import { useState, useEffect } from "react";

export interface BeatmapPreviewSettings {
	scrollDirection: "up" | "down";
	noteType: "circle" | "arrow" | "rectangle" | "diamond";
	noteColor: string;
	lnColor: string;
	progressBarPosition: "top" | "bottom";
}

// Default settings
const DEFAULT_SETTINGS: BeatmapPreviewSettings = {
	scrollDirection: "up",
	noteType: "circle",
	noteColor: "#ff6b35",
	lnColor: "#ff6b35",
	progressBarPosition: "bottom"
};

// LocalStorage key
const SETTINGS_KEY = "beatmapPreviewSettings";

// Load settings from localStorage
const loadSettings = (): BeatmapPreviewSettings => {
	try {
		const saved = localStorage.getItem(SETTINGS_KEY);
		if (saved) {
			return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
		}
	} catch (error) {
		console.error("Failed to load preview settings:", error);
	}
	return DEFAULT_SETTINGS;
};

// Save settings to localStorage
const saveSettings = (settings: BeatmapPreviewSettings) => {
	try {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
	} catch (error) {
		console.error("Failed to save preview settings:", error);
	}
};

export const useBeatmapPreviewSettings = () => {
	const [settings, setSettings] = useState<BeatmapPreviewSettings>(() => loadSettings());

	// Save settings whenever they change
	useEffect(() => {
		saveSettings(settings);
	}, [settings]);

	const updateSetting = (key: keyof BeatmapPreviewSettings, value: any) => {
		setSettings(prev => ({
			...prev,
			[key]: value
		}));
	};

	const resetSettings = () => {
		setSettings(DEFAULT_SETTINGS);
	};

	return {
		settings,
		updateSetting,
		resetSettings
	};
};
