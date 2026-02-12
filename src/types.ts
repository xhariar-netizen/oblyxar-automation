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