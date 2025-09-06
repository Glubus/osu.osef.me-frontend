import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBeatmapset } from "@/hooks";
import BeatmapMSDView from "@/components/organisms/BeatmapMSDView/BeatmapMSDView";
import BeatmapHeader from "@/components/organisms/BeatmapHeader/BeatmapHeader";
import BeatmapPreview from "@/components/organisms/BeatmapPreview/BeatmapPreview";

const BeatmapView = () => {
  const { beatmapsetId, beatmapId } = useParams();
  const navigate = useNavigate();
  const [selectedRate, setSelectedRate] = useState<number>(1.0);
  
  const { data, currentBeatmap, sortedBeatmaps, error } = useBeatmapset(beatmapsetId, beatmapId);

  const handleDifficultyClick = (beatmapOsuId: number) => {
    if (beatmapsetId) {
      navigate(`/beatmapsets/${beatmapsetId}/${beatmapOsuId}`);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-base-content">
        <div className="bg-error text-error-content p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !currentBeatmap) return null;

  return (
    <div className="p-4 text-base-content">
      <BeatmapHeader
        coverUrl={data.beatmapset?.cover_url}
        artist={data.beatmapset?.artist}
        title={data.beatmapset?.title}
        creator={data.beatmapset?.creator}
        beatmapsetOsuId={data.beatmapset?.osu_id}
        beatmaps={sortedBeatmaps}
        currentBeatmapId={beatmapId || ""}
        onDifficultyClick={handleDifficultyClick}
      />

      <div className="mb-6">
        <div className="flex gap-4">
          {/* Left column 2/3: MSD charts */}
          <div className="w-2/3 bg-base-200 rounded-lg p-4">
            <BeatmapMSDView
              msdRates={currentBeatmap.msd}
              selectedRate={selectedRate}
              onRateChange={setSelectedRate}
              difficultyName={currentBeatmap.beatmap?.difficulty || ""}
            />
          </div>
          {/* Right column 1/3: Beatmap preview */}
          <div className="w-1/3 bg-base-200 rounded-lg p-4">
            {currentBeatmap.beatmap?.osu_id && (
              <BeatmapPreview beatmapId={currentBeatmap.beatmap.osu_id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatmapView;
