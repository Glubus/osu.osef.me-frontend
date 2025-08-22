import React from 'react';
import type { BeatmapListProps } from '../../../types/beatmap';

import BeatmapTableRow from '../../molecules/beatmap/BeatmapTableRow/BeatmapTableRow';
import SkeletonTableRow from '../../molecules/beatmap/SkeletonTableRow/SkeletonTableRow';
import EmptyState from '../../molecules/beatmap/EmptyState/EmptyState';

const BeatmapTable: React.FC<BeatmapListProps> = ({
  beatmaps,
  loading = false,
  onBeatmapClick,
}) => {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="p-3 text-left">Cover</th>
              <th className="p-3 text-left">Song</th>
              <th className="p-3 text-left">Difficulty</th>
              <th className="p-3 text-left">Rating</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonTableRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (beatmaps.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th className="p-3 text-left">Cover</th>
            <th className="p-3 text-left">Song</th>
            <th className="p-3 text-left">Difficulty</th>
            <th className="p-3 text-left">Rating</th>
          </tr>
        </thead>
        <tbody>
          {beatmaps.map((beatmap) => (
            <BeatmapTableRow
              key={beatmap.beatmap.id}
              beatmap={beatmap}
              onClick={onBeatmapClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BeatmapTable;
