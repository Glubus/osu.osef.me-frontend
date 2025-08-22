import React from 'react';
import Badge from '../../../atom/Badge/Badge';
import './BeatmapHeaderInfo.module.css';

type Props = {
  overall: string;
  difficulty: string;
};

const getOverallColor = (overall: string) => {
  const num = parseFloat(overall);
  if (num < 2) return 'badge-success';
  if (num < 4) return 'badge-info';
  if (num < 6) return 'badge-warning';
  if (num < 8) return 'badge-error';
  return 'badge-accent';
};

const BeatmapHeaderInfo: React.FC<Props> = ({ overall, difficulty }) => (
  <div className="flex justify-between items-start">
    <div className="flex flex-wrap gap-1">
      <Badge color={getOverallColor(overall)}>
        {overall}★
      </Badge>
    </div>
    <div className="text-right">
      <div className="text-sm font-semibold text-primary-content">
        {difficulty}
      </div>
    </div>
  </div>
);

export default BeatmapHeaderInfo;
