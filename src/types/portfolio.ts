export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  image?: string;
  metrics?: {
    accuracy?: string;
    latency?: string;
    users?: string;
    stars?: string;
  };
  diagnostics?: {
    label: string;
    confidence: number;
    status: 'optimal' | 'warning' | 'critical';
    color: string;
    details: string;
  }[];
}

export interface TechnologyItem {
  name: string;
  category: 'core' | 'framework' | 'cloud' | 'tool' | 'design';
  icon: string;
  level: number; // 0 - 100
  experience: string;
  description: string;
  featuredProjects: string[];
}

export interface JourneyMilestone {
  year: string;
  period?: string;
  title: string;
  description: string;
  skills: string[];
  highlight?: boolean;
}

export interface PortfolioData {
  personal: {
    name: string;
    role: string;
    title: string;
    tagline: string;
    shortBio: string;
    longBio: string;
    avatarDefaultUrl?: string;
    email: string;
    linkedin: string;
    github: string;
    location: string;
    stats: {
      experience: string;
      projectsCount: string;
      ideasCount: string;
    };
    metaPillars: string[];
  };
  projects: ProjectItem[];
  technologies: TechnologyItem[];
  journey: JourneyMilestone[];
  socials: {
    email: string;
    linkedin: string;
    github: string;
    location: string;
  };
}
