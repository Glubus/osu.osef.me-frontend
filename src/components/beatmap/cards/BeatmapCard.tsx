import React from 'react';
import type { BeatmapCardProps } from '../../../types/beatmap';

const BeatmapCard: React.FC<BeatmapCardProps> = ({ beatmap, onClick }) => {
  const { beatmap: map, beatmapset, msd } = beatmap;

  const handleClick = () => {
    if (onClick) {
      onClick(beatmap);
    }
  };

  const getOverallColor = (overall: string) => {
    const num = parseFloat(overall);
    if (num < 2) return 'badge-success';
    if (num < 4) return 'badge-info';
    if (num < 6) return 'badge-warning';
    if (num < 8) return 'badge-error';
    return 'badge-accent';
  };



  return (
    <div 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      <figure className="relative h-64 overflow-hidden">
        <img 
          src={beatmapset.cover_url} 
          alt={`${beatmapset.artist} - ${beatmapset.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Filtre noir avec alpha 0.7 */}
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Contenu sur la cover */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
          {/* Header avec badges */}
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-1">
              <div className={`badge badge-outline ${getOverallColor(msd.overall)}`}>
                {msd.overall}★
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-primary-content">
                {map.difficulty}
              </div>
            </div>
          </div>
          
          {/* Informations en bas */}
          <div className="flex flex-col justify-end items-center text-center">
            <h3 className="text-lg font-bold mb-1 line-clamp-2">
              {beatmapset.artist} - {beatmapset.title}
            </h3>
            <p className="text-xs text-base-content/80">
              by {beatmapset.creator}
            </p>
          </div>
          

        </div>
      </figure>
    </div>
  );
};

export default BeatmapCard;
