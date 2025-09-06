import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { icons } from "lucide-react";
import type { Filters } from "@/types/beatmap/short";
import FilterSection from "@/components/organisms/FilterSection/FilterSection";
import BeatmapGrid from "@/components/organisms/BeatmapGrid/BeatmapGrid";
import Button from "@/components/atoms/Button/Button";

const Shuffle = icons.Shuffle;

export interface BeatmapListTemplateProps {
  title: string;
  beatmaps: any[];
  loading: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  error?: string | null;
  onFiltersChange: (filters: Filters) => void;
  onReset: () => void;
  onLoadMore?: () => void;
  onReroll?: () => void;
  filters: Filters;
  showRerollButton?: boolean;
  loadingMessage?: string;
  loadingMoreMessage?: string;
  noMoreMessage?: string;
  emptyMessage?: string;
}

const BeatmapListTemplate: React.FC<BeatmapListTemplateProps> = ({
  title,
  beatmaps,
  loading,
  loadingMore = false,
  hasMore = false,
  error,
  onFiltersChange,
  onReset,
  onLoadMore,
  onReroll,
  filters,
  showRerollButton = false,
  loadingMessage = "Loading beatmaps...",
  loadingMoreMessage = "Loading more beatmaps...",
  noMoreMessage = "No more beatmaps to load.",
  emptyMessage = "No beatmaps found with these filters."
}) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const isInitialLoad = useRef(true);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loading);
  const loadingMoreRef = useRef(loadingMore);

  // Update refs when values change
  hasMoreRef.current = hasMore;
  loadingRef.current = loading;
  loadingMoreRef.current = loadingMore;

  // Scroll listener pour détecter quand on arrive en bas (seulement si onLoadMore est fourni)
  useEffect(() => {
    if (!onLoadMore) return;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Si on est à moins de 200px du bas
      if (scrollTop + windowHeight >= documentHeight - 200) {
        if (hasMoreRef.current && !loadingRef.current && !loadingMoreRef.current) {
          onLoadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onLoadMore]);

  // Load first page only once when component mounts
  useEffect(() => {
    if (isInitialLoad.current) {
      setIsInitialLoading(true);
      isInitialLoad.current = false;
    }
  }, []);

  // Hide initial loading when we have data
  useEffect(() => {
    if (beatmaps.length > 0 && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [beatmaps.length, isInitialLoading]);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    onFiltersChange({
      ...newFilters,
      page: 1, // Reset to first page when filters change
    });
    setIsInitialLoading(true); // Show loading for filter changes
    isInitialLoad.current = true; // Reset initial load flag
  }, [onFiltersChange]);

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
        <h1 className="text-2xl font-bold text-base-content">{title}</h1>
      </div>
      
      <FilterSection 
        filters={filters} 
        onFiltersChange={handleFiltersChange} 
        onReset={onReset}
      />
      
      {/* Reroll Button (optionnel) */}
      {showRerollButton && onReroll && (
        <div className="flex justify-center mb-6">
          <Button 
            onClick={onReroll}
            disabled={loading}
            style="outline"
            color="secondary"
            size="sm"
          >
            <Shuffle size={16} className="mr-2" />
            {loading ? 'Loading...' : 'Reroll Beatmaps'}
          </Button>
        </div>
      )}
      
      <BeatmapGrid
        beatmaps={beatmaps}
        loading={isInitialLoading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        loadingMessage={loadingMessage}
        loadingMoreMessage={loadingMoreMessage}
        noMoreMessage={noMoreMessage}
        emptyMessage={emptyMessage}
      />
    </div>
  );
};

export default BeatmapListTemplate;
