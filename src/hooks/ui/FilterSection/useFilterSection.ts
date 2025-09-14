import { useCallback, useRef } from 'react';
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
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateFilter = useCallback((key: keyof Filters, value: string | number | undefined) => {
    // Annuler le timeout précédent s'il existe
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Définir un nouveau timeout pour debounce les appels API
    debounceTimeoutRef.current = setTimeout(() => {
      onFiltersChange({
        ...filters,
        [key]: value,
      });
    }, 300); // 300ms de délai
  }, [filters, onFiltersChange]);

  return {
    updateFilter,
  };
};
