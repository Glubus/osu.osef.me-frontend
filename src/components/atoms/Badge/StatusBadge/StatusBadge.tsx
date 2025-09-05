import React from "react";
import Badge from "@/components/atoms/Badge/Badge";
import type { BeatmapStatus } from "@/types/beatmap/status";


export type StatusBadgeProps = {
  status: BeatmapStatus;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Badge
      color={status.color as any}
      title={`Status: ${status.status}`}
    >
      {status.icon}
    </Badge>
  );
};

export default StatusBadge;
