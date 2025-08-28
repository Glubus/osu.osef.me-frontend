import { useEffect, useState, useCallback, useRef } from "react";
import { getBeatmaps } from "@/services/api/get_beatmap";
import type { BeatmapsetCompleteShort } from "@/types/beatmap/short";
import type { Filters } from "@/types/beatmap/short";

export const useBeatmapList = (filters: Filters) => {
  const [beatmaps, setBeatmaps] = useState<BeatmapsetCompleteShort[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Refs pour éviter les appels multiples
  const loadingRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const filtersRef = useRef(filters);
  const currentPageRef = useRef(currentPage);

  // Update refs when values change
  filtersRef.current = filters;
  currentPageRef.current = currentPage;

  // Debug logging
  const debugLog = (message: string, data?: any) => {
    console.log(`[BeatmapList] ${message}`, data || '');
  };

  // Reset everything when filters change
  useEffect(() => {
    debugLog('Filters changed, resetting state', filters);
    
    setBeatmaps([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
    setLoading(false);
    setLoadingMore(false);
    loadingRef.current = false;
    loadingMoreRef.current = false;
    
    // Reload first page with new filters
    setTimeout(() => {
      debugLog('Reloading with new filters');
      loadBeatmaps(1);
    }, 0);
  }, [filters.search_term, filters.overall_min, filters.overall_max, filters.selected_pattern, filters.pattern_min, filters.pattern_max]);

  const loadBeatmaps = useCallback(async (page?: number) => {
    const targetPage = page ?? currentPageRef.current;
    
    // Prevent multiple simultaneous calls
    if (loadingRef.current || loadingMoreRef.current) {
      debugLog('Preventing duplicate load call for page:', targetPage);
      return;
    }

    try {
      if (targetPage === 1) {
        setLoading(true);
        loadingRef.current = true;
        debugLog('Starting initial load');
      } else {
        setLoadingMore(true);
        loadingMoreRef.current = true;
        debugLog('Loading more, page:', targetPage);
      }
      setError(null);
      
      const currentFilters = {
        ...filtersRef.current,
        page: targetPage,
      };
      
      debugLog('Making API call with filters:', currentFilters);
      
      const data = await getBeatmaps(currentFilters);
      
      debugLog('Received data:', { 
        beatmapsCount: data.beatmaps.length, 
        totalPages: data.total_pages,
        currentPage: targetPage 
      });
      
      if (targetPage === 1) {
        setBeatmaps(data.beatmaps);
      } else {
        setBeatmaps(prev => [...prev, ...data.beatmaps]);
      }
      
      setHasMore(targetPage < data.total_pages);
    } catch (err: any) {
      setError("Error loading beatmaps");
      console.error("BeatmapList error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      loadingRef.current = false;
      loadingMoreRef.current = false;
      debugLog('Load completed for page:', targetPage);
    }
  }, []); // Empty dependencies - using refs instead

  const loadMore = useCallback(() => {
    if (!loadingRef.current && !loadingMoreRef.current && hasMore) {
      const nextPage = currentPageRef.current + 1;
      debugLog(`loadMore called, incrementing page from ${currentPageRef.current} to ${nextPage}`);
      setCurrentPage(nextPage);
      // Load immediately
      setTimeout(() => loadBeatmaps(nextPage), 0);
    } else {
      debugLog('loadMore blocked:', { 
        loading: loadingRef.current, 
        loadingMore: loadingMoreRef.current, 
        hasMore 
      });
    }
  }, [hasMore, loadBeatmaps]);

  const loadFirstPage = useCallback(() => {
    if (!loadingRef.current && !loadingMoreRef.current && currentPageRef.current === 1 && beatmaps.length === 0) {
      debugLog('loadFirstPage called');
      loadBeatmaps(1);
    } else {
      debugLog('loadFirstPage blocked:', { 
        loading: loadingRef.current, 
        loadingMore: loadingMoreRef.current, 
        currentPage: currentPageRef.current, 
        beatmapsLength: beatmaps.length 
      });
    }
  }, [beatmaps.length, loadBeatmaps]);

  return {
    beatmaps,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    loadFirstPage,
  };
};
