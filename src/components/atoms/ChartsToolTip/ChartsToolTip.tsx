// src/components/atoms/ChartsToolTip.tsx
import React from "react";

interface ChartsTooltipProps {
  active?: boolean;
  payload?: { value: string }[];
  label?: string;
}

export const ChartsTooltip: React.FC<ChartsTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-200 p-3 border border-base-300 rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-primary">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default ChartsTooltip;