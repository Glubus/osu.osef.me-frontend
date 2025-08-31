import type React from "react";
import type { Filters } from "@/types/beatmap/short";
import Input from "@/components/atoms/Input/Input";
import Select from "@/components/atoms/Select/Select";
import Tooltip from "@/components/atoms/Tooltip/Tooltip";
import { icons } from "lucide-react";

const Info = icons.Info;
export interface FilterSectionProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onReset?: () => void;
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
    <span>{label}</span>
    <Tooltip content={tooltip} position="top">
      <Info size={14} className="text-base-content/60 hover:text-base-content cursor-help" />
    </Tooltip>
  </div>
);

const FilterSection: React.FC<FilterSectionProps> = ({ filters, onFiltersChange, onReset }) => {
  const updateFilter = (key: keyof Filters, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-base-200 rounded-lg p-4 mb-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        {onReset && (
          <button
            onClick={onReset}
            className="btn btn-outline btn-sm"
            title="Reset all filters"
          >
            Reset Filters
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search term */}
        <div className="flex flex-col gap-1">
          <LabelWithTooltip 
            label="Search" 
            tooltip="Search in beatmap title, artist, or creator name" 
          />
          <Input
            id="search-term"
            value={filters.search_term || ""}
            onChange={(value) => updateFilter("search_term", value || undefined)}
            placeholder="Search..."
          />
        </div>

        {/* Overall min */}
        <div className="flex flex-col gap-1">
          <LabelWithTooltip 
            label="Overall min" 
            tooltip="Minimum MSD overall difficulty rating (e.g. 15.0)" 
          />
          <Input
            id="overall-min"
            value={filters.overall_min?.toString() || ""}
            onChange={(value) => updateFilter("overall_min", value ? Number(value) : undefined)}
            placeholder="Min"
            type="number"
          />
        </div>

        {/* Overall max */}
        <div className="flex flex-col gap-1">
          <LabelWithTooltip 
            label="Overall max" 
            tooltip="Maximum MSD overall difficulty rating (e.g. 25.0)" 
          />
          <Input
            id="overall-max"
            value={filters.overall_max?.toString() || ""}
            onChange={(value) => updateFilter("overall_max", value ? Number(value) : undefined)}
            placeholder="Max"
            type="number"
          />
        </div>

        {/* Pattern selection */}
        <div className="flex flex-col gap-1">
          <LabelWithTooltip 
            label="Pattern" 
            tooltip="Filter by specific skillset pattern (Stream, Jumpstream, etc.)" 
          />
          <Select
            id="pattern-select"
            value={filters.selected_pattern || ""}
            onChange={(value) => updateFilter("selected_pattern", value || undefined)}
            options={PATTERN_OPTIONS}
          />
        </div>

        {/* Pattern min (only show if pattern is selected) */}
        {filters.selected_pattern && (
          <div className="flex flex-col gap-1">
            <LabelWithTooltip 
              label="Pattern min" 
              tooltip={`Minimum ${filters.selected_pattern} difficulty rating`} 
            />
            <Input
              id="pattern-min"
              value={filters.pattern_min?.toString() || ""}
              onChange={(value) => updateFilter("pattern_min", value ? Number(value) : undefined)}
              placeholder="Min"
              type="number"
            />
          </div>
        )}

        {/* Pattern max (only show if pattern is selected) */}
        {filters.selected_pattern && (
          <div className="flex flex-col gap-1">
            <LabelWithTooltip 
              label="Pattern max" 
              tooltip={`Maximum ${filters.selected_pattern} difficulty rating`} 
            />
            <Input
              id="pattern-max"
              value={filters.pattern_max?.toString() || ""}
              onChange={(value) => updateFilter("pattern_max", value ? Number(value) : undefined)}
              placeholder="Max"
              type="number"
            />
          </div>
        )}

        {/* Empty space when pattern is not selected */}
        {!filters.selected_pattern && <div></div>}
        {!filters.selected_pattern && <div></div>}
      </div>
    </div>
  );
};

export default FilterSection;
