import React from 'react';
import type { BeatmapListProps } from '../../../types/beatmap';

import BeatmapCard from '../../organisms/beatmap/BeatmapCard/BeatmapCard';
import SkeletonCard from '../../molecules/beatmap/SkeletonCard/SkeletonCard';
import EmptyState from '../../molecules/beatmap/EmptyState/EmptyState';

const BeatmapList: React.FC<BeatmapListProps> = ({
  beatmaps,
  loading = false,
  onBeatmapClick,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (beatmaps.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {beatmaps.map((beatmap) => (
        <BeatmapCard
          key={beatmap.beatmap.id}
          beatmap={beatmap}
          onClick={onBeatmapClick}
        />
      ))}
    </div>
  );
};

export default BeatmapList;
