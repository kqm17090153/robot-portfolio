export type Language = 'ko' | 'en';
export type BackgroundTheme = 'dots' | 'waves' | 'neon';

export interface SkillItem {
  id: string;
  name: string;
  iconType: 'code' | 'robot' | 'motor';
  shortDesc: {
    ko: string;
    en: string;
  };
  fullDesc: {
    ko: string;
    en: string;
  };
  tags: string[];
  codeSnippet?: string;
  codeLanguage?: string;
}

export interface TrialLog {
  id: string;
  type: 'success' | 'reflection' | 'note';
  title: {
    ko: string;
    en: string;
  };
  quotes: {
    ko: string[];
    en: string[];
  };
  reflectionDetail?: {
    ko: string;
    en: string;
  };
}

export interface TimelineEvent {
  id: string;
  phase: {
    ko: string;
    en: string;
  };
  title: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  highlightBox: {
    label: {
      ko: string;
      en: string;
    };
    content: {
      ko: string;
      en: string;
    };
  };
  tagType?: 'prep' | 'trial' | 'competition';
}

export interface Project {
  id: string;
  title: {
    ko: string;
    en: string;
  };
  version: string;
  category: {
    ko: string;
    en: string;
  };
  shortSummary: {
    ko: string;
    en: string;
  };
  fullDescription: {
    ko: string;
    en: string;
  };
  imageUrl: string;
  tags: string[];
  specs: {
    controller: string;
    servos: string;
    vision: string;
    runtime: string;
    power: string;
  };
  keyFeatures: {
    ko: string[];
    en: string[];
  };
}
