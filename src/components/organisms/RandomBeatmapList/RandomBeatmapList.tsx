import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { Filters } from "@/types/beatmap/short";
import FilterSection from "@/components/molecules/FilterSection/FilterSection";
import BeatmapHorizontalCard from "@/components/molecules/BeatmapHorizontalCard/BeatmapHorizontalCard";
import Button from "@/components/atoms/Button/Button";
import { useRandomBeatmaps } from "@/hooks/useRandomBeatmaps";
import { useFilters } from "@/hooks/useFilters";

const RandomBeatmapList: React.FC = () => {
  const { filters: savedFilters, updateFilters, resetFilters } = useFilters();
  
  // Remove pagination fields for random beatmaps
  const { page, per_page, ...randomFilters } = savedFilters;
  const [filters, setFilters] = useState<Omit<Filters, 'page' | 'per_page'>>(randomFilters);

  const { beatmaps, loading, error, reroll, loadFirstPage } = useRandomBeatmaps(filters);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const isInitialLoad = useRef(true);

  // Debug logging
  const debugLog = (message: string, data?: any) => {
    console.log(`[RandomBeatmapList Component] ${message}`, data || '');
  };

  // Update local filters when saved filters change
  useEffect(() => {
    const { page, per_page, ...newRandomFilters } = savedFilters;
    setFilters(newRandomFilters);
  }, [savedFilters]);

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
    
    // Remove pagination from filters for random beatmaps
    const { page, per_page, ...randomFilters } = newFilters;
    
    setFilters(randomFilters);
    // Update the saved filters (this will trigger the useEffect above)
    updateFilters(newFilters);
    setIsInitialLoading(true); // Show loading for filter changes
    isInitialLoad.current = true; // Reset initial load flag
  }, [updateFilters]);

  const handleReroll = useCallback(() => {
    debugLog('Reroll button clicked');
    reroll();
  }, [reroll]);

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
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-base-content">Random Beatmaps</h1>
        <button
          onClick={resetFilters}
          className="btn btn-outline btn-sm"
          title="Reset all filters"
        >
          Reset Filters
        </button>
      </div>
      
      <FilterSection filters={{ ...filters, page: 1, per_page: 100 }} onFiltersChange={handleFiltersChange} />
      
      {/* Reroll Button */}
      <div className="flex justify-center mb-6">
        <Button 
          onClick={handleReroll}
          disabled={loading}
          style="outline"
          color="secondary"
          size="sm"
        >
          {loading ? 'Loading...' : '🎲 Reroll Beatmaps'}
        </Button>
      </div>
      
      {isInitialLoading ? (
        <div className="text-center py-8">
          <p>Loading random beatmaps...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {beatmaps.map((beatmapset, i) => (
              <BeatmapHorizontalCard key={`${beatmapset.beatmapset?.id || i}-${i}`} beatmapset={beatmapset} />
            ))}
          </div>
          
          {/* No beatmaps found */}
          {!loading && beatmaps.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No beatmaps found with these filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RandomBeatmapList;
