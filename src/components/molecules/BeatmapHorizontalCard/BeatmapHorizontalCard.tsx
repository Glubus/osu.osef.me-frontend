import type React from "react";
import { useNavigate } from "react-router-dom";
import type { BeatmapsetCompleteShort } from "@/types/beatmap/short";
import { Image } from "@/components/atoms/Image/Image";
import Badge from "@/components/atoms/Badge/Badge";
import { getRatingColor } from "@/utils/getRatingColor";

export type BeatmapCardProps = {
  beatmapset: BeatmapsetCompleteShort;
};

const BeatmapHorizontalCard: React.FC<BeatmapCardProps> = ({ beatmapset }) => {
  const navigate = useNavigate();

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
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Contenu */}
      <div className="relative h-full p-4 flex flex-col justify-between text-white">
        {/* Bubbles pour chaque beatmap */}
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

        {/* Infos principales */}
        <div className="flex-1 flex flex-col justify-center mt-2">
          <h3 className="text-lg font-bold mb-1 line-clamp-1">
            {beatmapset.beatmapset.artist || "Unknown Artist"} - {beatmapset.beatmapset.title || "Unknown Title"}
          </h3>
          <p className="text-xs text-base-content/80">
            by {beatmapset.beatmapset.creator || "Unknown Creator"}
          </p>
        </div>

        {/* Range de difficulté en bas à droite */}
        <div className="absolute bottom-2 right-2">
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
