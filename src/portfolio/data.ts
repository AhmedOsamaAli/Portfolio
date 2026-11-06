import content from './content.json';

export const profile: Profile = content.profile;

export interface Profile {
  name: string;
  handle: string;
  role: string;
  company: string;
  location: string;
  availability: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  blog: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
  logo?: string; // path in public
}

export interface InternshipItem extends ExperienceItem {}
export interface EducationItem {
  institution: string;
  degree: string;
  location: string;
  start: string;
  end: string;
  notes?: string[];
}
export interface SkillItem {
  name: string;
  icon: string;
  color: string;
  level?: number; // 1-5 proficiency
}

export interface SkillGroups {
  languages: SkillItem[];
  frameworks: SkillItem[];
  databases: SkillItem[];
  tools: SkillItem[];
  cloud: SkillItem[];
}
export interface AchievementItem {
  title: string;
  description: string;
  links?: { label: string; url: string }[];
  icon?: string; // optional emoji or short text identifier displayed beside achievement
  image?: string; // optional background image for the achievement card
}
export interface ProjectItem {
  name: string;
  url: string;
  start?: string;
  end?: string;
  bullets: string[];
  stack: string[];
}
export interface OpenSourceItem {
  name: string;
  program: string;
  bullets: string[];
  stack: string[];
  links: { label: string; url: string }[];
}

export const openSource: OpenSourceItem[] = content.openSource;

export const experiences: ExperienceItem[] = content.experiences;

export const internships: InternshipItem[] = content.internships;

export const education: EducationItem[] = content.education;

export const skills: SkillGroups = content.skills;

export const achievements: AchievementItem[] = content.achievements;

export const projects: ProjectItem[] = content.projects;
