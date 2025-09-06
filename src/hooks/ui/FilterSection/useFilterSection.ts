import { useCallback } from 'react';
import type { Filters } from '@/types/beatmap/short';

export interface UseFilterSectionProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export interface UseFilterSectionReturn {
  updateFilter: (key: keyof Filters, value: string | number | undefined) => void;
}

/**
 * Hook pour gérer les interactions avec FilterSection
 * Fournit une fonction updateFilter pour mettre à jour les filtres
 */
export const useFilterSection = ({ 
  filters, 
  onFiltersChange 
}: UseFilterSectionProps): UseFilterSectionReturn => {
  const updateFilter = useCallback((key: keyof Filters, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  }, [filters, onFiltersChange]);

  return {
    updateFilter,
  };
};
