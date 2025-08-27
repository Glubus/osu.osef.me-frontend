import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { Filters } from "@/types/beatmap/short";
import FilterSection from "@/components/molecules/FilterSection/FilterSection";
import BeatmapHorizontalCard from "@/components/molecules/BeatmapHorizontalCard/BeatmapHorizontalCard";
import { useBeatmapList } from "@/hooks/useBeatmapList";

const BeatmapList: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    per_page: 100,
  });

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
    
    setFilters({
      ...newFilters,
      page: 1, // Reset to first page when filters change
    });
    setIsInitialLoading(true); // Show loading for filter changes
    isInitialLoad.current = true; // Reset initial load flag
  }, []);

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
      <FilterSection filters={filters} onFiltersChange={handleFiltersChange} />
      
      {isInitialLoading ? (
        <div className="text-center py-8">
          <p>Loading beatmaps...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {beatmaps.map((beatmapset, i) => (
              <BeatmapHorizontalCard key={`${beatmapset.beatmapset?.id || i}-${i}`} beatmapset={beatmapset} />
            ))}
          </div>
          
          {/* Loading indicator for more items */}
          {loadingMore && (
            <div className="text-center py-4">
              <p>Loading more beatmaps...</p>
            </div>
          )}
          
          {/* Scroll target - no longer needed but keeping for now */}
          <div className="h-4" />
          
          {/* No more items indicator */}
          {!hasMore && beatmaps.length > 0 && (
            <div className="text-center py-4">
              <p className="text-gray-400">No more beatmaps to load.</p>
            </div>
          )}
        </>
      )}
      
      {!loading && beatmaps.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No beatmaps found with these filters.</p>
        </div>
      )}
    </div>
  );
};

export default BeatmapList;
