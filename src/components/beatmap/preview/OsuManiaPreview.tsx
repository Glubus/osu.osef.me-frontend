import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { MapParserService, type HitObject } from '../../../services/map_parser';
import NPSHistogram from '../charts/NPSHistogram';
import type { NPSDataPoint } from '../../../types/beatmap';

interface OsuManiaPreviewProps {
  currentTime: number;
  totalTime: number;
  beatmap: any;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  npsData: NPSDataPoint[];
  onBarClick?: (time: number) => void;
}

// Composant Note optimisé avec memo
const Note = memo(({ note, currentTime, scrollSpeed }: { 
  note: HitObject; 
  currentTime: number; 
  scrollSpeed: number; 
}) => {
  const currentTimeMs = currentTime * 1000;
  const timeDiff = note.startTime - currentTimeMs;
  const playfieldHeight = 800;
  const pixelsPerMs = playfieldHeight / scrollSpeed;
  
  // Vérifier si la note est visible
  if (timeDiff < -scrollSpeed || timeDiff > scrollSpeed) {
    return null;
  }
  
  // La note doit arriver à la ligne de jugement (bottom-20) quand timeDiff = 0
  const judgmentLineY = playfieldHeight - 20; // Ligne de jugement
  const position = judgmentLineY - (timeDiff * pixelsPerMs);
  if (position < 0 || position > playfieldHeight) {
    return null;
  }
  
  const opacity = Math.max(0.3, 1 - (Math.abs(timeDiff) / scrollSpeed));
  const noteWidth = '18%';
  const noteHeight = note.type === 'hold' ? '60px' : '20px';
  const left = `${(note.column * 25) + 12.5}%`;
  
  return (
    <div
      className="absolute"
      style={{
        left,
        top: `${position}px`,
        width: noteWidth,
        height: noteHeight,
        opacity,
        transform: 'translateX(-50%) translateY(-50%)'
      }}
    >
      <div
        className={`w-full h-full rounded ${
          note.type === 'hold'
            ? 'bg-blue-500 border-2 border-blue-300'
            : 'bg-white'
        }`}
      />
    </div>
  );
});

Note.displayName = 'Note';

const OsuManiaPreview: React.FC<OsuManiaPreviewProps> = ({ 
  currentTime, 
  totalTime, 
  beatmap, 
  isPlaying, 
  onPlayPause, 
  onReset,
  npsData,
  onBarClick
}) => {
  const [loading, setLoading] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(500);
  const [showSettings, setShowSettings] = useState(true);
  const [hitObjects, setHitObjects] = useState<HitObject[]>([]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / totalTime) * 100;

  // Filtrer les notes visibles avec useMemo
  const visibleNotes = useMemo(() => {
    if (hitObjects.length === 0) return [];
    
    const currentTimeMs = currentTime * 1000;
    return hitObjects.filter(note => {
      const timeDiff = note.startTime - currentTimeMs;
      return timeDiff >= -scrollSpeed && timeDiff <= scrollSpeed;
    });
  }, [hitObjects, currentTime, scrollSpeed]);

  // Fonction pour décoder le fichier .osu
  const decodeOsuFile = useCallback(async () => {
    if (!beatmap?.id) return;
    
    setLoading(true);
    try {
      const hitObjects = await MapParserService.parseOsuFile(beatmap.id);
      setHitObjects(hitObjects);
    } catch (error) {
      console.error('Erreur lors du décodage:', error);
      const fallbackData = MapParserService.generateFallbackData(totalTime);
      setHitObjects(fallbackData);
    } finally {
      setLoading(false);
    }
  }, [beatmap?.id, totalTime]);

  useEffect(() => {
    decodeOsuFile();
  }, [decodeOsuFile]);

  return (
    <div className="w-full bg-transparent rounded-lg flex flex-col" style={{ height: '1000px' }}>
      {/* Header compact */}
      <div className="p-3 border-b border-base-300">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-base-content/60">
                {formatTime(currentTime)} / {formatTime(totalTime)}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={onPlayPause}
                className="btn btn-sm btn-primary"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button 
                onClick={onReset}
                className="btn btn-sm btn-outline"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="btn btn-sm btn-ghost"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {showSettings && (
          <div className="mt-3 p-3 bg-base-300 rounded-lg">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Scroll Speed:</label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                className="range range-xs range-primary"
              />
              <span className="text-sm text-base-content/60">{scrollSpeed}ms</span>
            </div>
          </div>
        )}
      </div>

      {/* NPS Histogram intégré */}
      <div className="p-1">
        <NPSHistogram 
          data={npsData} 
          onBarClick={onBarClick}
          currentTime={currentTime}
          totalTime={totalTime}
        />
      </div>

      {/* Playfield */}
      <div className="relative overflow-hidden bg-black" style={{ height: '700px' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : (
          <>
            {/* Judgment line */}
            <div className="absolute bottom-20 left-0 right-0 h-1 bg-white opacity-50" />
            
            {/* Columns */}
            <div className="absolute bottom-0 left-0 right-0 h-20 flex">
              {[0, 1, 2, 3].map(column => (
                <div
                  key={column}
                  className="flex-1 border-r border-gray-600 last:border-r-0"
                />
              ))}
            </div>

            {/* Notes optimisées */}
            {visibleNotes.map((note, index) => (
              <Note
                key={`${note.startTime}-${note.column}-${index}`}
                note={note}
                currentTime={currentTime}
                scrollSpeed={scrollSpeed}
              />
            ))}
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className="p-4">
        <div className="w-full bg-base-300 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default OsuManiaPreview;
