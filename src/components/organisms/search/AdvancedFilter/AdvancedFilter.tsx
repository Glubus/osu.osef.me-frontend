// src/components/organisms/AdvancedFilters/index.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { AdvancedFiltersProps, BeatmapFilters } from '../../../../types/beatmap';
import DoubleRangeSlider from '../../../molecules/search/DoubleRangeSlider/DoubleRangeSlider';
import PatternSelect from '../../../molecules/search/PatternSelect/PatternSelect';
import FilterHeader from '../../../molecules/search/FilterHeader/FilterHeader';
import Button from '../../../atom/Button/Button';

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  loading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof BeatmapFilters, value: string | number | undefined) => {
    const newFilters = { ...filters };

    if (value === '' || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value as any;
    }

    onFiltersChange(newFilters);
  };

  const handleReset = () => onFiltersChange({});

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="w-full">
      <FilterHeader
        isExpanded={isExpanded}
        toggleExpanded={() => setIsExpanded(!isExpanded)}
        hasFilters={hasActiveFilters}
        onReset={handleReset}
        loading={loading}
        filterCount={Object.keys(filters).length}
      />

      {isExpanded && (
        <div className="card bg-base-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DoubleRangeSlider
              min={0}
              max={50}
              value={[filters.overall_min || 0, filters.overall_max || 50]}
              onChange={([min, max]) =>
                onFiltersChange({ ...filters, overall_min: min, overall_max: max })
              }
              disabled={loading}
              label="Difficulté Overall"
            />

            <PatternSelect
              value={filters.selected_pattern}
              onChange={(val) => handleFilterChange('selected_pattern', val)}
              disabled={loading}
            />

            <DoubleRangeSlider
              min={0}
              max={50}
              value={[filters.pattern_min || 0, filters.pattern_max || 50]}
              onChange={([min, max]) =>
                onFiltersChange({ ...filters, pattern_min: min, pattern_max: max })
              }
              disabled={loading || !filters.selected_pattern}
              label="Difficulté Pattern"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsExpanded(false)} variant="outline" size="sm" disabled={loading}>
              <X className="w-4 h-4" />
              Fermer
            </Button>
            <Button
              onClick={onApplyFilters}
              variant="primary"
              size="sm"
              disabled={loading}
              className={loading ? 'loading' : ''}
            >
              Appliquer les filtres
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
