import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLeaderboard } from '@/services/api';
import type { Score } from '@/types/leaderboard';

export const useLeaderboard = (selectedRate: number) => {
  const { beatmapId } = useParams();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      if (!beatmapId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await getLeaderboard(beatmapId, selectedRate);
        setScores(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load scores');
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [beatmapId, selectedRate]);

  return {
    scores,
    loading,
    error,
    hasScores: scores.length > 0
  };
};