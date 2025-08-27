import { useEffect, useState, useCallback } from "react";
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

  // Reset everything when filters change
  useEffect(() => {
    setBeatmaps([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
    setLoading(false);
    setLoadingMore(false);
  }, [filters.search_term, filters.overall_min, filters.overall_max, filters.selected_pattern, filters.pattern_min, filters.pattern_max]);

  // No automatic loading - let the component control when to load

  const loadBeatmaps = useCallback(async () => {
    try {
      if (currentPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      const currentFilters = {
        ...filters,
        page: currentPage,
      };
      
      const data = await getBeatmaps(currentFilters);
      
      if (currentPage === 1) {
        setBeatmaps(data.beatmaps);
      } else {
        setBeatmaps(prev => [...prev, ...data.beatmaps]);
      }
      
      setHasMore(currentPage < data.total_pages);
    } catch (err) {
      setError("Error loading beatmaps");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, currentPage]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      console.log('Loading more... page:', currentPage + 1);
      setCurrentPage(prev => prev + 1);
      // Load the next page immediately
      setTimeout(() => loadBeatmaps(), 0);
    }
  }, [loading, loadingMore, hasMore, currentPage, loadBeatmaps]);

  const loadFirstPage = useCallback(() => {
    if (!loading && !loadingMore && currentPage === 1 && beatmaps.length === 0) {
      console.log('Loading first page...');
      loadBeatmaps();
    }
  }, [loading, loadingMore, currentPage, beatmaps.length, loadBeatmaps]);

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
