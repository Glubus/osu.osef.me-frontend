import { useState, useEffect } from 'react';
import helpData from '@/data/help.json';

export interface HelpContent {
  definition?: string;
  gif_url?: string;
  gif_description?: string;
  characteristics?: string[];
  difficulty_factors?: string[];
  example_beatmaps?: Array<{
    title: string;
    rating: string;
    url: string;
  }>;
  calculation?: string;
  scale?: Record<string, string>;
  factors?: string[];
  interpretation?: string[];
  individual_skillsets?: string[];
  reading_charts?: string[];
  usage_tips?: string[];
  common_rates?: Record<string, string>;
  difficulty_scaling?: string[];
  practice_usage?: string[];
  rating_calculation?: string;
  search_functionality?: string[];
  filter_options?: Record<string, string>;
  filter_tips?: string[];
  search_examples?: string[];
  header_information?: string[];
  msd_charts?: Record<string, string>;
  difficulty_selection?: string[];
  preview_features?: string[];
  controls?: Record<string, string>;
  visual_settings?: string[];
  usage_benefits?: string[];
  limitations?: string[];
}

export interface HelpSubsection {
  title: string;
  description: string;
  content: HelpContent;
}

export interface HelpSection {
  title: string;
  description: string;
  subsections: Record<string, HelpSubsection>;
}

export interface HelpData {
  patterns: HelpSection;
  ratings: HelpSection;
  navigation: HelpSection;
}

export const useHelpContent = () => {
  const [content] = useState<HelpData>(helpData as HelpData);
  
  const getContent = (sectionId: string, subsectionId: string): HelpSubsection | null => {
    const section = content[sectionId as keyof HelpData];
    if (!section || !section.subsections) return null;
    
    return section.subsections[subsectionId] || null;
  };
  
  const getSectionList = () => {
    return Object.keys(content).map(key => ({
      id: key,
      title: content[key as keyof HelpData].title,
      description: content[key as keyof HelpData].description,
      subsections: Object.keys(content[key as keyof HelpData].subsections).map(subKey => ({
        id: subKey,
        title: content[key as keyof HelpData].subsections[subKey].title
      }))
    }));
  };
  
  return {
    content,
    getContent,
    getSectionList
  };
};
