import React from 'react';
import { useBeatmapBrowser } from '../hooks/useBeatmapBrowser';
import BeatmapTemplate from '../components/templates/beatmap/BeatmapTemplate';
import type { BeatmapWithDetails } from '../types/beatmap';

const BeatmapBrowser: React.FC = () => {
  const {
    beatmaps,
    loading,
    error,
    searchTerm,
    filters,
    total,
    hasMore,
    setSearchTerm,
    setFilters,
    handleSearch,
    handleApplyFilters,
    handleResetFilters,
    loadMoreRef,
  } = useBeatmapBrowser();

  const handleBeatmapClick = (beatmap: BeatmapWithDetails) => {
    window.location.href = `/beatmapsets/${beatmap.beatmapset.osu_id}/${beatmap.beatmap.osu_id}`;
  };

  return (
    <BeatmapTemplate
      searchTerm={searchTerm}
      filters={filters}
      beatmaps={beatmaps}
      total={total}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onSearchChange={setSearchTerm}
      onSearch={handleSearch}
      onFiltersChange={setFilters}
      onApplyFilters={handleApplyFilters}
      onBeatmapClick={handleBeatmapClick}
      onResetFilters={handleResetFilters}
      loadMoreRef={loadMoreRef}
    />
  );
};

export default BeatmapBrowser;
