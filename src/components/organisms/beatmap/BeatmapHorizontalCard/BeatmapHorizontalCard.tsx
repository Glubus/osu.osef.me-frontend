import React from 'react';
import type { BeatmapCardProps } from '../../../../types/beatmap';
import Image from '../../../atom/Image/Image';
import Badge from '../../../atom/Badge/Badge';

const BeatmapHorizontalCard: React.FC<BeatmapCardProps> = ({ beatmap, onClick }) => {
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
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group h-32 overflow-hidden"
      onClick={handleClick}
    >
      {/* Image de couverture en arrière-plan */}
      <div className="absolute inset-0">
        <Image 
          src={beatmapset.cover_url}
          alt={`${beatmapset.artist} - ${beatmapset.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Contenu par-dessus l'image */}
      <div className="relative h-full p-4 flex flex-col justify-between text-white">
        {/* En-tête avec rating et difficulté */}
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-2">
            <Badge color={getOverallColor(msd.overall)}>
              {msd.overall}★
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-primary-content">
              {map.difficulty}
            </div>
          </div>
        </div>

        {/* Informations principales */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-1 line-clamp-1">
            {beatmapset.artist} - {beatmapset.title}
          </h3>
          <p className="text-xs text-base-content/80">
            by {beatmapset.creator}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeatmapHorizontalCard;
