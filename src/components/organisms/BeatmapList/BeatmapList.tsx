import React, { useEffect, useState } from "react";
import { getBeatmaps } from "@/services/api/get_beatmap";
import type { BeatmapsetCompleteShort } from "@/types/beatmap/short";
import BeatmapHorizontalCard from "@/components/molecules/BeatmapHorizontalCard/BeatmapHorizontalCard";

const BeatmapList: React.FC = () => {
  const [beatmaps, setBeatmaps] = useState<BeatmapsetCompleteShort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeatmaps = async () => {
      try {
        setLoading(true);
        const data = await getBeatmaps({});
        setBeatmaps(data.beatmaps);
      } finally {
        setLoading(false);
      }
    };
    fetchBeatmaps();
  }, []);

  if (loading) return <p className="text-center">Chargement des beatmaps...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {beatmaps.map((b, i) => (
        <BeatmapHorizontalCard key={i} beatmapset={b} />
      ))}
    </div>
  );
};

export default BeatmapList;
