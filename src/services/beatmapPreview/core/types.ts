// Core types for the beatmap preview system
import type { HitObject, Note, VisibleNote } from "@/types/beatmap/hitObjects";

// Re-export for compatibility
export type { HitObject, Note, VisibleNote };

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
