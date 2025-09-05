import React from "react";
import Select from "../Select/Select";
import Tooltip from "../Tooltip/Tooltip";
import { icons } from "lucide-react";

const Info = icons.Info;

export interface PatternSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const PATTERN_OPTIONS = [
  { value: "", label: "All patterns" },
  { value: "stream", label: "Stream" },
  { value: "jumpstream", label: "Jumpstream" },
  { value: "handstream", label: "Handstream" },
  { value: "stamina", label: "Stamina" },
  { value: "jackspeed", label: "Jackspeed" },
  { value: "chordjack", label: "Chordjack" },
  { value: "technical", label: "Technical" },
];

// Helper component for labels with tooltips
const LabelWithTooltip: React.FC<{ label: string; tooltip: string }> = ({ label, tooltip }) => (
  <div className="flex items-center gap-1">
    <span className="text-sm font-medium text-base-content">{label}</span>
    <Tooltip content={tooltip} position="top">
      <Info size={14} className="text-base-content/60 hover:text-base-content cursor-help" />
    </Tooltip>
  </div>
);

const PatternSelect: React.FC<PatternSelectProps> = ({
  id = "pattern-select",
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <LabelWithTooltip 
        label="Pattern" 
        tooltip="Filter by specific skillset pattern (Stream, Jumpstream, etc.)" 
      />
      <Select
        id={id}
        value={value}
        onChange={onChange}
        options={PATTERN_OPTIONS}
      />
    </div>
  );
};

export default PatternSelect;
