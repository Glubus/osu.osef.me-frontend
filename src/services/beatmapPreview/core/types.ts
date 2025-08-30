// Core types for the beatmap preview system
export interface PreviewConfig {
	canvasWidth: number;
	canvasHeight: number;
	lanes: number;
	scrollSpeed: number;
	scrollDirection: "up" | "down";
	noteType: "circle" | "arrow" | "rectangle" | "diamond";
	noteColor: string;
	lnColor: string;
	progressBarPosition: "top" | "bottom";
}

export interface Note {
	x: number;
	y: number;
	lane: number;
	startTime: number;
	endTime?: number; // For hold notes
	isHold: boolean;
}

export interface HitObject {
	startTime: number;
	endTime?: number;
	column: number;
	type: "circle" | "hold";
}

export interface VisibleNote {
	x: number;
	y: number;
	holdEndY?: number;
	isHold: boolean;
}
