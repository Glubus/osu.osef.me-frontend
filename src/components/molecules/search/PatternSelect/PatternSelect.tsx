// src/components/molecules/PatternSelect.tsx
import React from 'react';
import Select from '../../../atom/Select/Select';

type PatternSelectProps = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
};

const patternOptions = [
  { value: 'stream', label: 'Stream' },
  { value: 'jumpstream', label: 'Jumpstream' },
  { value: 'handstream', label: 'Handstream' },
  { value: 'stamina', label: 'Stamina' },
  { value: 'jackspeed', label: 'Jackspeed' },
  { value: 'chordjack', label: 'Chordjack' },
  { value: 'technical', label: 'Technical' },
];

const PatternSelect: React.FC<PatternSelectProps> = ({ value, onChange, disabled }) => {
  return (
    <Select
      label="Pattern"
      value={value || ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      options={patternOptions}
      defaultOptionLabel="Tous les patterns"
      disabled={disabled}
    />
  );
};

export default PatternSelect;
