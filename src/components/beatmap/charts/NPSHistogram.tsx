import React from 'react';
import type { NPSDataPoint } from '../../../types/beatmap';

interface NPSHistogramProps {
  data: NPSDataPoint[];
  onBarClick?: (time: number) => void;
  currentTime?: number;
  totalTime?: number;
}

const NPSHistogram: React.FC<NPSHistogramProps> = ({ data, onBarClick, currentTime = 0, totalTime = 1 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-base-content/60">Aucune donnée NPS disponible</p>
        </div>
      </div>
    );
  }

  const maxDensity = Math.max(...data.map(d => d.density));
  const colors = [
    'bg-green-400',
    'bg-blue-400', 
    'bg-yellow-400',
    'bg-orange-400',
    'bg-red-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-indigo-400'
  ];

  const getColorForDensity = (density: number, max: number) => {
    if (density < 10) return 'bg-green-500'; // Vert en dessous de 10
    if (density < 20) return 'bg-yellow-500'; // Jaune en dessous de 20
    if (density < 30) return 'bg-red-500'; // Rouge en dessous de 30
    if (density < 35) return 'bg-blue-500'; // Bleu en dessous de 35
    return 'bg-black'; // Noir 35 ou plus
  };

  const getBarOpacity = (time: number) => {
    if (time <= currentTime) {
      return 'opacity-40'; // Partie déjà passée = plus sombre
    }
    return 'opacity-100'; // Partie future = normale
  };

  return (
    <div className="w-full h-20 bg-transparent">
      <div className="flex items-end justify-between h-full gap-0 p-2 bg-transparent">
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex-1 cursor-pointer hover:opacity-80 transition-opacity ${getBarOpacity(item.time)}`}
            style={{
              height: `${(item.density / maxDensity) * 100}%`,
              minHeight: '4px'
            }}
            onClick={() => onBarClick?.(item.time)}
            title={`Temps: ${item.time.toFixed(1)}s - Densité: ${item.density.toFixed(2)}`}
          >
            <div 
              className={`w-full rounded-none ${getColorForDensity(item.density, maxDensity)}`}
              style={{ height: '100%' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NPSHistogram;
