import type React from "react";
import { memo } from "react";
import type { MSDExtended } from "@/types/beatmap/extended";
import MSDRadarChart from "@/components/molecules/MSDRadarCharts/MSDRadarChart";
import RateSelector from "@/components/molecules/RateSelector/RateSelector";
import Leaderboard from "@/components/organisms/Leaderboard";
import { useMSD } from "@/hooks";

export interface BeatmapMSDViewProps {
  msdRates: MSDExtended[] | undefined;
  selectedRate: number;
  onRateChange: (rate: number) => void;
  difficultyName: string;
}

const BeatmapMSDView: React.FC<BeatmapMSDViewProps> = memo(({
  msdRates,
  selectedRate,
  onRateChange,
  difficultyName,
}) => {
  const { currentMSD, availableRates, radarChartData, chartPrimaryColor } = useMSD(msdRates, selectedRate);

  if (!currentMSD) {
    return <p className="text-base-content/60">No MSD data available</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">
          MSD for {difficultyName}:
        </h2>
        {availableRates.length > 1 && (
          <RateSelector
            selectedRate={selectedRate}
            onRateChange={onRateChange}
            availableRates={availableRates}
          />
        )}
      </div>
      
      <MSDRadarChart data={radarChartData} primaryColor={chartPrimaryColor} />
      
      <div className="mt-4">
        <Leaderboard selectedRate={selectedRate} />
      </div>
    </>
  );
});

BeatmapMSDView.displayName = 'BeatmapMSDView';

export default BeatmapMSDView;
