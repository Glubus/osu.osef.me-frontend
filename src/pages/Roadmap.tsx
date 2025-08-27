import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { useRoadmap } from '@/hooks/useRoadmap';
import { RoadmapFilters } from '@/components/molecules/RoadmapFilters/RoadmapFilters';
import Badge from '@/components/atoms/Badge/Badge';
import type { RoadmapItem } from '@/types/roadmap';
import { CheckCircle, Clock, FileText, Flame, Zap, Lightbulb } from 'lucide-react';

export const Roadmap: React.FC = () => {
  const {
    roadmap,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    getStatusColor,
    getPriorityColor,
    getCategoryColor,
  } = useRoadmap();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'finished':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'planned':
        return '📋';
      default:
        return '📋';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Flame size={16} />;
      case 'medium':
        return <Zap size={16} />;
      case 'low':
        return <Lightbulb size={16} />;
      default:
        return <Lightbulb size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Development Roadmap
          </h1>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Track our progress and see what's coming next for the osu! beatmap platform.
            We're constantly working to improve your experience.
          </p>
        </div>

        {/* Filters */}
        <RoadmapFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />

        {/* Legend */}
        <div className="mb-8 p-4 bg-base-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-base-content">Legend</h3>
                     <div className="flex flex-wrap gap-4">
             <div className="flex items-center gap-2">
               <CheckCircle size={20} className="text-success" />
               <span className="text-base-content">Finished</span>
             </div>
             <div className="flex items-center gap-2">
               <Clock size={20} className="text-warning" />
               <span className="text-base-content">In Progress</span>
             </div>
             <div className="flex items-center gap-2">
               <FileText size={20} className="text-base-content/60" />
               <span className="text-base-content">Planned</span>
             </div>
             <div className="flex items-center gap-2">
               <Flame size={20} className="text-error" />
               <span className="text-base-content">High Priority</span>
             </div>
             <div className="flex items-center gap-2">
               <Zap size={20} className="text-warning" />
               <span className="text-base-content">Medium Priority</span>
             </div>
             <div className="flex items-center gap-2">
               <Lightbulb size={20} className="text-success" />
               <span className="text-base-content">Low Priority</span>
             </div>
           </div>
        </div>

                {/* Timeline */}
        <div className="bg-base-200 rounded-lg p-6">
          <VerticalTimeline>
            {roadmap.map((item) => (
              <VerticalTimelineElement
                key={item.id}
                className="vertical-timeline-element--work"
                contentStyle={{
                  background: 'hsl(var(--b2))',
                  color: 'hsl(var(--bc))',
                  border: `2px solid ${getStatusColor(item.status as 'finished' | 'in-progress' | 'planned')}`,
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                contentArrowStyle={{
                  borderRight: `7px solid ${getStatusColor(item.status as 'finished' | 'in-progress' | 'planned')}`,
                }}
                date={formatDate(item.date)}
                iconStyle={{
                  background: getStatusColor(item.status as 'finished' | 'in-progress' | 'planned'),
                  color: '#fff',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                icon={getStatusIcon(item.status as string)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-base-content">
                      {item.title}
                    </h3>
                                            <div className="flex gap-2">
                         <Badge color={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'yellow' : 'green'}>
                           {item.priority}
                         </Badge>
                         <Badge color={item.category === 'core' ? 'blue' : item.category === 'features' ? 'purple' : item.category === 'ui' ? 'teal' : item.category === 'technical' ? 'orange' : item.category === 'mobile' ? 'pink' : 'gray'}>
                           {item.category}
                         </Badge>
                       </div>
                  </div>
                  
                  <p className="text-base-content/70 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                     {getPriorityIcon(item.priority as string)}
                    <span className="capitalize">{item.priority} priority</span>
                    <span>•</span>
                    <span className="capitalize">{item.category}</span>
                  </div>
                </div>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-base-200 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-success mb-2">
              {roadmap.filter((item: any) => item.status === 'finished').length}
            </div>
            <div className="text-base-content/70">Completed Features</div>
          </div>
          <div className="bg-base-200 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-warning mb-2">
              {roadmap.filter((item: any) => item.status === 'in-progress').length}
            </div>
            <div className="text-base-content/70">In Progress</div>
          </div>
          <div className="bg-base-200 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-base-content/60 mb-2">
              {roadmap.filter((item: any) => item.status === 'planned').length}
            </div>
            <div className="text-base-content/70">Planned Features</div>
          </div>
        </div>
      </div>
    </div>
  );
};
