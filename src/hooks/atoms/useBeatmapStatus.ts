import React, { useMemo } from "react";
import { icons } from 'lucide-react';
import type { BeatmapCompleteShort } from "@/types/beatmap/short";
import type { BeatmapStatus } from "@/types/beatmap/status";

const Star = icons.Star;
const Heart = icons.Heart;
const Clock = icons.Clock;

// Function to determine priority status
const getPriorityStatus = (beatmaps: BeatmapCompleteShort[]): BeatmapStatus => {
  const statuses = beatmaps.map(m => m.beatmap.status);
  
  if (statuses.includes('ranked')) {
    return { status: 'ranked', color: 'blue', icon: React.createElement(Star, { size: 12 }) };
  }
  if (statuses.includes('loved')) {
    return { status: 'loved', color: 'pink', icon: React.createElement(Heart, { size: 12 }) };
  }
  if (statuses.includes('graveyard')) {
    return { status: 'graveyard', color: 'gray', icon: React.createElement(Clock, { size: 12 }) };
  }
  
  // Default: take the first status found
  const firstStatus = statuses[0] || 'unknown';
  return { status: firstStatus as any, color: 'gray', icon: React.createElement('span', null, '?') };
};

export const useBeatmapStatus = (beatmaps: BeatmapCompleteShort[]) => {
  return useMemo(() => 
    getPriorityStatus(beatmaps), [beatmaps]
  );
};
