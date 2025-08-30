import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { Filters } from "@/types/beatmap/short";
import FilterSection from "@/components/molecules/FilterSection/FilterSection";
import BeatmapGrid from "@/components/molecules/BeatmapGrid/BeatmapGrid";
import { useBeatmapList } from "@/hooks/useBeatmapList";
import { useFilters } from "@/hooks/useFilters";

const BeatmapList: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useFilters();
  const { beatmaps, loading, loadingMore, error, hasMore, loadMore, loadFirstPage } = useBeatmapList(filters);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const isInitialLoad = useRef(true);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loading);
  const loadingMoreRef = useRef(loadingMore);

  // Update refs when values change
  hasMoreRef.current = hasMore;
  loadingRef.current = loading;
  loadingMoreRef.current = loadingMore;

  // Debug logging
  const debugLog = (message: string, data?: any) => {
    console.log(`[BeatmapList Component] ${message}`, data || '');
  };

  // Scroll listener pour détecter quand on arrive en bas
  useEffect(() => {
    debugLog('Setting up scroll listener');
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Si on est à moins de 200px du bas
      if (scrollTop + windowHeight >= documentHeight - 200) {
        debugLog('Near bottom detected', { 
          scrollTop, 
          windowHeight, 
          documentHeight,
          hasMore: hasMoreRef.current,
          loading: loadingRef.current,
          loadingMore: loadingMoreRef.current
        });
        
        if (hasMoreRef.current && !loadingRef.current && !loadingMoreRef.current) {
          loadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    debugLog('Scroll listener attached');

    return () => {
      debugLog('Cleaning up scroll listener');
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  // Load first page only once when component mounts
  useEffect(() => {
    if (isInitialLoad.current) {
      debugLog('Component mounted, loading first page');
      setIsInitialLoading(true);
      loadFirstPage();
      isInitialLoad.current = false;
    }
  }, [loadFirstPage]);

  // Hide initial loading when we have data
  useEffect(() => {
    if (beatmaps.length > 0 && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [beatmaps.length, isInitialLoading]);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    debugLog('Filters changed', newFilters);
    
    updateFilters({
      ...newFilters,
      page: 1, // Reset to first page when filters change
    });
    setIsInitialLoading(true); // Show loading for filter changes
    isInitialLoad.current = true; // Reset initial load flag
  }, [updateFilters]);

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-base-content">Beatmaps</h1>
      </div>
      
      <FilterSection 
        filters={filters} 
        onFiltersChange={handleFiltersChange} 
        onReset={resetFilters}
      />
      
      <BeatmapGrid
        beatmaps={beatmaps}
        loading={isInitialLoading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        loadingMessage="Loading beatmaps..."
        loadingMoreMessage="Loading more beatmaps..."
        noMoreMessage="No more beatmaps to load."
        emptyMessage="No beatmaps found with these filters."
      />
    </div>
  );
};

export default BeatmapList;
