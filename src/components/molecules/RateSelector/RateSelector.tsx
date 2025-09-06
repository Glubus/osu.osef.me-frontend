import React from "react";
import Select, { type SelectOption } from "@/components/atoms/Select/Select";

export interface RateSelectorProps {
  selectedRate: number;
  onRateChange: (rate: number) => void;
  availableRates: number[];
  disabled?: boolean;
}

const RateSelector: React.FC<RateSelectorProps> = ({
  selectedRate,
  onRateChange,
  availableRates,
  disabled = false,
}) => {
  const options: SelectOption[] = availableRates.map(rate => ({
    value: rate,
    label: `${rate.toFixed(1)}x`
  }));

  return (
    <Select
      id="rate-select"
      value={selectedRate}
      onChange={(value) => onRateChange(Number(value))}
      options={options}
      label="Rate"
      disabled={disabled}
    />
  );
};

export default RateSelector;
