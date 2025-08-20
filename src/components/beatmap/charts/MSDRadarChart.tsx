import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import type { MSDDataPoint } from '../../../types/beatmap';

interface MSDRadarChartProps {
  data: MSDDataPoint[];
}

const MSDRadarChart: React.FC<MSDRadarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-base-content/60">Aucune donnée MSD disponible</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
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

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
          <Radar
            name="MSD"
            dataKey="value"
            stroke="hsl(var(--p))"
            fill="hsl(var(--p) / 0.2)"
            fillOpacity={0.6}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MSDRadarChart;
