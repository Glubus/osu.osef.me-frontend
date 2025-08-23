import { useRef, useEffect, useState } from "react";
import type { HitObject } from "../services/map_parser";

interface UseOsuManiaPixiProps {
	mountRef: React.RefObject<HTMLDivElement | null>;
	hitObjects: HitObject[];
	scrollSpeed: number;
	currentTime: number;
	scrollDirection: "up" | "down";
	lanes?: number;
	poolPerLane?: number;
}

// Classe pour gérer les notes
class Note {
	x: number;
	y: number;
	timestamp: number;
	baseSpeed: number;
	isVisible: boolean;
	width: number;
	height: number;
	type: string;

	constructor(x: number, y: number, timestamp: number, type: string = "tap") {
		this.x = x;
		this.y = y;
		this.timestamp = timestamp;
		this.baseSpeed = 2;
		this.isVisible = true;
		this.width = 100; // Reduced width
		this.height = 25;
		this.type = type;
	}

	update(
		deltaTime: number,
		scrollSpeed: number,
		scrollDirection: string,
		canvasHeight: number,
	) {
		if (scrollDirection === "down") {
			this.y += this.baseSpeed * scrollSpeed * deltaTime;
		} else {
			this.y -= this.baseSpeed * scrollSpeed * deltaTime;
		}

		if (this.y > canvasHeight + this.height || this.y < -this.height) {
			this.isVisible = false;
		}
	}

	draw(ctx: CanvasRenderingContext2D, noteColor: string) {
		if (this.isVisible) {
			ctx.fillStyle = this.type === "hold" ? "#3b82f6" : noteColor;

			// Draw rounded rectangle
			const x = this.x - this.width / 2;
			const y = this.y;
			const width = this.width;
			const height = this.height;
			const radius = 8; // Corner radius

			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + width - radius, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			ctx.lineTo(x + width, y + height - radius);
			ctx.quadraticCurveTo(
				x + width,
				y + height,
				x + width - radius,
				y + height,
			);
			ctx.lineTo(x + radius, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			ctx.lineTo(x, y + radius);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			ctx.closePath();
			ctx.fill();
		}
	}
}

export const useOsuManiaPixi = ({
	mountRef,
	hitObjects = [],
	scrollSpeed,
	currentTime,
	scrollDirection,
	lanes = 4,
}: UseOsuManiaPixiProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationRef = useRef<number | null>(null);
	const lastTimeRef = useRef<number>(0);
	const drawRef = useRef<Note[]>([]);
	const scrollDirectionRef = useRef<string>(scrollDirection);

	// Update scroll direction when it changes
	useEffect(() => {
		scrollDirectionRef.current = scrollDirection;
	}, [scrollDirection]);

	// Canvas setup
	useEffect(() => {
		if (!mountRef.current || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size
		canvas.width = mountRef.current.clientWidth;
		canvas.height = mountRef.current.clientHeight;
		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;

		// Calculate lane positions
		const laneWidth = canvasWidth / lanes;
		const receptorsX = Array.from(
			{ length: lanes },
			(_, i) => i * laneWidth + laneWidth / 2,
		);

		// Get receptor Y position based on scroll direction
		const getReceptorY = () => {
			return scrollDirectionRef.current === "down" ? canvasHeight - 25 : 0;
		};

		// Draw receptors
		const drawReceptors = () => {
			const receptorY = getReceptorY();
			receptorsX.forEach((x) => {
				// Draw receptor background
				ctx.fillStyle = "#2a2a2a";
				ctx.fillRect(x - 50, receptorY, 100, 25);

				// Draw receptor border
				ctx.strokeStyle = "#ffffff";
				ctx.lineWidth = 2;
				ctx.strokeRect(x - 50, receptorY, 100, 25);

				// Draw receptor center line
				ctx.strokeStyle = "#666666";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(x - 50, receptorY + 12.5);
				ctx.lineTo(x + 50, receptorY + 12.5);
				ctx.stroke();
			});
		};

		// Draw lane separators
		const drawLaneSeparators = () => {
			ctx.strokeStyle = "#ffffff";
			ctx.globalAlpha = 0.3;
			ctx.lineWidth = 1;
			for (let i = 1; i < lanes; i++) {
				const x = i * laneWidth;
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, canvasHeight);
				ctx.stroke();
			}
			ctx.globalAlpha = 1;
		};

		// Update notes progressively
		const updateNotesProgressively = () => {
			drawRef.current = [];

			for (const hitObject of hitObjects) {
				const timestamp = hitObject.startTime;
				const lane = Math.max(0, Math.min(lanes - 1, hitObject.column ?? 0));
				const x = receptorsX[lane];

				if (
					timestamp >= currentTime * 1000 - 2000 &&
					timestamp <= currentTime * 1000 + 6000
				) {
					const startY =
						scrollDirectionRef.current === "down"
							? canvasHeight +
								125 -
								(timestamp - currentTime * 1000) * (scrollSpeed / 16)
							: -125 + (timestamp - currentTime * 1000) * (scrollSpeed / 16);

					drawRef.current.push(new Note(x, startY, timestamp, hitObject.type));
				}
			}

			// Debug log - only every 30 frames
			if (drawRef.current.length > 0 && Math.floor(currentTime * 2) % 1 === 0) {
				console.log(
					`Notes visibles: ${drawRef.current.length}, Direction: ${scrollDirectionRef.current}, Speed: ${scrollSpeed}`,
				);
			}
		};

		// Main animation loop
		const animate = (currentTimestamp: number) => {
			const deltaTime = (currentTimestamp - lastTimeRef.current) / 1000;
			lastTimeRef.current = currentTimestamp;

			// Clear canvas
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);

			// Draw static elements
			drawLaneSeparators();
			drawReceptors();

			// Update and draw notes
			drawRef.current.forEach((note) => {
				note.update(
					deltaTime,
					scrollSpeed,
					scrollDirectionRef.current,
					canvasHeight,
				);
				note.draw(ctx, "#ffffff");
			});

			// Filter out invisible notes
			drawRef.current = drawRef.current.filter((note) => note.isVisible);

			// Update notes list
			updateNotesProgressively();

			animationRef.current = requestAnimationFrame(animate);
		};

		// Start animation
		animationRef.current = requestAnimationFrame(animate);

		// Cleanup
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [hitObjects, scrollSpeed, currentTime, lanes]);

	// Return canvas element
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
