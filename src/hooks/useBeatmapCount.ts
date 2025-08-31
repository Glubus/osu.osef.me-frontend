// hooks/useBeatmapCount.ts
import { useState, useEffect } from 'react';
import type { BeatmapCountResponse } from '@/types/beatmap/count';
import { getBeatmapCount } from '@/services/api/get_beatmap_count';

interface UseBeatmapCountReturn {
  data: BeatmapCountResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook pour récupérer les statistiques de comptage de beatmaps
 */
export const useBeatmapCount = (): UseBeatmapCountReturn => {
  const [data, setData] = useState<BeatmapCountResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getBeatmapCount();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching beatmap count');
      console.error('Error fetching beatmap count:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};
