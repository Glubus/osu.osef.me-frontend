import React from 'react';
import LeaderboardTable from '@/components/molecules/LeaderboardTable';
import { useLeaderboard } from '@/hooks';

interface LeaderboardProps {
  selectedRate: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ selectedRate }) => {
  const { scores, loading, error, hasScores } = useLeaderboard(selectedRate);

  if (loading) {
    return (
      <div className="bg-base-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
        <div className="flex items-center justify-center py-8">
          <div className="loading loading-spinner loading-md"></div>
          <span className="ml-2">Loading scores...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-base-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
        <div className="text-error text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!hasScores) {
    return (
      <div className="bg-base-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
        <div className="text-base-content/60 text-sm">
          No scores found for this rate.
        </div>
      </div>
    );
  }

  return <LeaderboardTable scores={scores} selectedRate={selectedRate} />;
};

export default Leaderboard;
