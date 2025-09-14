import { useInfiniteQuery } from '@tanstack/react-query';
import { getBeatmaps } from "@/services/api/get_beatmap";
import type { Filters } from "@/types/beatmap/short";
import { useMemo } from 'react';

export const useBeatmapList = (filters: Filters) => {
  // Créer une clé de query stable basée sur les filtres
  const queryKey = useMemo(() => {
    // Créer un objet stable avec seulement les propriétés définies
    const stableFilters = {
      search_term: filters.search_term,
      overall_min: filters.overall_min,
      overall_max: filters.overall_max,
      selected_pattern: filters.selected_pattern,
      pattern_min: filters.pattern_min,
      pattern_max: filters.pattern_max,
      bpm_min: filters.bpm_min,
      bpm_max: filters.bpm_max,
      total_time_min: filters.total_time_min,
      total_time_max: filters.total_time_max,
    };
    
    return ['beatmaps', stableFilters];
  }, [filters]); // Une seule dépendance : l'objet filters complet

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const filtersWithPage = {
        ...filters,
        page: pageParam,
      };
      return getBeatmaps(filtersWithPage);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: true,
    refetchOnWindowFocus: false, // Désactiver le refetch automatique au focus
    refetchOnMount: false, // Désactiver le refetch automatique au mount
    refetchOnReconnect: false, // Désactiver le refetch automatique à la reconnexion
    staleTime: 5 * 60 * 1000, // Considérer les données comme fraîches pendant 5 minutes
    gcTime: 10 * 60 * 1000, // Garder en cache pendant 10 minutes
    retry: 1, // Réduire le nombre de tentatives
    retryDelay: 1000, // Délai entre les tentatives
  });

  // Transformer les données pour garder la même interface
  const beatmaps = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.beatmaps);
  }, [data?.pages]);

  const loading = status === 'pending';
  const loadingMore = isFetchingNextPage;
  const hasMore = hasNextPage;
  const errorMessage = error ? (error instanceof Error ? error.message : 'Error loading beatmaps') : null;

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const loadFirstPage = () => {
    // Ne plus forcer le refetch, React Query gère automatiquement le premier appel
    // if (beatmaps.length === 0 && !isFetching) {
    //   refetch();
    // }
  };

  return {
    beatmaps,
    loading,
    loadingMore,
    error: errorMessage,
    hasMore,
    loadMore,
    loadFirstPage,
  };
};
