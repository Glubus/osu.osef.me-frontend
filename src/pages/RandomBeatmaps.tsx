import type React from "react";
import RandomBeatmapList from "@/components/organisms/RandomBeatmapList/RandomBeatmapList";

const RandomBeatmaps: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto py-8">
        <RandomBeatmapList />
      </div>
    </div>
  );
};

export default RandomBeatmaps;
