import React from 'react';
import Select from '../../atoms/Select/Select';
import type { StatusFilter, CategoryFilter, PriorityFilter } from '../../../types/roadmap';

interface RoadmapFiltersProps {
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  categoryFilter: CategoryFilter;
  setCategoryFilter: (filter: CategoryFilter) => void;
  priorityFilter: PriorityFilter;
  setPriorityFilter: (filter: PriorityFilter) => void;
}

export const RoadmapFilters: React.FC<RoadmapFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'finished', label: 'Finished' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'planned', label: 'Planned' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'core', label: 'Core' },
    { value: 'features', label: 'Features' },
    { value: 'ui', label: 'UI/UX' },
    { value: 'technical', label: 'Technical' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'social', label: 'Social' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-8 p-4 rounded-lg">
      <div className="flex-1 min-w-[200px]">
        <Select
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as StatusFilter)}
          options={statusOptions}
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <Select
          value={categoryFilter}
          onChange={(value) => setCategoryFilter(value as CategoryFilter)}
          options={categoryOptions}
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <Select
          value={priorityFilter}
          onChange={(value) => setPriorityFilter(value as PriorityFilter)}
          options={priorityOptions}
        />
      </div>
    </div>
  );
};
