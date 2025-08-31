import type React from "react";
import type { BadgeProps } from "@/types/atoms/Badge";
import { BADGE_COLOR_MAP } from "@/types/atoms/Badge";
import Tooltip from "@/components/atoms/Tooltip/Tooltip";
import styles from "./Badge.module.css";

const Badge: React.FC<BadgeProps> = ({ children, color = "blue", outline = false, title }) => {
  const badgeClass = BADGE_COLOR_MAP[color] || "badge-info";
  
  const badgeContent = (
    <div className={`${styles.badge} badge ${badgeClass} ${outline ? 'badge-outline' : ''}`}>
      {children}
    </div>
  );

  if (title) {
    return (
      <Tooltip content={title} position="top">
        {badgeContent}
      </Tooltip>
    );
  }

  return badgeContent;
};

export default Badge;
