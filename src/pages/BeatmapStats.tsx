// pages/BeatmapStats.tsx
import type React from "react";
import { 
  Music, 
  Package, 
  Zap, 
  Settings, 
  Flame, 
  Waves, 
  Dumbbell,
  RefreshCw,
  Clock,
  Hand
} from "lucide-react";
import { useBeatmapCount } from "@/hooks/useBeatmapCount";

const BeatmapStats: React.FC = () => {
  const { data, loading, error, refetch } = useBeatmapCount();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <h2 className="text-lg font-bold">Erreur</h2>
          <p>{error}</p>
          <button 
            type="button"
            className="btn btn-outline btn-sm" 
            onClick={refetch}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-warning">
          <p>Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            Statistiques des Beatmaps
          </h1>
          <p className="text-base-content/70">
            Aperçu complet de la base de données de beatmaps
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Music size={32} />
              </div>
              <div className="stat-title">Total Beatmaps</div>
              <div className="stat-value text-primary">{data.total_beatmaps.toLocaleString()}</div>
              <div className="stat-desc">Beatmaps individuelles</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Package size={32} />
              </div>
              <div className="stat-title">Total Beatmapsets</div>
              <div className="stat-value text-secondary">{data.total_beatmapsets.toLocaleString()}</div>
              <div className="stat-desc">Collections de beatmaps</div>
            </div>
          </div>
        </div>

        {/* Patterns Statistics */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">
              <Music className="text-accent" size={24} />
              Répartition par Patterns
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
              {/* Ordre fixe des patterns - tous les 7 patterns */}
              {['technical', 'chordjack', 'stamina', 'jumpstream', 'stream', 'handstream', 'jackspeed'].map((pattern) => {
                const count = data.patterns[pattern as keyof typeof data.patterns] || 0;
                const percentage = ((count / data.total_beatmaps) * 100).toFixed(1);
                
                // Couleurs et icônes pour chaque pattern
                const patternConfig = {
                  jumpstream: { 
                    color: 'text-blue-400', 
                    bgColor: 'bg-blue-400/10', 
                    borderColor: 'border-blue-400/20',
                    icon: <Zap size={20} className="text-blue-400" />
                  },
                  technical: { 
                    color: 'text-purple-400', 
                    bgColor: 'bg-purple-400/10', 
                    borderColor: 'border-purple-400/20',
                    icon: <Settings size={20} className="text-purple-400" />
                  },
                  chordjack: { 
                    color: 'text-red-400', 
                    bgColor: 'bg-red-400/10', 
                    borderColor: 'border-red-400/20',
                    icon: <Flame size={20} className="text-red-400" />
                  },
                  stream: { 
                    color: 'text-green-400', 
                    bgColor: 'bg-green-400/10', 
                    borderColor: 'border-green-400/20',
                    icon: <Waves size={20} className="text-green-400" />
                  },
                  stamina: { 
                    color: 'text-orange-400', 
                    bgColor: 'bg-orange-400/10', 
                    borderColor: 'border-orange-400/20',
                    icon: <Dumbbell size={20} className="text-orange-400" />
                  },
                  handstream: { 
                    color: 'text-cyan-400', 
                    bgColor: 'bg-cyan-400/10', 
                    borderColor: 'border-cyan-400/20',
                    icon: <Hand size={20} className="text-cyan-400" />
                  },
                  jackspeed: { 
                    color: 'text-yellow-400', 
                    bgColor: 'bg-yellow-400/10', 
                    borderColor: 'border-yellow-400/20',
                    icon: <Clock size={20} className="text-yellow-400" />
                  },
                };

                const config = patternConfig[pattern as keyof typeof patternConfig];

                return (
                  <div 
                    key={pattern}
                    className={`card ${config.bgColor} border ${config.borderColor} shadow-sm`}
                  >
                    <div className="card-body p-6">
                      <div className="flex items-center gap-2 mb-2">
                        {config.icon}
                        <h3 className="font-semibold text-base capitalize text-base-content">
                          {pattern}
                        </h3>
                      </div>
                      <div className={`text-3xl font-bold ${config.color} mb-2`}>
                        {count.toLocaleString()}
                      </div>
                      <div className="text-sm text-base-content/60">
                        {percentage}% du total
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="w-full bg-base-300 rounded-full h-1.5 mt-2">
                        <div 
                          className={`h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button 
            type="button"
            className="btn btn-outline btn-wide" 
            onClick={refetch}
          >
            <RefreshCw size={16} className="mr-2" />
            Actualiser les données
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeatmapStats;
