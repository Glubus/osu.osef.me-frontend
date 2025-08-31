/**
 * Canvas configuration constants for beatmap preview
 * Centralizes all canvas-related magic numbers
 */

export const CANVAS_CONFIG = {
  // Canvas dimensions
  WIDTH: 600,
  HEIGHT: 700,
  
  // Lane configuration
  LANE_COUNT: 4,
  
  // Note appearance
  NOTE_RADIUS: 45,
  NOTE_WIDTH: 90,
  RECEPTOR_RADIUS: 45,
  
  // Positioning
  RECEPTOR_OFFSET: 50,
  
  // Timing
  NOTE_DISAPPEAR_DELAY: 500, // ms after note is hit before it disappears
  
  // Progress bar
  PROGRESS_BAR: {
    X: 10,
    Y: 30,
    HEIGHT: 15,
    MARGIN: 20, // Total horizontal margin (left + right)
  },
  
  // UI elements
  UI: {
    DEBUG_MARGIN: 10,
    TIME_FONT_SIZE: 16,
    DEBUG_FONT_SIZE: 12,
  },
  
  // Colors
  COLORS: {
    LANE_STROKE: "#374151",
    RECEPTOR_STROKE: "#ffffff",
    NOTE_FILL: "#ff6b35",
    NOTE_STROKE: "#ffffff",
    HOLD_NOTE_FILL: "#3b82f6",
    PROGRESS_BAR_BG: "#374151",
    PROGRESS_BAR_FILL: "#10b981",
    TEXT: "#ffffff",
  },
  
  // Line weights
  LINE_WEIGHTS: {
    LANE: 1,
    RECEPTOR: 3,
    NOTE: 2,
    PROGRESS_BAR: 2,
  },
} as const;
