import React from "react";
import { icons } from 'lucide-react';
import type { BeatmapsetCompleteShort } from "@/types/beatmap/short";

const Download = icons.Download;

export type BeatmapActionsProps = {
  beatmapset: BeatmapsetCompleteShort;
  onDownload: (e: React.MouseEvent) => void;
  className?: string;
};

const BeatmapActions: React.FC<BeatmapActionsProps> = ({ 
  beatmapset, 
  onDownload, 
  className 
}) => {
  if (!beatmapset.beatmapset) return null;

  return (
    <div className={`absolute top-0 right-0 h-full w-12 bg-primary/90 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-10 flex items-center justify-center ${className || ''}`}>
      <button
        onClick={onDownload}
        className="text-white hover:text-primary-content transition-colors"
        title="Télécharger le beatmapset"
      >
        <Download size={20} />
      </button>
    </div>
  );
};

export default BeatmapActions;
