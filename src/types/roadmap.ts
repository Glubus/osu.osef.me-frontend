export interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  status: 'finished' | 'in-progress' | 'planned';
  date: string;
  category: 'core' | 'features' | 'ui' | 'technical' | 'mobile' | 'social';
  priority: 'high' | 'medium' | 'low';
}

export interface RoadmapData {
  roadmap: RoadmapItem[];
}

export type StatusFilter = 'all' | 'finished' | 'in-progress' | 'planned';
export type CategoryFilter = 'all' | 'core' | 'features' | 'ui' | 'technical' | 'mobile' | 'social';
export type PriorityFilter = 'all' | 'high' | 'medium' | 'low';
