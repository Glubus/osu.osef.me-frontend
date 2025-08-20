import React from 'react';
import { BeatmapListProps } from '../../../types/beatmap';
import BeatmapCard from '../cards/BeatmapCard';

const BeatmapList: React.FC<BeatmapListProps> = ({ 
  beatmaps, 
  loading = false, 
  onBeatmapClick 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card bg-base-100 shadow-xl animate-pulse">
            <div className="h-64 bg-base-300 rounded-t-2xl" />
          </div>
        ))}
      </div>
    );
  }

  if (beatmaps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold mb-2">Aucune beatmap trouvée</h3>
          <p className="text-base-content/60 mb-4">
            Essayez de modifier vos critères de recherche ou vos filtres
          </p>
          <button className="btn btn-primary">
            Réinitialiser les filtres
          </button>
        </div>
      </div>
    );
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
