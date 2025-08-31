import { useState, useEffect, useCallback } from "react";
import { z } from 'zod';
import type { Filters } from "@/types/beatmap/short";

const STORAGE_KEY = "beatmap-filters";

// Schéma Zod pour valider les filtres
const FiltersSchema = z.object({
  page: z.number().int().min(1).default(1),
  per_page: z.number().int().min(1).max(1000).default(100),
  search_term: z.string().trim().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  overall_min: z.number().min(0).max(50).optional(),
  overall_max: z.number().min(0).max(50).optional(),
  selected_pattern: z.string().trim().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  pattern_min: z.number().min(0).optional(),
  pattern_max: z.number().min(0).optional(),
}).refine(
  (data) => !data.overall_min || !data.overall_max || data.overall_min <= data.overall_max,
  {
    message: "overall_min doit être inférieur ou égal à overall_max",
    path: ["overall_max"],
  }
).refine(
  (data) => !data.pattern_min || !data.pattern_max || data.pattern_min <= data.pattern_max,
  {
    message: "pattern_min doit être inférieur ou égal à pattern_max",
    path: ["pattern_max"],
  }
);

type ValidatedFilters = z.infer<typeof FiltersSchema>;

const defaultFilters: ValidatedFilters = {
  page: 1,
  per_page: 100,
};

/**
 * Hook pour gérer les filtres de recherche avec validation et persistance localStorage
 * Utilise Zod pour valider les données et s'assurer de leur cohérence
 */
export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  // Fonction utilitaire pour charger et valider les filtres depuis localStorage
  const loadFiltersFromStorage = useCallback((): Filters => {
    try {
      const savedFilters = localStorage.getItem(STORAGE_KEY);
      if (!savedFilters) {
        return defaultFilters;
      }

      const parsedFilters = JSON.parse(savedFilters);
      
      // Validation avec Zod
      const validationResult = FiltersSchema.safeParse(parsedFilters);
      
      if (validationResult.success) {
        // Toujours commencer à la page 1 au chargement
        return {
          ...validationResult.data,
          page: 1,
        };
      } else {
        console.warn('Filtres localStorage invalides:', validationResult.error.format());
        return defaultFilters;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des filtres depuis localStorage:', error);
      return defaultFilters;
    }
  }, []);

  // Fonction utilitaire pour sauvegarder les filtres dans localStorage
  const saveFiltersToStorage = useCallback((filtersToSave: Filters) => {
    try {
      // Ne pas sauvegarder la page actuelle
      const { page, ...persistentFilters } = filtersToSave;
      const filtersWithDefaultPage = { ...persistentFilters, page: 1 };
      
      // Valider avant de sauvegarder
      const validationResult = FiltersSchema.safeParse(filtersWithDefaultPage);
      
      if (validationResult.success) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validationResult.data));
      } else {
        console.warn('Impossible de sauvegarder des filtres invalides:', validationResult.error.format());
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des filtres:', error);
    }
  }, []);

  // Charger les filtres sauvegardés au démarrage
  useEffect(() => {
    const loadedFilters = loadFiltersFromStorage();
    setFilters(loadedFilters);
  }, [loadFiltersFromStorage]);

  // Mettre à jour les filtres avec validation
  const updateFilters = useCallback((newFilters: Filters) => {
    // Valider les nouveaux filtres
    const validationResult = FiltersSchema.safeParse(newFilters);
    
    if (validationResult.success) {
      const validatedFilters = validationResult.data;
      setFilters(validatedFilters);
      saveFiltersToStorage(validatedFilters);
    } else {
      console.error('Filtres invalides fournis à updateFilters:', validationResult.error.format());
      // En cas d'erreur, on garde les filtres actuels sans les modifier
    }
  }, [saveFiltersToStorage]);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression des filtres du localStorage:', error);
    }
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
};
