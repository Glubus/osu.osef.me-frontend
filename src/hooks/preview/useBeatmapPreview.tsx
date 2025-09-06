import { useRef, useEffect } from "react";
import type { HitObject } from "@/services/beatmapPreview/core/types";
import { CANVAS_CONFIG } from "@/utils/constants/canvas";

interface UseBeatmapPreviewProps {
	mountRef: React.RefObject<HTMLDivElement | null>;
	hitObjects: HitObject[];
	scrollSpeed: number;
	currentTime: number;
	progress: number;
	totalTime: number;
	scrollDirection: "up" | "down";
	lanes?: number;
	onProgressChange?: (progress: number) => void;
		settings?: {
			noteType: "circle" | "rectangle" | "diamond";
			noteColor: string;
			lnColor: string;
			progressBarPosition: "top" | "bottom";
		};
}

export const useBeatmapPreview = ({
	mountRef,
	hitObjects = [],
	scrollSpeed,
	currentTime,
	progress,
	totalTime,
	scrollDirection,
	lanes = CANVAS_CONFIG.LANE_COUNT,
	onProgressChange,
	settings,
}: UseBeatmapPreviewProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationRef = useRef<number | null>(null);
	
	// Queue optimisée : index dans le vecteur trié + notes visibles
	const queueIndexRef = useRef(0);
	const visibleNotesRef = useRef<HitObject[]>([]);

	// Reset queue when hitObjects change
	useEffect(() => {
		queueIndexRef.current = 0;
		visibleNotesRef.current = [];
	}, [hitObjects]);

	useEffect(() => {
		if (!mountRef.current || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Simple canvas setup
		canvas.width = CANVAS_CONFIG.WIDTH;
		canvas.height = CANVAS_CONFIG.HEIGHT;

		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;
		const laneWidth = canvasWidth / lanes;
		const receptorY = scrollDirection === "down" ? canvasHeight - CANVAS_CONFIG.RECEPTOR_OFFSET : CANVAS_CONFIG.RECEPTOR_OFFSET;

		// Click handler for progress bar
		const handleClick = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			// Progress bar area
			const barX = CANVAS_CONFIG.PROGRESS_BAR.X;
			const barY = CANVAS_CONFIG.PROGRESS_BAR.Y;
			const barW = canvasWidth - CANVAS_CONFIG.PROGRESS_BAR.MARGIN;
			const barH = CANVAS_CONFIG.PROGRESS_BAR.HEIGHT;

			if (x >= barX && x <= barX + barW && y >= barY && y <= barY + barH) {
				const newProgress = Math.max(0, Math.min(100, ((x - barX) / barW) * 100));
				if (onProgressChange) {
					onProgressChange(newProgress);
				}
			}
		};

		canvas.addEventListener('click', handleClick);

		// Update queue intelligente
		const updateQueue = () => {
			const travelTime = scrollSpeed * 1000;
			const currentTimeMs = currentTime;
			
			// 1. Ajouter les nouvelles notes depuis la queue
			while (queueIndexRef.current < hitObjects.length) {
				const hit = hitObjects[queueIndexRef.current];
				const startTimeDiff = hit.startTime - currentTimeMs;
				
				// Vérifier si la note doit apparaître
				if (startTimeDiff <= travelTime) {
					visibleNotesRef.current.push(hit);
					queueIndexRef.current++;
				} else {
					break; // Les notes suivantes sont encore trop loin
				}
			}
			
			// 2. Supprimer les notes qui ne sont plus visibles
			visibleNotesRef.current = visibleNotesRef.current.filter(hit => {
				if (hit.type === "hold" && hit.endTime) {
					// Pour les LN: tant que leur fin n'est pas passée de plus de NOTE_DISAPPEAR_DELAY ms
					const endTimeDiff = hit.endTime - currentTimeMs;
					const shouldKeep = endTimeDiff >= -CANVAS_CONFIG.NOTE_DISAPPEAR_DELAY;
					
					
					return shouldKeep;
				} else {
					// Pour les notes normales: tant qu'elles ne sont pas passées de plus de NOTE_DISAPPEAR_DELAY ms
					const startTimeDiff = hit.startTime - currentTimeMs;
					return startTimeDiff >= -CANVAS_CONFIG.NOTE_DISAPPEAR_DELAY;
				}
			});
		};

		// Performance optimization: Frame rate throttling
		const FRAME_RATE = 60;
		const FRAME_INTERVAL = 1000 / FRAME_RATE;
		let lastFrameTime = 0;

		// Animation loop
		const animate = (currentFrameTime: number) => {
			// Throttle frame rate
			if (currentFrameTime - lastFrameTime < FRAME_INTERVAL) {
				animationRef.current = requestAnimationFrame(animate);
				return;
			}
			lastFrameTime = currentFrameTime;

			// Clear
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		// Constants pour cette frame (memoized)
		const travelTime = scrollSpeed * 1000;
		const noteRadius = CANVAS_CONFIG.NOTE_RADIUS;
		const noteWidth = CANVAS_CONFIG.NOTE_WIDTH;
		
		// Use settings or fallback to defaults
		const noteType = settings?.noteType || "circle";
		const noteColor = settings?.noteColor || CANVAS_CONFIG.COLORS.NOTE_FILL;
		const lnColor = settings?.lnColor || CANVAS_CONFIG.COLORS.HOLD_NOTE_FILL;
		const progressBarPosition = settings?.progressBarPosition || "bottom";

		// Helper function to draw different note types
		const drawNote = (x: number, y: number, type: string) => {
			ctx.fillStyle = noteColor;
			ctx.strokeStyle = CANVAS_CONFIG.COLORS.NOTE_STROKE;
			ctx.lineWidth = CANVAS_CONFIG.LINE_WEIGHTS.NOTE;
			
			switch (type) {
				case "circle":
					ctx.beginPath();
					ctx.arc(x, y, noteRadius, 0, 2 * Math.PI);
					ctx.fill();
					ctx.stroke();
					break;
				case "rectangle":
					// Rectangle: prend toute la largeur de la lane, plus fin
					const laneWidth = canvasWidth / lanes;
					const rectWidth = laneWidth * 0.9; // 90% de la largeur de la lane
					const rectHeight = noteRadius * 0.6; // Plus fin
					ctx.fillRect(x - rectWidth/2, y - rectHeight/2, rectWidth, rectHeight);
					ctx.strokeRect(x - rectWidth/2, y - rectHeight/2, rectWidth, rectHeight);
					break;
				case "diamond":
					ctx.beginPath();
					ctx.moveTo(x, y - noteRadius);
					ctx.lineTo(x + noteRadius, y);
					ctx.lineTo(x, y + noteRadius);
					ctx.lineTo(x - noteRadius, y);
					ctx.closePath();
					ctx.fill();
					ctx.stroke();
					break;
			}
		};

			// Update queue
			updateQueue();

			// Draw lanes
			ctx.strokeStyle = CANVAS_CONFIG.COLORS.LANE_STROKE;
			ctx.lineWidth = CANVAS_CONFIG.LINE_WEIGHTS.LANE;
			for (let i = 1; i < lanes; i++) {
				const x = i * laneWidth;
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, canvasHeight);
				ctx.stroke();
			}

			// Draw receptors
			ctx.strokeStyle = CANVAS_CONFIG.COLORS.RECEPTOR_STROKE;
			ctx.lineWidth = CANVAS_CONFIG.LINE_WEIGHTS.RECEPTOR;
			for (let i = 0; i < lanes; i++) {
				const x = i * laneWidth + laneWidth / 2;
				ctx.beginPath();
				ctx.arc(x, receptorY, CANVAS_CONFIG.RECEPTOR_RADIUS, 0, 2 * Math.PI);
				ctx.stroke();
			}

			// Draw notes (seulement les notes visibles !)
			
			for (const hit of visibleNotesRef.current) {
				const startTimeDiff = hit.startTime - currentTime;
				const x = hit.column * laneWidth + laneWidth / 2;
				
				let y;
				if (scrollDirection === "down") {
					y = ((travelTime - startTimeDiff) / travelTime) * receptorY;
				} else {
					y = canvasHeight - ((travelTime - startTimeDiff) / travelTime) * (canvasHeight - receptorY);
				}

				if (hit.type === "hold" && hit.endTime) {
					// Draw hold note
					const endTimeDiff = hit.endTime - currentTime;
					let endY;
					
					if (scrollDirection === "down") {
						endY = ((travelTime - endTimeDiff) / travelTime) * receptorY;
					} else {
						endY = canvasHeight - ((travelTime - endTimeDiff) / travelTime) * (canvasHeight - receptorY);
					}
					
					// Pour les LN: dessiner si n'importe quelle partie est visible
					const rectTop = Math.min(y, endY);
					const rectBottom = Math.max(y, endY);
					const rectHeight = rectBottom - rectTop;
					
					// Vérifier si la LN est visible (début OU fin OU corps)
					const isVisible = (rectTop <= canvasHeight + noteRadius && rectBottom >= -noteRadius);
					
					if (isVisible && rectHeight > 0) {
						// Draw hold body
						ctx.fillStyle = lnColor;
						ctx.fillRect(x - noteWidth/2, rectTop, noteWidth, rectHeight);
						
						ctx.strokeStyle = CANVAS_CONFIG.COLORS.NOTE_STROKE;
						ctx.lineWidth = CANVAS_CONFIG.LINE_WEIGHTS.NOTE;
						ctx.strokeRect(x - noteWidth/2, rectTop, noteWidth, rectHeight);
						
						// Draw start note (seulement si visible)
						if (y >= -noteRadius && y <= canvasHeight + noteRadius) {
							drawNote(x, y, noteType);
						}
					}
				} else {
					// Draw regular note - seulement si visible
					if (y >= -noteRadius && y <= canvasHeight + noteRadius) {
						drawNote(x, y, noteType);
					}
				}
			}

			// Debug: show queue info
			ctx.fillStyle = CANVAS_CONFIG.COLORS.TEXT;
			ctx.font = `${CANVAS_CONFIG.UI.DEBUG_FONT_SIZE}px Arial`;
			ctx.textAlign = "left";
			ctx.fillText(`Visible: ${visibleNotesRef.current.length} | Queue: ${queueIndexRef.current}/${hitObjects.length} | Travel: ${Math.round(travelTime)}ms`, CANVAS_CONFIG.UI.DEBUG_MARGIN, canvasHeight - CANVAS_CONFIG.UI.DEBUG_MARGIN);

			// Draw progress bar
			const barX = CANVAS_CONFIG.PROGRESS_BAR.X;
			const barY = progressBarPosition === "top" ? CANVAS_CONFIG.PROGRESS_BAR.Y : canvasHeight - CANVAS_CONFIG.PROGRESS_BAR.Y - CANVAS_CONFIG.PROGRESS_BAR.HEIGHT;
			const barW = canvasWidth - CANVAS_CONFIG.PROGRESS_BAR.MARGIN;
			const barH = CANVAS_CONFIG.PROGRESS_BAR.HEIGHT;

			ctx.fillStyle = CANVAS_CONFIG.COLORS.PROGRESS_BAR_BG;
			ctx.fillRect(barX, barY, barW, barH);

			ctx.fillStyle = CANVAS_CONFIG.COLORS.PROGRESS_BAR_FILL;
			ctx.fillRect(barX, barY, (barW * progress) / 100, barH);

			ctx.strokeStyle = CANVAS_CONFIG.COLORS.TEXT;
			ctx.lineWidth = CANVAS_CONFIG.LINE_WEIGHTS.PROGRESS_BAR;
			ctx.strokeRect(barX, barY, barW, barH);

			// Draw time
			const formatTime = (time: number) => {
				const min = Math.floor(time / 60000);
				const sec = Math.floor((time % 60000) / 1000);
				return `${min}:${sec.toString().padStart(2, '0')}`;
			};

			ctx.fillStyle = CANVAS_CONFIG.COLORS.TEXT;
			ctx.font = `${CANVAS_CONFIG.UI.TIME_FONT_SIZE}px Arial`;
			ctx.textAlign = "center";
			ctx.fillText(
				`${formatTime(currentTime)} / ${formatTime(totalTime)}`,
				canvasWidth / 2,
				20
			);

			animationRef.current = requestAnimationFrame(animate);
		};

		// Start the animation loop
		animationRef.current = requestAnimationFrame(animate);

		return () => {
			canvas.removeEventListener('click', handleClick);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [hitObjects, scrollSpeed, currentTime, progress, totalTime, scrollDirection, lanes, onProgressChange, settings]);

	return (
		<canvas
			ref={canvasRef}
			style={{
				width: "100%",
				height: "100%",
				display: "block",
			}}
		/>
	);
};
