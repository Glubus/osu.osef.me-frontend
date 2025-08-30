import { useRef, useEffect } from "react";
import type { HitObject } from "@/services/beatmapPreview/core/types";

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
}

export const useBeatmapPreview = ({
	mountRef,
	hitObjects = [],
	scrollSpeed,
	currentTime,
	progress,
	totalTime,
	scrollDirection,
	lanes = 4,
	onProgressChange,
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
		canvas.width = 600;
		canvas.height = 700;

		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;
		const laneWidth = canvasWidth / lanes;
		const receptorY = scrollDirection === "down" ? canvasHeight - 50 : 50;

		// Click handler for progress bar
		const handleClick = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			// Progress bar area
			const barX = 10;
			const barY = 30;
			const barW = canvasWidth - 20;
			const barH = 15;

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
					// Pour les LN: tant que leur fin n'est pas passée de plus de 500ms
					const endTimeDiff = hit.endTime - currentTimeMs;
					const shouldKeep = endTimeDiff >= -500;
					
					if (!shouldKeep) {
						console.log(`LN Removed: start=${hit.startTime}, end=${hit.endTime}, current=${Math.round(currentTimeMs)}, endDiff=${Math.round(endTimeDiff)}`);
					}
					
					return shouldKeep;
				} else {
					// Pour les notes normales: tant qu'elles ne sont pas passées de plus de 500ms
					const startTimeDiff = hit.startTime - currentTimeMs;
					return startTimeDiff >= -500;
				}
			});
		};

		// Animation loop
		const animate = () => {
			// Clear
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);

			// Constants pour cette frame
			const travelTime = scrollSpeed * 1000;
			const noteRadius = 45; // Plus grosses notes
			const noteWidth = 90; // Plus large pour les hold notes

			// Update queue
			updateQueue();

			// Draw lanes
			ctx.strokeStyle = "#374151";
			ctx.lineWidth = 1;
			for (let i = 1; i < lanes; i++) {
				const x = i * laneWidth;
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, canvasHeight);
				ctx.stroke();
			}

			// Draw receptors
			ctx.strokeStyle = "#ffffff";
			ctx.lineWidth = 3;
			for (let i = 0; i < lanes; i++) {
				const x = i * laneWidth + laneWidth / 2;
				ctx.beginPath();
				ctx.arc(x, receptorY, 45, 0, 2 * Math.PI); // Même taille que les notes
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
						ctx.fillStyle = "#3b82f6";
						ctx.fillRect(x - noteWidth/2, rectTop, noteWidth, rectHeight);
						
						ctx.strokeStyle = "#ffffff";
						ctx.lineWidth = 2;
						ctx.strokeRect(x - noteWidth/2, rectTop, noteWidth, rectHeight);
						
						// Draw start note (seulement si visible)
						if (y >= -noteRadius && y <= canvasHeight + noteRadius) {
							ctx.fillStyle = "#ff6b35";
							ctx.beginPath();
							ctx.arc(x, y, noteRadius, 0, 2 * Math.PI);
							ctx.fill();
							ctx.strokeStyle = "#ffffff";
							ctx.lineWidth = 2;
							ctx.stroke();
						}
					}
				} else {
					// Draw regular note - seulement si visible
					if (y >= -noteRadius && y <= canvasHeight + noteRadius) {
						ctx.fillStyle = "#ff6b35";
						ctx.beginPath();
						ctx.arc(x, y, noteRadius, 0, 2 * Math.PI);
						ctx.fill();
						ctx.strokeStyle = "#ffffff";
						ctx.lineWidth = 2;
						ctx.stroke();
					}
				}
			}

			// Debug: show queue info
			ctx.fillStyle = "#ffffff";
			ctx.font = "12px Arial";
			ctx.textAlign = "left";
			ctx.fillText(`Visible: ${visibleNotesRef.current.length} | Queue: ${queueIndexRef.current}/${hitObjects.length} | Travel: ${Math.round(travelTime)}ms`, 10, canvasHeight - 10);

			// Draw progress bar
			const barX = 10;
			const barY = 30;
			const barW = canvasWidth - 20;
			const barH = 15;

			ctx.fillStyle = "#374151";
			ctx.fillRect(barX, barY, barW, barH);

			ctx.fillStyle = "#10b981";
			ctx.fillRect(barX, barY, (barW * progress) / 100, barH);

			ctx.strokeStyle = "#ffffff";
			ctx.lineWidth = 2;
			ctx.strokeRect(barX, barY, barW, barH);

			// Draw time
			const formatTime = (time: number) => {
				const min = Math.floor(time / 60000);
				const sec = Math.floor((time % 60000) / 1000);
				return `${min}:${sec.toString().padStart(2, '0')}`;
			};

			ctx.fillStyle = "#ffffff";
			ctx.font = "16px Arial";
			ctx.textAlign = "center";
			ctx.fillText(
				`${formatTime(currentTime)} / ${formatTime(totalTime)}`,
				canvasWidth / 2,
				20
			);

			animationRef.current = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			canvas.removeEventListener('click', handleClick);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [hitObjects, scrollSpeed, currentTime, progress, totalTime, scrollDirection, lanes, onProgressChange]);

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
