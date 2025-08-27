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
  const abortControllerRef = useRef<AbortController | null>(null);
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
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setBeatmaps([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
    setLoading(false);
    setLoadingMore(false);
    loadingRef.current = false;
    loadingMoreRef.current = false;
  }, [filters.search_term, filters.overall_min, filters.overall_max, filters.selected_pattern, filters.pattern_min, filters.pattern_max]);

  const loadBeatmaps = useCallback(async (page?: number) => {
    const targetPage = page ?? currentPageRef.current;
    
    // Prevent multiple simultaneous calls
    if (loadingRef.current || loadingMoreRef.current) {
      debugLog('Preventing duplicate load call for page:', targetPage);
      return;
    }

    try {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
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
      
      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        debugLog('Request was cancelled');
        return;
      }
      
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
      // Don't set error if request was cancelled
      if (err.name === 'AbortError') {
        debugLog('Request was aborted');
        return;
      }
      
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
      loadBeatmaps(nextPage);
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
