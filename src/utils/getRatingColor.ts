import { type ColorName } from "@/types/colors";

export const getRatingColor = (rating: number): ColorName => {
    if (rating < 15) return "green";
    if (rating < 25) return "blue";
    if (rating < 30) return "yellow";
    if (rating < 35) return "red";
    if (rating < 40) return "purple";
    return "orange";
  };
  