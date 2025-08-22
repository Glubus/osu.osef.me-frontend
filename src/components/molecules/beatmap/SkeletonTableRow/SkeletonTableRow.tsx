import React from 'react';

const SkeletonTableRow: React.FC = () => {
  return (
    <tr className="animate-pulse">
      <td className="p-3">
        <div className="w-12 h-12 bg-base-300 rounded"></div>
      </td>
      <td className="p-3">
        <div className="space-y-2">
          <div className="h-4 bg-base-300 rounded w-48"></div>
          <div className="h-3 bg-base-300 rounded w-32"></div>
        </div>
      </td>
      <td className="p-3">
        <div className="h-4 bg-base-300 rounded w-20"></div>
      </td>
      <td className="p-3">
        <div className="h-6 bg-base-300 rounded w-16"></div>
      </td>
    </tr>
  );
};

export default SkeletonTableRow;
