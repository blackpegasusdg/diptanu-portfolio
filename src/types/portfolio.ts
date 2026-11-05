export interface Project {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  longDescription: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights: string[];
  architecture?: string[];
  metrics?: { label: string; value: string }[];
}

export interface SkillCategory {
  name: string;
  skills: {
    name: string;
    level: string;
    iconName?: string;
    description: string;
  }[];
}

export interface ExploringItem {
  id: string;
  topic: string;
  category: string;
  focus: string;
  description: string;
  status: 'Deep Diving' | 'Building Prototypes' | 'Researching';
}

export interface EducationEntry {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  status: string;
  highlights: string[];
}
