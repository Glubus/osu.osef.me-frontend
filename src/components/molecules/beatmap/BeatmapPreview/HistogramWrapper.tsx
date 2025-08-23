import React from "react";
import NPSHistogram from "../NPSHistogram/NPSHistogram";
import type { NPSDataPoint } from "../../../../types/beatmap";

interface HistogramWrapperProps {
  npsData: NPSDataPoint[];
  currentTime: number;
  totalTime: number;
  onBarClick?: (time: number) => void;
}

const HistogramWrapper: React.FC<HistogramWrapperProps> = ({ npsData, currentTime, totalTime, onBarClick }) => (
  <div className="relative" style={{ zIndex: 50 }}>
    <NPSHistogram data={npsData} currentTime={currentTime} totalTime={totalTime} onBarClick={onBarClick} />
  </div>
);

export default HistogramWrapper;
