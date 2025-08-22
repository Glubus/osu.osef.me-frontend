import React, { useState } from 'react';
import type { BeatmapWithDetails } from '../../../types/beatmap';
import BeatmapList from '../../templates/BeatmapList/BeatmapList';
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
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

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
     
        <BeatmapList 
          beatmaps={beatmaps}
          loading={loading}
          onBeatmapClick={onBeatmapClick}
        />
      
    </div>
  );
};

export default BeatmapView;
