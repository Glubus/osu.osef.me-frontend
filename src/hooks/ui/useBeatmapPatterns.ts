import { useMemo } from "react";
import { z } from 'zod';
import type { BeatmapCompleteShort } from "@/types/beatmap/short";

// Schema Zod pour valider les patterns
const PatternSchema = z.array(z.string()).or(z.string());

// Fonction utilitaire pour parser les main_patterns de manière sécurisée
const parseMainPatterns = (mainPattern: string | string[] | undefined): string[] => {
  if (!mainPattern) return [];
  
  if (Array.isArray(mainPattern)) {
    return mainPattern;
  }
  
  // Si c'est une string, essayer de la parser comme JSON avec validation Zod
  try {
    const parsed = JSON.parse(mainPattern);
    const validated = PatternSchema.parse(parsed);
    return Array.isArray(validated) ? validated : [validated];
  } catch {
    // Si le parsing JSON ou la validation échoue, traiter comme une string simple
    return [mainPattern];
  }
};

export const useBeatmapPatterns = (beatmaps: BeatmapCompleteShort[], maxPatterns: number = 3) => {
  return useMemo(() => {
    const allPatterns = new Set<string>();
    beatmaps.forEach(map => {
      const patterns = parseMainPatterns(map.msd?.main_pattern);
      patterns.forEach(pattern => allPatterns.add(pattern));
    });
    return Array.from(allPatterns).slice(0, maxPatterns);
  }, [beatmaps, maxPatterns]);
};
