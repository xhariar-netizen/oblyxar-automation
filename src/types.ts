export interface Idea {
  title: string;
  hook: string;
  corePhysicsConflict: string;
  whyItWorks: string;
  visualScore: number;
  viralScore: number;
  combinedScore: number;
}

export interface ParsedIdeas {
  ideas: Idea[];
  selected: Idea;
}

export interface Scene {
  index: number;
  durationSec: number;
  text: string;
}

export interface ParsedNarration {
  title: string;
  totalScenes: number;
  estimatedTotalDuration: number;
  scenes: Scene[];
}