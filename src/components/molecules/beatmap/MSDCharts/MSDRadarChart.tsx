import type React from "react";
import {
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import type { MSDDataPoint } from "../../../../types/beatmap";
import CustomTooltip from "../../../atom/CustomToolTip/CustomToolTip";

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
