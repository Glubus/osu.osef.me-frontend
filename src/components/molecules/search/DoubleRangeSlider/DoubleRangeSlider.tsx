// src/components/molecules/DoubleRangeSlider.tsx
import type React from "react";
import * as Slider from "@radix-ui/react-slider";
import RangeSliderTrack from "../../../atom/Slider/RangeSliderTrack/RangeSliderTrack";
import RangeSliderThumb from "../../../atom/Slider/RangeSliderThumb/RangeSliderThumb";
import RangeSliderLabel from "../../../atom/Slider/RangeSliderLabel/RangeSliderLabel";

interface DoubleRangeSliderProps {
	min: number;
	max: number;
	value: [number, number];
	onChange: (value: [number, number]) => void;
	disabled?: boolean;
	label: string;
	step?: number;
}

const DoubleRangeSlider: React.FC<DoubleRangeSliderProps> = ({
	min,
	max,
	value,
	onChange,
	disabled = false,
	label,
	step = 0.1,
}) => {
	return (
		<div className="form-control w-full">
			<RangeSliderLabel label={label} value={value} />

			<div className="py-4">
				<Slider.Root
					className="relative flex items-center select-none touch-none w-full h-5"
					value={value}
					onValueChange={(newValue) => onChange([newValue[0], newValue[1]])}
					max={max}
					min={min}
					step={step}
					disabled={disabled}
				>
					<RangeSliderTrack />
					<RangeSliderThumb />
					<RangeSliderThumb />
				</Slider.Root>

				<div className="flex justify-between text-xs text-base-content/60 mt-2">
					<span>{min}</span>
					<span>{max}</span>
				</div>
			</div>
		</div>
	);
};

export default DoubleRangeSlider;
