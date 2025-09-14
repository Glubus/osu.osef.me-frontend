import type React from "react";
import BeatmapListTemplate from "@/components/templates/BeatmapListTemplate";
import { useBeatmapList, useFilters } from "@/hooks";

const BeatmapListPage: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useFilters();
  const { beatmaps, loading, loadingMore, error, hasMore, loadMore } = useBeatmapList(filters);

  // React Query gère automatiquement le premier appel, pas besoin de loadFirstPage

  return (
    <BeatmapListTemplate
      title="Beatmaps"
      beatmaps={beatmaps}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      error={error}
      onFiltersChange={updateFilters}
      onReset={resetFilters}
      onLoadMore={loadMore}
      filters={filters}
      showRerollButton={false}
      loadingMessage="Loading beatmaps..."
      loadingMoreMessage="Loading more beatmaps..."
      noMoreMessage="No more beatmaps to load."
      emptyMessage="No beatmaps found with these filters."
    />
  );
};

export default BeatmapListPage;
