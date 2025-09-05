import React from "react";
import Badge from "@/components/atoms/Badge/Badge";

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

// Fonction pour obtenir la couleur d'un pattern
const getPatternColor = (pattern: string): string => {
  const colorMap: Record<string, string> = {
    'jumpstream': 'blue',
    'technical': 'purple',
    'chordjack': 'red',
    'stream': 'green',
    'stamina': 'orange',
    'handstream': 'teal',
    'jackspeed': 'yellow'
  };
  
  return colorMap[pattern.toLowerCase()] || 'gray';
};

export type PatternBadgeProps = {
  pattern: string;
};

const PatternBadge: React.FC<PatternBadgeProps> = ({ pattern }) => {
  return (
    <Badge
      color={getPatternColor(pattern) as any}
      title={`Pattern: ${pattern}`}
      outline={true}
    >
      {getPatternShortcut(pattern)}
    </Badge>
  );
};

export default PatternBadge;
