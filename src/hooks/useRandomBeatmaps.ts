import { useEffect, useState, useCallback, useRef } from "react";
import { getRandomBeatmaps } from "@/services/api/get_beatmap";
import type { BeatmapsetCompleteShort } from "@/types/beatmap/short";
import type { Filters } from "@/types/beatmap/short";

export const useRandomBeatmaps = (filters: Omit<Filters, 'page' | 'per_page'>) => {
  const [beatmaps, setBeatmaps] = useState<BeatmapsetCompleteShort[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs pour éviter les appels multiples
  const loadingRef = useRef(false);
  const filtersRef = useRef(filters);

  // Update refs when values change
  filtersRef.current = filters;

  // Debug logging
  const debugLog = (message: string, data?: any) => {
    console.log(`[RandomBeatmaps] ${message}`, data || '');
  };

  // Reset everything when filters change
  useEffect(() => {
    debugLog('Filters changed, resetting state', filters);
    
    setBeatmaps([]);
    setError(null);
    setLoading(false);
    loadingRef.current = false;
    
    // Reload with new filters
    setTimeout(() => {
      debugLog('Reloading with new filters');
      loadRandomBeatmaps();
    }, 0);
  }, [filters.search_term, filters.overall_min, filters.overall_max, filters.selected_pattern, filters.pattern_min, filters.pattern_max]);

  const loadRandomBeatmaps = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current) {
      debugLog('Preventing duplicate load call');
      return;
    }

    try {
      setLoading(true);
      loadingRef.current = true;
      debugLog('Starting random load');
      setError(null);
      
      const currentFilters = {
        ...filtersRef.current,
      };
      
      debugLog('Making API call with filters:', currentFilters);
      
      const data = await getRandomBeatmaps(currentFilters);
      
      debugLog('Received data:', { 
        beatmapsCount: data.beatmaps.length
      });
      
      setBeatmaps(data.beatmaps);
    } catch (err: any) {
      setError("Error loading random beatmaps");
      console.error("RandomBeatmaps error:", err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
      debugLog('Load completed');
    }
  }, []); // Empty dependencies - using refs instead

  const reroll = useCallback(() => {
    if (!loadingRef.current) {
      debugLog('Reroll requested');
      loadRandomBeatmaps();
    } else {
      debugLog('Reroll blocked - already loading');
    }
  }, [loadRandomBeatmaps]);

  const loadFirstPage = useCallback(() => {
    if (!loadingRef.current && beatmaps.length === 0) {
      debugLog('loadFirstPage called');
      loadRandomBeatmaps();
    } else {
      debugLog('loadFirstPage blocked:', { 
        loading: loadingRef.current, 
        beatmapsLength: beatmaps.length 
      });
    }
  }, [beatmaps.length, loadRandomBeatmaps]);

  return {
    beatmaps,
    loading,
    error,
    reroll,
    loadFirstPage,
  };
};
