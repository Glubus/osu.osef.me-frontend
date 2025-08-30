import { useState, useEffect, useCallback } from "react";
import type { Filters } from "@/types/beatmap/short";

const STORAGE_KEY = "beatmap-filters";

const defaultFilters: Filters = {
  page: 1,
  per_page: 100,
};

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  // Charger les filtres sauvegardés au démarrage
  useEffect(() => {
    const savedFilters = localStorage.getItem(STORAGE_KEY);
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        // S'assurer que les valeurs numériques sont bien des nombres
        const validatedFilters = {
          ...parsedFilters,
          page: 1, // Toujours commencer à la page 1
          per_page: parsedFilters.per_page || 100,
          overall_min: parsedFilters.overall_min ? Number(parsedFilters.overall_min) : undefined,
          overall_max: parsedFilters.overall_max ? Number(parsedFilters.overall_max) : undefined,
          pattern_min: parsedFilters.pattern_min ? Number(parsedFilters.pattern_min) : undefined,
          pattern_max: parsedFilters.pattern_max ? Number(parsedFilters.pattern_max) : undefined,
        };
        setFilters(validatedFilters);
      } catch (error) {
        console.error("Error parsing saved filters:", error);
        setFilters(defaultFilters);
      }
    }
  }, []);

  // Sauvegarder les filtres quand ils changent
  const updateFilters = useCallback((newFilters: Filters) => {
    const filtersToSave = {
      ...newFilters,
      page: 1, // Ne pas sauvegarder la page actuelle
    };
    
    setFilters(newFilters);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtersToSave));
  }, []);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
};
