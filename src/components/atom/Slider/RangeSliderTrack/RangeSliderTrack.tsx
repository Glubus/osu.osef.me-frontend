// src/components/atoms/RangeSliderTrack.tsx
import React from 'react';
import * as Slider from '@radix-ui/react-slider';

const RangeSliderTrack: React.FC = () => (
  <Slider.Track className="bg-base-300 relative grow rounded-full h-2">
    <Slider.Range className="absolute bg-primary rounded-full h-full" />
  </Slider.Track>
);

export default RangeSliderTrack;
