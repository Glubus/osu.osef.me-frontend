import type React from "react";
import { useState, useEffect, useCallback } from "react";
import type { Filters } from "@/types/beatmap/short";
import BeatmapListTemplate from "@/components/templates/BeatmapListTemplate";
import { useRandomBeatmaps, useFilters } from "@/hooks";

const RandomBeatmaps: React.FC = () => {
  const { filters: savedFilters, updateFilters, resetFilters } = useFilters();
  
  // Remove pagination fields for random beatmaps
  const { page, per_page, ...randomFilters } = savedFilters;
  const [filters, setFilters] = useState<Omit<Filters, 'page' | 'per_page'>>(randomFilters);

  const { beatmaps, loading, error, reroll, loadFirstPage } = useRandomBeatmaps(filters);

  // Update local filters when saved filters change
  useEffect(() => {
    const { page, per_page, ...newRandomFilters } = savedFilters;
    setFilters(newRandomFilters);
  }, [savedFilters]);

  // Load first page when component mounts
  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    // Remove pagination from filters for random beatmaps
    const { page, per_page, ...randomFilters } = newFilters;
    
    setFilters(randomFilters);
    // Update the saved filters (this will trigger the useEffect above)
    updateFilters(newFilters);
  }, [updateFilters]);

  const handleReroll = useCallback(() => {
    reroll();
  }, [reroll]);

  return (
    <BeatmapListTemplate
      title="Random Beatmaps"
      beatmaps={beatmaps}
      loading={loading}
      error={error}
      onFiltersChange={handleFiltersChange}
      onReset={resetFilters}
      onReroll={handleReroll}
      filters={{ ...filters, page: 1, per_page: 100 }}
      showRerollButton={true}
      loadingMessage="Loading random beatmaps..."
      emptyMessage="No beatmaps found with these filters."
    />
  );
};

export default RandomBeatmaps;
