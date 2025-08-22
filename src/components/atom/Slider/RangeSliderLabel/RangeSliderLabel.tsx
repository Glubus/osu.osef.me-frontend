// src/components/atoms/RangeSliderLabel.tsx
import React from 'react';

type Props = {
  label: string;
  value: [number, number];
};

const RangeSliderLabel: React.FC<Props> = ({ label, value }) => (
  <label className="label justify-between">
    <span className="label-text font-medium">{label}</span>
    <span className="label-text-alt text-base-content/60">
      {value[0].toFixed(1)} - {value[1].toFixed(1)}
    </span>
  </label>
);

export default RangeSliderLabel;
