import React, { useState } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import type { AdvancedFiltersProps, BeatmapFilters } from '../../../types/beatmap';
import DoubleRangeSlider from './DoubleRangeSlider';

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  onApplyFilters, 
  loading = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const patternOptions = [
    { value: 'stream', label: 'Stream' },
    { value: 'jumpstream', label: 'Jumpstream' },
    { value: 'handstream', label: 'Handstream' },
    { value: 'jacks', label: 'Jacks' },
    { value: 'chordjacks', label: 'Chordjacks' },
    { value: 'trills', label: 'Trills' },
    { value: 'bursts', label: 'Bursts' },
    { value: 'rolls', label: 'Rolls' }
  ];

  const handleFilterChange = (key: keyof BeatmapFilters, value: string | number | undefined) => {
    const newFilters = { ...filters };
    
    if (value === '' || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value as any;
    }
    
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="w-full">
      {/* Header avec bouton toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-outline btn-sm gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtres avancés
          {hasActiveFilters && (
            <div className="badge badge-primary badge-sm">
              {Object.keys(filters).length}
            </div>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="btn btn-ghost btn-sm gap-2"
            disabled={loading}
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Contenu des filtres */}
      {isExpanded && (
        <div className="card bg-base-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Filtre de difficulté overall */}
            <DoubleRangeSlider
              min={0}
              max={50}
              value={[filters.overall_min || 0, filters.overall_max || 50]}
              onChange={([min, max]) => {
                const newFilters = { ...filters };
                newFilters.overall_min = min;
                newFilters.overall_max = max;
                onFiltersChange(newFilters);
              }}
              disabled={loading}
              label="Difficulté Overall"
            />

            {/* Filtre de pattern */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Pattern</span>
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={filters.selected_pattern || ''}
                onChange={(e) => handleFilterChange('selected_pattern', e.target.value || undefined)}
                disabled={loading}
              >
                <option value="">Tous les patterns</option>
                {patternOptions.map((pattern) => (
                  <option key={pattern.value} value={pattern.value}>
                    {pattern.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre de difficulté pattern */}
            <DoubleRangeSlider
              min={0}
              max={50}
              value={[filters.pattern_min || 0, filters.pattern_max || 50]}
              onChange={([min, max]) => {
                const newFilters = { ...filters };
                newFilters.pattern_min = min;
                newFilters.pattern_max = max;
                onFiltersChange(newFilters);
              }}
              disabled={loading || !filters.selected_pattern}
              label="Difficulté Pattern"
            />


          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setIsExpanded(false)}
              className="btn btn-ghost btn-sm"
              disabled={loading}
            >
              <X className="w-4 h-4" />
              Fermer
            </button>
            <button
              onClick={onApplyFilters}
              className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
