import React from "react";
import Badge from "@/components/atoms/Badge/Badge";
import { getRatingColor } from "@/utils/getRatingColor";

export type DifficultyBadgeProps = {
  rating: number;
  difficulty: string;
};

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ 
  rating, 
  difficulty
}) => {
  return (
    <Badge
      color={getRatingColor(rating)}
      title={difficulty}
      outline={true}
    >
      {rating.toFixed(2)}
    </Badge>
  );
};

export default DifficultyBadge;
