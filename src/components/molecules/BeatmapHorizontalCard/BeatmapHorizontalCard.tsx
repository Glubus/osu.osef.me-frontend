import type React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart, X, Download } from "lucide-react";
import type { BeatmapsetCompleteShort } from "@/types/beatmap/short";
import { Image } from "@/components/atoms/Image/Image";
import Badge from "@/components/atoms/Badge/Badge";
import { getRatingColor } from "@/utils/getRatingColor";
import { useDownload } from "@/hooks/useDownload";

// Fonction utilitaire pour parser les main_patterns
const parseMainPatterns = (mainPattern: string | string[] | undefined): string[] => {
  if (!mainPattern) return [];
  
  if (Array.isArray(mainPattern)) {
    return mainPattern;
  }
  
  // Si c'est une string, essayer de la parser comme JSON
  try {
    const parsed = JSON.parse(mainPattern);
    return Array.isArray(parsed) ? parsed : [mainPattern];
  } catch {
    // Si le parsing JSON échoue, traiter comme une string simple
    return [mainPattern];
  }
};

// Fonction pour convertir les patterns en raccourcis
const getPatternShortcut = (pattern: string): string => {
  const shortcuts: Record<string, string> = {
    'jumpstream': 'JS',
    'handstream': 'HS',
    'jackspeed': 'SJ',
    'stamina': 'Stam',
    'stream': 'Stream',
    'chordjack': 'CJ',
    'technical': 'Tech'
  };
  
  return shortcuts[pattern.toLowerCase()] || pattern;
};

// Fonction pour obtenir la couleur d'un pattern (correspondant aux couleurs de la page stats)
const getPatternColor = (pattern: string): string => {
  const colorMap: Record<string, string> = {
    'jumpstream': 'blue',      // text-blue-400 dans stats
    'technical': 'purple',     // text-purple-400 dans stats
    'chordjack': 'red',        // text-red-400 dans stats
    'stream': 'green',         // text-green-400 dans stats
    'stamina': 'orange',       // text-orange-400 dans stats
    'handstream': 'teal',      // couleur par défaut pour les patterns non définis
    'jackspeed': 'yellow'      // couleur par défaut pour les patterns non définis
  };
  
  return colorMap[pattern.toLowerCase()] || 'gray';
};

// Fonction pour déterminer le status de priorité
const getPriorityStatus = (beatmaps: any[]): { status: string; color: string; icon: React.ReactNode } => {
  const statuses = beatmaps.map(m => m.beatmap.status);
  
  if (statuses.includes('ranked')) {
    return { status: 'ranked', color: 'blue', icon: <Star size={12} /> };
  }
  if (statuses.includes('loved')) {
    return { status: 'loved', color: 'pink', icon: <Heart size={12} /> };
  }
  if (statuses.includes('graveyard')) {
    return { status: 'graveyard', color: 'gray', icon: <X size={12} /> };
  }
  
  // Par défaut, prendre le premier status trouvé
  const firstStatus = statuses[0] || 'unknown';
  return { status: firstStatus, color: 'gray', icon: <span>?</span> };
};

export type BeatmapCardProps = {
  beatmapset: BeatmapsetCompleteShort;
};

const BeatmapHorizontalCard: React.FC<BeatmapCardProps> = ({ beatmapset }) => {
  const navigate = useNavigate();
  const { downloadBeatmap } = useDownload();

  const handleClick = () => {
    if (!beatmapset.beatmapset?.osu_id) return;
    
    // Trier les maps par MSD overall croissant et prendre la première
    const sortedMaps = [...beatmapset.beatmap].sort((a, b) => {
      const aOverall = Number(a.msd?.overall ?? 0);
      const bOverall = Number(b.msd?.overall ?? 0);
      return aOverall - bOverall;
    });
    
    const firstMap = sortedMaps.find(m => m.beatmap?.osu_id);
    if (firstMap?.beatmap?.osu_id) {
      navigate(`/beatmapsets/${beatmapset.beatmapset.osu_id}/${firstMap.beatmap.osu_id}`);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la navigation
    downloadBeatmap(beatmapset.beatmapset?.osu_id);
  };

  if (!beatmapset.beatmapset) return null;

  // Trier les maps par MSD overall croissant (du plus facile au plus difficile)
  const sortedMaps = [...beatmapset.beatmap].sort((a, b) => {
    const aOverall = Number(a.msd?.overall ?? 0);
    const bOverall = Number(b.msd?.overall ?? 0);
    return aOverall - bOverall;
  });

  // Prendre seulement les 5 premiers maps
  const displayedMaps = sortedMaps.slice(0, 5);
  const remainingCount = sortedMaps.length - 5;

  // Collecter tous les patterns uniques
  const allPatterns = new Set<string>();
  sortedMaps.forEach(map => {
    const patterns = parseMainPatterns(map.msd?.main_pattern);
    patterns.forEach(pattern => allPatterns.add(pattern));
  });
  const uniquePatterns = Array.from(allPatterns).slice(0, 3); // Limiter à 3 patterns max

  // Obtenir le status de priorité
  const priorityStatus = getPriorityStatus(sortedMaps);

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group h-32 overflow-hidden relative"
      onClick={handleClick}
    >
      {/* Couverture */}
      <div className="absolute inset-0">
        <Image
          src={beatmapset.beatmapset.cover_url || "/default-cover.jpg"}
          alt={`${beatmapset.beatmapset.artist || "Unknown Artist"} - ${beatmapset.beatmapset.title || "Unknown Title"}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Bouton de téléchargement qui slide depuis la droite */}
      <div className="absolute top-0 right-0 h-full w-12 bg-primary/90 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-10 flex items-center justify-center">
        <button
          onClick={handleDownload}
          className="text-white hover:text-primary-content transition-colors"
          title="Télécharger le beatmapset"
        >
          <Download size={20} />
        </button>
      </div>

      {/* Contenu */}
      <div className="relative h-full p-4 flex flex-col justify-between text-white">
        {/* Container commun pour patterns et ratings */}
        <div className="flex justify-between items-start">
          {/* Bubbles pour chaque beatmap - à gauche */}
          <div className="flex gap-2">
            {displayedMaps.map((m, i) => {
              const overall = Number(m.msd?.overall ?? 0);
              return (
                <Badge
                  key={i}
                  color={getRatingColor(overall)}
                  title={m.beatmap.difficulty}
                  outline={true}
                >
                  {overall.toFixed(2)}
                </Badge>
              );
            })}
            {remainingCount > 0 && (
              <Badge color="gray" title={`${remainingCount} difficultés supplémentaires`}>
                +{remainingCount}
              </Badge>
            )}
          </div>

          {/* Patterns badges - à droite */}
          {uniquePatterns.length > 0 && (
            <div className="flex gap-1">
              {uniquePatterns.map((pattern, i) => (
                <Badge
                  key={i}
                  color={getPatternColor(pattern) as any}
                  title={`Pattern: ${pattern}`}
                  outline={true}
                >
                  {getPatternShortcut(pattern)}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Infos principales */}
        <div className="flex-1 flex flex-col justify-center mt-2">
          <h3 className="text-lg font-bold mb-1 line-clamp-1">
            {beatmapset.beatmapset.artist || "Unknown Artist"} - {beatmapset.beatmapset.title || "Unknown Title"}
          </h3>
          <p className="text-xs text-base-content/80">
            by {beatmapset.beatmapset.creator || "Unknown Creator"}
          </p>
        </div>

        {/* Status et range de difficulté en bas à droite */}
        <div className="absolute bottom-2 right-2 flex gap-2 items-center">
          {/* Status badge */}
          <Badge
            color={priorityStatus.color as any}
            title={`Status: ${priorityStatus.status}`}
          >
            {priorityStatus.icon}
          </Badge>
          
          {/* Range de difficulté */}
          {sortedMaps.length > 0 && (
            <div className="text-xs text-white bg-black/50 px-2 py-1 rounded">
              {Number(sortedMaps[0].msd?.overall ?? 0).toFixed(2)} - {Number(sortedMaps[sortedMaps.length - 1].msd?.overall ?? 0).toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeatmapHorizontalCard;
