import React, { useState } from 'react';
import type { BeatmapWithDetails } from '../../../types/beatmap';
import BeatmapList from './BeatmapList';
import BeatmapTable from './BeatmapTable';
import BeatmapHorizontal from './BeatmapHorizontal';
import ViewToggle from '../../molecules/beatmap/ViewToggle/ViewToggle';
import type { ViewMode } from '../../molecules/beatmap/ViewToggle/ViewToggle';

interface BeatmapViewProps {
  beatmaps: BeatmapWithDetails[];
  loading?: boolean;
  onBeatmapClick?: (beatmap: BeatmapWithDetails) => void;
}

const BeatmapView: React.FC<BeatmapViewProps> = ({ 
  beatmaps, 
  loading = false, 
  onBeatmapClick 
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('horizontal');

  return (
    <div className="space-y-4">
      {/* Toggle de vue */}
      <div className="flex justify-end">
        <ViewToggle 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />
      </div>

      {/* Affichage conditionnel */}
      {viewMode === 'cards' && (
        <BeatmapList 
          beatmaps={beatmaps}
          loading={loading}
          onBeatmapClick={onBeatmapClick}
        />
      )}
      {viewMode === 'table' && (
        <BeatmapTable 
          beatmaps={beatmaps}
          loading={loading}
          onBeatmapClick={onBeatmapClick}
        />
      )}
      {viewMode === 'horizontal' && (
        <BeatmapHorizontal 
          beatmaps={beatmaps}
          loading={loading}
          onBeatmapClick={onBeatmapClick}
        />
      )}
    </div>
  );
};

export default BeatmapView;
