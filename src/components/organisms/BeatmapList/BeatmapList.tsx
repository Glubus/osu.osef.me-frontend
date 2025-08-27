import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { Filters } from "@/types/beatmap/short";
import FilterSection from "@/components/molecules/FilterSection/FilterSection";
import BeatmapHorizontalCard from "@/components/molecules/BeatmapHorizontalCard/BeatmapHorizontalCard";
import { useBeatmapList } from "@/hooks/useBeatmapList";

const BeatmapList: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    per_page: 10,
  });

  const { beatmaps, loading, loadingMore, error, hasMore, loadMore, loadFirstPage } = useBeatmapList(filters);
  const observerRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  // Intersection Observer pour détecter quand on arrive en bas
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadMore]);

  // Load first page only once when component mounts
  useEffect(() => {
    if (isInitialLoad.current) {
      loadFirstPage();
      isInitialLoad.current = false;
    }
  }, [loadFirstPage]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters({
      ...newFilters,
      page: 1, // Reset to first page when filters change
    });
    isInitialLoad.current = true; // Reset initial load flag
  };

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
