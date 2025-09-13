import React from 'react';
import ScoreRow from '@/components/atoms/ScoreRow';
import type { Score } from '@/types/leaderboard';

interface LeaderboardTableProps {
  scores: Score[];
  selectedRate: number;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ scores, selectedRate }) => {
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Leaderboard ({selectedRate}x)</h3>
      
      <div className="overflow-x-auto">
        <table className="table table-sm w-full">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
              <th>Accuracy</th>
              <th>Marv</th>
              <th>Perf</th>
              <th>Great</th>
              <th>Good</th>
              <th>Bad</th>
              <th>Miss</th>
              <th>Max Combo</th>
              <th>Mods</th>
              <th>Pause</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <ScoreRow key={score.id} score={score} rank={index + 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
