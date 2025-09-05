import React from "react";
import type { Filters } from "@/types/beatmap/short";
import { SearchInput, MinMaxRange, PatternSelect } from "@/components/atoms";
import { useFilterSection } from "@/hooks/molecules";
export interface FilterSectionProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onReset?: () => void;
}


const FilterSection: React.FC<FilterSectionProps> = ({ filters, onFiltersChange, onReset }) => {
  const { updateFilter } = useFilterSection({ filters, onFiltersChange });

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
        <SearchInput
          value={filters.search_term || ""}
          onChange={(value) => updateFilter("search_term", value || undefined)}
        />

        {/* Overall difficulty range */}
        <MinMaxRange
          idPrefix="overall"
          label="Overall"
          tooltip="MSD overall difficulty rating (e.g. 15.0-25.0)"
          minValue={filters.overall_min}
          maxValue={filters.overall_max}
          onMinChange={(value) => updateFilter("overall_min", value)}
          onMaxChange={(value) => updateFilter("overall_max", value)}
        />

        {/* BPM range */}
        <MinMaxRange
          idPrefix="bpm"
          label="BPM"
          tooltip="BPM (beats per minute)"
          minValue={filters.bpm_min}
          maxValue={filters.bpm_max}
          onMinChange={(value) => updateFilter("bpm_min", value)}
          onMaxChange={(value) => updateFilter("bpm_max", value)}
        />

        {/* Length range */}
        <MinMaxRange
          idPrefix="total-time"
          label="Length"
          tooltip="Song length in seconds"
          minValue={filters.total_time_min}
          maxValue={filters.total_time_max}
          onMinChange={(value) => updateFilter("total_time_min", value)}
          onMaxChange={(value) => updateFilter("total_time_max", value)}
          minPlaceholder="Min (s)"
          maxPlaceholder="Max (s)"
        />

        {/* Pattern selection */}
        <PatternSelect
          value={filters.selected_pattern || ""}
          onChange={(value) => updateFilter("selected_pattern", value || undefined)}
        />

        {/* Pattern difficulty range (only show if pattern is selected) */}
        {filters.selected_pattern && (
          <MinMaxRange
            idPrefix="pattern"
            label="Pattern"
            tooltip={`${filters.selected_pattern} difficulty rating`}
            minValue={filters.pattern_min}
            maxValue={filters.pattern_max}
            onMinChange={(value) => updateFilter("pattern_min", value)}
            onMaxChange={(value) => updateFilter("pattern_max", value)}
          />
        )}
      </div>
    </div>
  );
};

export default FilterSection;
