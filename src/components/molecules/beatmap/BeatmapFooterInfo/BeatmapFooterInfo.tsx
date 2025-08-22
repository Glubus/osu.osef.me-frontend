import React from 'react';

type Props = {
  artist: string;
  title: string;
  creator: string;
};

const BeatmapFooterInfo: React.FC<Props> = ({ artist, title, creator }) => (
  <div className="flex flex-col justify-end items-center text-center">
    <h3 className="text-lg font-bold mb-1 line-clamp-2">
      {artist} - {title}
    </h3>
    <p className="text-xs text-base-content/80">
      by {creator}
    </p>
  </div>
);

export default BeatmapFooterInfo;
