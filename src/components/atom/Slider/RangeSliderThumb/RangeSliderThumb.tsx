// src/components/atoms/RangeSliderThumb.tsx
import React from 'react';
import * as Slider from '@radix-ui/react-slider';

const RangeSliderThumb: React.FC = () => (
  <Slider.Thumb
    className="block w-4 h-4 bg-primary border-2 border-base-100 rounded-full shadow-lg cursor-pointer transition-all hover:scale-105 focus:scale-110 focus:outline-none"
  />
);

export default RangeSliderThumb;
