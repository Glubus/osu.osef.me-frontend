import React from "react";
import type { BeatmapsetCompleteShort } from "@/types/beatmap/short";
import BeatmapHorizontalCard from "@/components/molecules/BeatmapHorizontalCard/BeatmapHorizontalCard";

export interface BeatmapGridProps {
  beatmaps: BeatmapsetCompleteShort[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  loadingMoreMessage?: string;
  noMoreMessage?: string;
}

const BeatmapGrid: React.FC<BeatmapGridProps> = ({
  beatmaps,
  loading = false,
  loadingMore = false,
  hasMore = false,
  emptyMessage = "No beatmaps found with these filters.",
  loadingMessage = "Loading beatmaps...",
  loadingMoreMessage = "Loading more beatmaps...",
  noMoreMessage = "No more beatmaps to load."
}) => {
  return (
    <>
      {loading ? (
        <div className="text-center py-8">
          <p>{loadingMessage}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {beatmaps.map((beatmapset, i) => (
              <BeatmapHorizontalCard 
                key={`${beatmapset.beatmapset?.id || i}-${i}`} 
                beatmapset={beatmapset} 
              />
            ))}
          </div>
          
          {/* Loading indicator for more items */}
          {loadingMore && (
            <div className="text-center py-4">
              <p>{loadingMoreMessage}</p>
            </div>
          )}
          
          {/* No more items indicator */}
          {!hasMore && beatmaps.length > 0 && (
            <div className="text-center py-4">
              <p className="text-gray-400">{noMoreMessage}</p>
            </div>
          )}
        </>
      )}
      
      {!loading && beatmaps.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      )}
    </>
  );
};

export default BeatmapGrid;
