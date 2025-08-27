import type React from "react";
import type { MSDExtended } from "@/types/beatmap/extended";
import MSDRadarChart from "@/components/molecules/MSDRadarCharts/MSDRadarChart";
import MSDRatesLineChart from "@/components/molecules/MSDRatesLineChart/MSDRatesLineChart";
import RateSelector from "@/components/molecules/RateSelector/RateSelector";
import { useMSD } from "@/hooks/useMSD";

export interface BeatmapMSDViewProps {
  msdRates: MSDExtended[] | undefined;
  selectedRate: number;
  onRateChange: (rate: number) => void;
  difficultyName: string;
}

const BeatmapMSDView: React.FC<BeatmapMSDViewProps> = ({
  msdRates,
  selectedRate,
  onRateChange,
  difficultyName,
}) => {
  const { currentMSD, availableRates, radarChartData, chartPrimaryColor } = useMSD(msdRates, selectedRate);

  if (!currentMSD) {
    return <p className="text-gray-400">No MSD data available</p>;
  }

  return (
    <div className="mb-6">
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
      
      <div className="flex gap-4">
        {/* Left column 2/3: radar + line chart */}
        <div className="w-2/3 bg-gray-800 rounded-lg p-4">
          <MSDRadarChart data={radarChartData} primaryColor={chartPrimaryColor} />
          <div className="mt-4">
                         <h3 className="text-md font-semibold mb-2">Rate evolution</h3>
            {msdRates && msdRates.length > 0 ? (
              <MSDRatesLineChart msdRates={msdRates} height={320} />
            ) : (
                             <p className="text-gray-400 text-sm">No rate data</p>
            )}
          </div>
        </div>
        {/* Right column 1/3: empty for now */}
        <div className="w-1/3 bg-gray-800 rounded-lg p-4">
          {/* Reserved space for future content */}
        </div>
      </div>
    </div>
  );
};

export default BeatmapMSDView;
