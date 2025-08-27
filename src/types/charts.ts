export type MSDMetricKey = 
  | "overall"
  | "stream" 
  | "jumpstream"
  | "handstream"
  | "stamina"
  | "jackspeed"
  | "chordjack"
  | "technical";

export interface MSDMetricConfig {
  key: MSDMetricKey;
  label: string;
  color: string;
}

export const MSD_METRICS: MSDMetricConfig[] = [
  { key: "overall", label: "Overall", color: "#3b82f6" },
  { key: "stream", label: "Stream", color: "#16a34a" },
  { key: "jumpstream", label: "Jumpstream", color: "#eab308" },
  { key: "handstream", label: "Handstream", color: "#a855f7" },
  { key: "stamina", label: "Stamina", color: "#f97316" },
  { key: "jackspeed", label: "Jackspeed", color: "#ef4444" },
  { key: "chordjack", label: "Chordjack", color: "#06b6d4" },
  { key: "technical", label: "Technical", color: "#ec4899" },
] as const;

export const RADAR_METRICS = MSD_METRICS.filter(m => m.key !== "overall");
