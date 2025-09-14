import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "beatmap-filters";

export interface Filters {
  page?: number;
  per_page?: number;
  search_term?: string;
  overall_min?: number;
  overall_max?: number;
  selected_pattern?: string;
  pattern_min?: number;
  pattern_max?: number;
  bpm_min?: number;
  bpm_max?: number;
  total_time_min?: number;
  total_time_max?: number;
}

const defaultFilters: Filters = {
  page: 1,
  per_page: 100,
};

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  // Charger au démarrage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFilters({ ...parsed, page: 1 });
      }
    } catch {
      setFilters(defaultFilters);
    }
  }, []);

  // Sauvegarder
  const save = useCallback((f: Filters) => {
    try {
      const { page, ...toSave } = f;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  }, []);

  // Mettre à jour
  const updateFilters = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    save(newFilters);
  }, [save]);

  // Reset
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { filters, updateFilters, resetFilters };
};