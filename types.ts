export interface SocialPost {
  day: number;
  caption: string;
  hashtags: string[];
  scheduleTime: string; // e.g., "Monday, 10:00 AM"
  platformSuggestion?: string;
  posted?: boolean;
}

export interface VideoScript {
  id: string;
  title: string;
  hook: string;
  body: string;
  cta: string;
  visuals: string;
  duration: string;
  music?: string;
}

export interface UserInputs {
  niche: string;
  audience: string;
  tone: string;
  cta: string;
  platform: 'Instagram' | 'LinkedIn' | 'TikTok' | 'Facebook' | 'YouTube Shorts' | 'Twitter' | 'X';
}

export interface SavedProject {
  id: string;
  name: string;
  createdAt: number;
  inputs: UserInputs;
  posts: SocialPost[];
  scripts: VideoScript[];
}

export enum GeneratorState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}