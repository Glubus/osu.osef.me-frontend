import { useState, useEffect, useCallback } from "react";
import { z } from 'zod';

const STORAGE_KEY = "beatmap-filters";

// Schéma Zod pour valider les filtres
const FiltersSchema = z.object({
  page: z.number().int().min(1).default(1),
  per_page: z.number().int().min(1).max(1000).default(100),
  search_term: z.string().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  overall_min: z.number().min(0).max(50).optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  overall_max: z.number().min(0).max(50).optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  selected_pattern: z.string().trim().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  pattern_min: z.number().min(0).optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  pattern_max: z.number().min(0).optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  bpm_min: z.number().min(0).optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  bpm_max: z.number().min(0).optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  total_time_min: z.number().int().min(0).optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  total_time_max: z.number().int().min(0).optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
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
).refine(
  (data) => !data.bpm_min || !data.bpm_max || data.bpm_min <= data.bpm_max,
  {
    message: "bpm_min doit être inférieur ou égal à bpm_max",
    path: ["bpm_max"],
  }
).refine(
  (data) => !data.total_time_min || !data.total_time_max || data.total_time_min <= data.total_time_max,
  {
    message: "total_time_min doit être inférieur ou égal à total_time_max",
    path: ["total_time_max"],
  }
);

type ValidatedFilters = z.infer<typeof FiltersSchema>;

const defaultFilters: Partial<ValidatedFilters> = {
  page: 1,
  per_page: 100,
};

/**
 * Hook pour gérer les filtres de recherche avec validation et persistance localStorage
 * Utilise Zod pour valider les données et s'assurer de leur cohérence
 */
export const useFilters = () => {
  const [filters, setFilters] = useState<Partial<ValidatedFilters>>(defaultFilters);

  // Fonction utilitaire pour charger et valider les filtres depuis localStorage
  const loadFiltersFromStorage = useCallback((): Partial<ValidatedFilters> => {
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
  const saveFiltersToStorage = useCallback((filtersToSave: Partial<ValidatedFilters>) => {
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

  // Mettre à jour les filtres avec validation et ajustement automatique
  const updateFilters = useCallback((newFilters: Partial<ValidatedFilters>) => {
    // Ajustement automatique des valeurs avec une fonction utilitaire
    const adjustFilters = (filters: Partial<ValidatedFilters>): Partial<ValidatedFilters> => {
      const adjusted = { ...filters };
      
      // Nettoyer les valeurs undefined pour éviter les problèmes de validation
      Object.keys(adjusted).forEach(key => {
        if (adjusted[key as keyof Partial<ValidatedFilters>] === undefined) {
          delete adjusted[key as keyof Partial<ValidatedFilters>];
        }
      });
      
      // Limiter les valeurs overall à 50 maximum
      if (adjusted.overall_min && adjusted.overall_min > 50) {
        adjusted.overall_min = 50;
      }
      if (adjusted.overall_max && adjusted.overall_max > 50) {
        adjusted.overall_max = 50;
      }
      
      // Ajustement automatique : si min > max, on met max = min
      const adjustMinMax = (minKey: keyof Partial<ValidatedFilters>, maxKey: keyof Partial<ValidatedFilters>) => {
        const min = adjusted[minKey] as number | undefined;
        const max = adjusted[maxKey] as number | undefined;
        if (min && max && min > max) {
          (adjusted as any)[maxKey] = min;
        }
      };
      
      adjustMinMax('overall_min', 'overall_max');
      adjustMinMax('pattern_min', 'pattern_max');
      adjustMinMax('bpm_min', 'bpm_max');
      adjustMinMax('total_time_min', 'total_time_max');
      
      return adjusted;
    };
    
    const adjustedFilters = adjustFilters(newFilters);
    
    // Valider les filtres ajustés
    const validationResult = FiltersSchema.safeParse(adjustedFilters);
    
    if (validationResult.success) {
      const validatedFilters = validationResult.data;
      
      // Vérifier si les filtres ont vraiment changé pour éviter les re-renders inutiles
      const hasChanged = Object.keys(validatedFilters).some(key => {
        const currentValue = filters[key as keyof Partial<ValidatedFilters>];
        const newValue = validatedFilters[key as keyof ValidatedFilters];
        return currentValue !== newValue;
      });
      
      if (hasChanged) {
        setFilters(validatedFilters);
        saveFiltersToStorage(validatedFilters);
      }
    } else {
      console.error('Filtres invalides fournis à updateFilters:', validationResult.error.format());
      // En cas d'erreur, on garde les filtres actuels sans les modifier
    }
  }, [saveFiltersToStorage, filters]);

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
