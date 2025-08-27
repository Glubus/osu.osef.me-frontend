import { useState, useMemo } from 'react';
import roadmapData from '../data/roadmap.json';
import { RoadmapItem, StatusFilter, CategoryFilter, PriorityFilter } from '../types/roadmap';

export const useRoadmap = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  const filteredRoadmap = useMemo(() => {
    return roadmapData.roadmap.filter((item: RoadmapItem) => {
      const statusMatch = statusFilter === 'all' || item.status === statusFilter;
      const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;
      const priorityMatch = priorityFilter === 'all' || item.priority === priorityFilter;
      
      return statusMatch && categoryMatch && priorityMatch;
    });
  }, [statusFilter, categoryFilter, priorityFilter]);

  const getStatusColor = (status: RoadmapItem['status']) => {
    switch (status) {
      case 'finished':
        return '#10b981'; // green
      case 'in-progress':
        return '#f59e0b'; // amber
      case 'planned':
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: RoadmapItem['priority']) => {
    switch (priority) {
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f59e0b'; // amber
      case 'low':
        return '#10b981'; // green
      default:
        return '#6b7280';
    }
  };

  const getCategoryColor = (category: RoadmapItem['category']) => {
    switch (category) {
      case 'core':
        return '#3b82f6'; // blue
      case 'features':
        return '#8b5cf6'; // purple
      case 'ui':
        return '#06b6d4'; // cyan
      case 'technical':
        return '#f97316'; // orange
      case 'mobile':
        return '#ec4899'; // pink
      case 'social':
        return '#84cc16'; // lime
      default:
        return '#6b7280';
    }
  };

  return {
    roadmap: filteredRoadmap,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    getStatusColor,
    getPriorityColor,
    getCategoryColor,
  };
};
