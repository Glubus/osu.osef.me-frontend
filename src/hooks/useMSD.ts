import { useMemo } from "react";
import type { MSDExtended } from "@/types/beatmap/extended";
import type { MSDDataPoint } from "@/types/beatmap/msd";
import { getRatingColor } from "@/utils/getRatingColor";
import { RADAR_METRICS } from "@/types/charts";
import { COLOR_HEX } from "@/types/colors";

export const useMSD = (msdRates: MSDExtended[] | undefined, selectedRate: number) => {
  // Get current MSD for selected rate
  const currentMSD = useMemo(() => {
    if (!msdRates || msdRates.length === 0) return null;
    return msdRates.find(msd => Number(msd.rate) === selectedRate) || msdRates[0];
  }, [msdRates, selectedRate]);

  // Get available rates
  const availableRates = useMemo(() => {
    if (!msdRates) return [];
    return msdRates.map(msd => Number(msd.rate)).sort((a, b) => a - b);
  }, [msdRates]);

  // Prepare radar chart data
  const radarChartData = useMemo((): MSDDataPoint[] => {
    if (!currentMSD) return [];
    
    return RADAR_METRICS.map(metric => {
      const value = Number(currentMSD[metric.key] ?? 0);
      return {
        name: metric.label,
        value,
        color: getRatingColor(value)
      };
    });
  }, [currentMSD]);

  // Get primary color for charts
  const chartPrimaryColor = useMemo(() => {
    const overall = Number(currentMSD?.overall ?? 0);
    const colorName = getRatingColor(overall);
    return (COLOR_HEX as Record<string, string>)[colorName] ?? COLOR_HEX.blue;
  }, [currentMSD]);

  return {
    currentMSD,
    availableRates,
    radarChartData,
    chartPrimaryColor,
  };
};
