// src/components/templates/BeatmapTemplate.tsx
import React from 'react';
import SearchBar from '../../organisms/search/SearchBar/SearchBar';
import AdvancedFilters from '../../organisms/search/AdvancedFilter/AdvancedFilter';
import BeatmapView from './BeatmapView';
import type { BeatmapWithDetails, BeatmapFilters } from '../../../types/beatmap';

type Props = {
  searchTerm: string;
  filters: BeatmapFilters;
  beatmaps: BeatmapWithDetails[];
  total: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
  onFiltersChange: (filters: BeatmapFilters) => void;
  onApplyFilters: () => void;
  onBeatmapClick: (beatmap: BeatmapWithDetails) => void;
  onResetFilters: () => void;
  loadMoreRef: (node: HTMLDivElement | null) => void;
};

const BeatmapTemplate: React.FC<Props> = ({
  searchTerm,
  filters,
  beatmaps,
  total,
  loading,
  error,
  hasMore,
  onSearchChange,
  onSearch,
  onFiltersChange,
  onApplyFilters,
  onBeatmapClick,
  onResetFilters,
  loadMoreRef,
}) => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              🎵 Beatmap Browser
            </h1>
            <p className="text-base-content/70">
              Découvrez et explorez des milliers de beatmaps
            </p>
          </div>

          <div className="mb-6">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              onSearch={onSearch}
              loading={loading}
            />
          </div>

          <AdvancedFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
            onApplyFilters={onApplyFilters}
            loading={loading}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <BeatmapView
          beatmaps={beatmaps}
          loading={false}
          onBeatmapClick={onBeatmapClick}
        />

        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center mt-8 py-4">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="loading loading-spinner loading-sm"></div>
                <span className="text-sm">Chargement...</span>
              </div>
            ) : (
              <div className="text-base-content/40 text-xs">
                Chargement automatique...
              </div>
            )}
          </div>
        )}

        {!hasMore && beatmaps.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="text-base-content/60 text-sm">
              Toutes les beatmaps ont été chargées ({total} au total)
            </div>
          </div>
        )}

        {!loading && (searchTerm || Object.keys(filters).length > 0) && (
          <div className="flex justify-center mt-6">
            <button
              onClick={onResetFilters}
              className="btn btn-outline btn-sm"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeatmapTemplate;
