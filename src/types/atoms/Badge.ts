import type React from "react";
import type { ColorName } from "@/types/colors";

export const BADGE_COLOR_MAP: Record<ColorName, string> = {
  blue: "badge-info",
  green: "badge-success", 
  red: "badge-error",
  yellow: "badge-warning",
  gray: "badge-neutral",
  purple: "badge-accent",
  pink: "badge-secondary",
  orange: "badge-info",
  teal: "badge-info"
};

type BadgeProps = {
  children: React.ReactNode;
  color?: ColorName;
  outline?: boolean;
  title?: string;
};

export type { BadgeProps };
