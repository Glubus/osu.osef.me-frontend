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

  

  // Reset everything when filters change
  useEffect(() => {
    
    setBeatmaps([]);
    setError(null);
    setLoading(false);
    loadingRef.current = false;
    
    // Reload with new filters
    setTimeout(() => {
      loadRandomBeatmaps();
    }, 0);
  }, [filters.search_term, filters.overall_min, filters.overall_max, filters.selected_pattern, filters.pattern_min, filters.pattern_max]);

  const loadRandomBeatmaps = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current) {
      return;
    }

    try {
      setLoading(true);
      loadingRef.current = true;

      setError(null);
      
      const currentFilters = {
        ...filtersRef.current,
      };
      

      
      const data = await getRandomBeatmaps(currentFilters);
      

      
      setBeatmaps(data.beatmaps);
    } catch (err: any) {
      setError("Error loading random beatmaps");

    } finally {
      setLoading(false);
      loadingRef.current = false;

    }
  }, []); // Empty dependencies - using refs instead

  const reroll = useCallback(() => {
    if (!loadingRef.current) {

      loadRandomBeatmaps();
    } else {

    }
  }, [loadRandomBeatmaps]);

  const loadFirstPage = useCallback(() => {
    if (!loadingRef.current && beatmaps.length === 0) {

      loadRandomBeatmaps();
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
