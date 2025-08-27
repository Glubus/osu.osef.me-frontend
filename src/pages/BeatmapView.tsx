import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBeatmapset } from "@/hooks/useBeatmapset";
import BeatmapMSDView from "@/components/organisms/BeatmapMSDView/BeatmapMSDView";
import BeatmapHeader from "@/components/molecules/BeatmapHeader/BeatmapHeader";

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
      <div className="p-4 text-white">
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !currentBeatmap) return null;

  return (
    <div className="p-4 text-white">
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

      <BeatmapMSDView
        msdRates={currentBeatmap.msd}
        selectedRate={selectedRate}
        onRateChange={setSelectedRate}
        difficultyName={currentBeatmap.beatmap?.difficulty || ""}
      />
    </div>
  );
};

export default BeatmapView;
