import { useInfiniteQuery } from '@tanstack/react-query';
import { getBeatmaps } from "@/services/api/get_beatmap";
import type { Filters } from "@/types/beatmap/short";
import { useMemo } from 'react';

export const useBeatmapList = (filters: Filters) => {
  // Créer une clé de query stable basée sur les filtres
  const queryKey = useMemo(() => [
    'beatmaps',
    filters.search_term,
    filters.overall_min,
    filters.overall_max,
    filters.selected_pattern,
    filters.pattern_min,
    filters.pattern_max
  ], [
    filters.search_term,
    filters.overall_min,
    filters.overall_max,
    filters.selected_pattern,
    filters.pattern_min,
    filters.pattern_max
  ]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
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
    enabled: true, // Toujours activé, les queries se déclenchent automatiquement quand les deps changent
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
    if (beatmaps.length === 0 && !isFetching) {
      refetch();
    }
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
