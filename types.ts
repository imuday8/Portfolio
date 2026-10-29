/**
 * Type definitions for Uday Saha's Developer Portfolio
 */

export interface PersonalInfo {
  name: string;
  title: string;
  institution: string;
  degree: string;
  email: string;
  tagline: string;
  academicHighlight: string;
  availability: string;
  location: string;
  socials: {
    github: string;
    linkedin: string;
    leetcode: string;
    codeforces: string;
  };
}

export interface CPProfile {
  id: string;
  platform: 'Codeforces' | 'LeetCode';
  profileUrl: string;
  handle: string;
  badge: string;
  metrics: {
    label: string;
    value: string;
    secondary?: string;
  }[];
  description: string;
  accentColor: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  status: 'Prototype / In Progress' | 'Production' | 'Archived';
  statusType: 'in-progress' | 'completed' | 'beta';
  summary: string;
  highlights: string[];
  techStack: string[];
  links: {
    liveDemo?: string;
    sourceCode?: string;
    disabledSourceNotice?: string;
  };
  team?: string;
  featured: boolean;
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    badge?: string;
    highlight?: boolean;
  }[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
  scholasticDistinction?: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  cpProfiles: CPProfile[];
  projectsData: Project[];
  skillsData: SkillCategory[];
  educationData: EducationEntry[];
}
