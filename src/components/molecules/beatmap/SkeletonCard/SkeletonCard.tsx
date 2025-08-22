import React from 'react';

const SkeletonCard: React.FC = () => (
  <div className="card bg-base-100 shadow-xl animate-pulse">
    <div className="h-64 bg-base-300 rounded-t-2xl" />
  </div>
);

export default SkeletonCard;
