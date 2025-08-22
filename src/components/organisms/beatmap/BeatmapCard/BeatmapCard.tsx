import React from 'react';
import type { BeatmapCardProps } from '../../../../types/beatmap';
import Image from '../../../atom/Image/Image';
import BeatmapHeaderInfo from '../../../molecules/beatmap/BeatmapHeaderInfo/BeatmapHeaderInfo';
import BeatmapFooterInfo from '../../../molecules/beatmap/BeatmapFooterInfo/BeatmapFooterInfo';

const BeatmapCard: React.FC<BeatmapCardProps> = ({ beatmap, onClick }) => {
  const { beatmap: map, beatmapset, msd } = beatmap;

  const handleClick = () => {
    if (onClick) {
      onClick(beatmap);
    }
  };

  return (
    <div 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      <figure className="relative h-64 overflow-hidden">
        <Image 
          src={beatmapset.cover_url}
          alt={`${beatmapset.artist} - ${beatmapset.title}`}
          className="group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
          <BeatmapHeaderInfo 
            overall={msd.overall}
            difficulty={map.difficulty}
          />
          <BeatmapFooterInfo 
            artist={beatmapset.artist}
            title={beatmapset.title}
            creator={beatmapset.creator}
          />
        </div>
      </figure>
    </div>
  );
};

export default BeatmapCard;
