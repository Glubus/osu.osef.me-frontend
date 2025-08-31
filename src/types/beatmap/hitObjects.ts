/**
 * Centralized types for beatmap hit objects
 * Used in beatmap parsing and preview
 */

/**
 * Interface for hit objects parsed from .osu files
 */
export interface HitObject {
  /** Start time in milliseconds */
  startTime: number;
  /** End time in milliseconds (for hold notes) */
  endTime?: number;
  /** Note column (0-indexed) */
  column: number;
  /** Hit object type */
  type: "circle" | "hold";
}

/**
 * Interface for notes during rendering/preview
 */
export interface Note {
  /** X position on canvas */
  x: number;
  /** Y position on canvas */
  y: number;
  /** Lane/column of the note */
  lane: number;
  /** Start time in milliseconds */
  startTime: number;
  /** End time in milliseconds (for hold notes) */
  endTime?: number;
  /** Indicates if it's a hold note */
  isHold: boolean;
}

/**
 * Interface for notes visible on screen
 */
export interface VisibleNote {
  /** X position on canvas */
  x: number;
  /** Y position on canvas */
  y: number;
  /** End Y position for hold notes */
  holdEndY?: number;
  /** Indicates if it's a hold note */
  isHold: boolean;
}
