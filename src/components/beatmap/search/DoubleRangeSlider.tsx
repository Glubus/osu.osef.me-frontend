import * as React from "react";
import * as Slider from "@radix-ui/react-slider";

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
  step = 0.1
}) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
        <span className="label-text-alt text-base-content/60">
          {value[0].toFixed(1)} - {value[1].toFixed(1)}
        </span>
      </label>
      
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
          <Slider.Track className="bg-base-300 relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-primary rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-primary border-2 border-base-100 rounded-full shadow-lg cursor-pointer transition-all hover:scale-105 focus:scale-110 focus:outline-none" />
          <Slider.Thumb className="block w-4 h-4 bg-primary border-2 border-base-100 rounded-full shadow-lg cursor-pointer transition-all hover:scale-105 focus:scale-110 focus:outline-none" />
        </Slider.Root>
        
        {/* Valeurs affichées */}
        <div className="flex justify-between text-xs text-base-content/60 mt-2">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};

export default DoubleRangeSlider;
