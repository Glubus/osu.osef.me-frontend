import { useState, useEffect } from "react";

export const useBeatmapPreviewState = (totalDuration: number) => {
	const [isPlaying, setIsPlaying] = useState(true);
	const [currentTime, setCurrentTime] = useState(0);
	const [progress, setProgress] = useState(0);
	const [scrollSpeed, setScrollSpeed] = useState(0.2);

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

	const handleProgressChange = (newProgress: number) => {
		const duration = totalDuration || 60000;
		const newTime = (newProgress / 100) * duration;
		setCurrentTime(newTime);
		setProgress(newProgress);
	};

	return {
		isPlaying,
		currentTime,
		progress,
		scrollSpeed,
		handlePlayPause,
		handleReset,
		handleScrollSpeedChange,
		handleProgressChange
	};
};
