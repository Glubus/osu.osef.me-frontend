import { useCallback } from 'react';
import type { Filters } from '@/types/beatmap/short';

export interface UseFilterSectionProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export const useFilterSection = ({ filters, onFiltersChange }: UseFilterSectionProps) => {
  const updateFilter = useCallback((key: keyof Filters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  return { updateFilter };
};