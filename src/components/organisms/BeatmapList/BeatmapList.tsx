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
  const observerRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const observerRef2 = useRef<IntersectionObserver | null>(null);
  const loadMoreTimeoutRef = useRef<number | null>(null);
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

  // Debounced load more function
  const debouncedLoadMore = useCallback(() => {
    if (loadMoreTimeoutRef.current) {
      clearTimeout(loadMoreTimeoutRef.current);
    }
    
    loadMoreTimeoutRef.current = setTimeout(() => {
      debugLog('Debounced loadMore triggered');
      loadMore();
    }, 100); // 100ms debounce
  }, [loadMore]);

  // Intersection Observer pour détecter quand on arrive en bas
  useEffect(() => {
    debugLog('Setting up Intersection Observer');
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        debugLog('Intersection Observer triggered', { 
          isIntersecting: entry.isIntersecting,
          hasMore: hasMoreRef.current,
          loading: loadingRef.current,
          loadingMore: loadingMoreRef.current
        });
        
        if (entry.isIntersecting && hasMoreRef.current && !loadingRef.current && !loadingMoreRef.current) {
          debouncedLoadMore();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Start loading 100px before reaching the bottom
      }
    );

    observerRef2.current = observer;

    if (observerRef.current) {
      observer.observe(observerRef.current);
      debugLog('Observer attached to element');
    }

    return () => {
      debugLog('Cleaning up Intersection Observer');
      observer.disconnect();
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
    };
  }, [debouncedLoadMore]); // Only depend on debouncedLoadMore

  // Load first page only once when component mounts
  useEffect(() => {
    if (isInitialLoad.current) {
      debugLog('Component mounted, loading first page');
      loadFirstPage();
      isInitialLoad.current = false;
    }
  }, [loadFirstPage]);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    debugLog('Filters changed', newFilters);
    
    // Cancel any pending load more
    if (loadMoreTimeoutRef.current) {
      clearTimeout(loadMoreTimeoutRef.current);
    }
    
    setFilters({
      ...newFilters,
      page: 1, // Reset to first page when filters change
    });
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
      
      {loading && beatmaps.length === 0 ? (
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
          
          {/* Intersection observer target */}
          <div ref={observerRef} className="h-4" />
          
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
