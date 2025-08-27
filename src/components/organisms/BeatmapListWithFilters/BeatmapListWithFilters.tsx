import type React from "react";
import { useState } from "react";
import type { Filters } from "@/types/beatmap/short";
import FilterSection from "@/components/molecules/FilterSection/FilterSection";
import BeatmapHorizontalCard from "@/components/molecules/BeatmapHorizontalCard/BeatmapHorizontalCard";
import { useBeatmapList } from "@/hooks/useBeatmapList";

const BeatmapListWithFilters: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    per_page: 20,
  });

  const { beatmaps, loading, error } = useBeatmapList(filters);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters({
      ...newFilters,
      page: 1, // Reset to first page when filters change
    });
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <FilterSection filters={filters} onFiltersChange={handleFiltersChange} />
      
      {loading ? (
        <div className="text-center py-8">
          <p>Loading beatmaps...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {beatmaps.map((beatmapset, i) => (
            <BeatmapHorizontalCard key={i} beatmapset={beatmapset} />
          ))}
        </div>
      )}
      
      {!loading && beatmaps.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No beatmaps found with these filters.</p>
        </div>
      )}
    </div>
  );
};

export default BeatmapListWithFilters;
