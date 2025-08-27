import type React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { MSDExtended } from "@/types/beatmap/extended";
import { MSD_METRICS } from "@/types/charts";

type MSDRatesLineChartProps = {
  msdRates: MSDExtended[];
  height?: number; // pixels, defaults to 260 for a more elongated look
};

const MSDRatesLineChart: React.FC<MSDRatesLineChartProps> = ({ msdRates, height = 260 }) => {
  if (!msdRates || msdRates.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">📈</div>
                     <p className="text-base-content/60">No MSD rate data</p>
        </div>
      </div>
    );
  }

  const data = [...msdRates]
    .map((m) => ({
      rate: Number(m.rate ?? 0),
      overall: Number(m.overall ?? 0),
      stream: Number(m.stream ?? 0),
      jumpstream: Number(m.jumpstream ?? 0),
      handstream: Number(m.handstream ?? 0),
      stamina: Number(m.stamina ?? 0),
      jackspeed: Number(m.jackspeed ?? 0),
      chordjack: Number(m.chordjack ?? 0),
      technical: Number(m.technical ?? 0),
    }))
    .sort((a, b) => a.rate - b.rate);

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="rate" tickFormatter={(v) => `${Number(v).toFixed(1)}x`} stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" domain={[0, "dataMax"]} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#e5e7eb" }}
            labelFormatter={(v) => `Rate: ${Number(v).toFixed(1)}x`}
          />
          <Legend />
          {MSD_METRICS.map((m) => (
            <Line
              key={m.key}
              type="monotone"
              dataKey={m.key}
              name={m.label}
              stroke={m.color}
              dot={{ r: 2 }}
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MSDRatesLineChart;


