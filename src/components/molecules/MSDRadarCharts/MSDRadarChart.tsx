import React from "react";
import {
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import type { MSDDataPoint } from "@/types/beatmap/msd";
import { ChartsTooltip } from "@/components/atoms/ChartsToolTip/ChartsToolTip";
import { COLOR_HEX } from "@/types/colors";

interface MSDRadarChartProps {
	data: MSDDataPoint[];
	primaryColor: string; // color from getRatingColor(overall)
}

// Custom dot with per-point color from payload.color (BadgeColor name)
const ColoredDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null) return null;
  // Recharts sometimes nests original datum under payload.payload
  const colorName = (payload?.color || payload?.payload?.color) as string | undefined;
  const fill = (colorName && (COLOR_HEX as Record<string, string>)[colorName]) || COLOR_HEX.blue;
  return <circle cx={cx} cy={cy} r={4} fill={fill} stroke={fill} />;
};

const MSDRadarChart: React.FC<MSDRadarChartProps> = ({ data, primaryColor }) => {
	if (!data || data.length === 0) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<div className="text-6xl mb-4">📊</div>
					         <p className="text-base-content/60">No MSD data available</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-96">
			<ResponsiveContainer width="100%" height="100%">
				<RadarChart data={data}>
					<PolarGrid />
					<PolarAngleAxis dataKey="name" />
					<PolarRadiusAxis angle={30} domain={[0, "dataMax"]} />
					<Radar
						name="MSD"
						dataKey="value"
						stroke={primaryColor}
						fill={primaryColor}
						fillOpacity={0.2}
						strokeWidth={2}
						dot={<ColoredDot />}
						activeDot={<ColoredDot />}
					/>
					<Tooltip content={<ChartsTooltip />} />
				</RadarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default MSDRadarChart;
