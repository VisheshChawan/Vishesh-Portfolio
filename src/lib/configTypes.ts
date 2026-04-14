// --- Content Types ---

export interface StatItem {
  id: string;
  number: string;
  label: string;
}

export interface MetricItem {
  id: string;
  value: string;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  metrics: MetricItem[];
  techStack: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  dateRange: string;
  bullets: string[];
  techStack: string[];
}

export interface Achievement {
  id: string;
  rank: string;
  title: string;
  subtitle: string;
  color: string;
  iconName: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
}

export interface PersonalInfo {
  name: string;
  titleLine1: string;
  location: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  statusBadge: string;
}

export interface HeroConfig {
  description: string;
  roles: string[];
  stats: StatItem[];
}

// --- Theme Types ---

export interface ThemeConfig {
  presetName: string;
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
  bgVoid: string;
  bgDeep: string;
  bgSurface: string;
  bgCard: string;
  textPrimary: string;
  textSecondary: string;
  displayFont: string;
  monoFont: string;
  accentFont: string;
  glowIntensity: number; // 0 to 1
  chamferSize: number; // pixels
}

// --- Animation Types ---

export interface CursorConfig {
  style: 'circle' | 'cross' | 'diamond' | 'arrow' | 'system';
  primarySize: number;
  ringSize: number;
  ringLag: number;
  color: string; // 'accent' or hex
  trailEnabled: boolean;
  trailLength: number;
  blendMode: 'difference' | 'normal' | 'exclusion' | 'overlay';
}

export interface ParticleConfig {
  enabled: boolean;
  count: number;
  size: number;
  speed: number;
  linesEnabled: boolean;
  lineDistance: number;
  lineOpacity: number;
  mouseInteraction: 'repel' | 'attract' | 'none';
  mouseStrength: number;
}

export interface AnimationConfig {
  masterEnabled: boolean;
  respectReducedMotion: boolean;
  bootEnabled: boolean;
  bootDuration: number;
  bootStyle: 'terminal' | 'fade' | 'instant';
  bootMessages: string[];
  cursor: CursorConfig;
  particles: ParticleConfig;
}

// --- Sections Types ---

export interface SectionBlock {
  id: string;
  type: 'hero' | 'about' | 'skills' | 'experience' | 'projects' | 'recognition' | 'contact' | 'custom';
  visible: boolean;
  order: number;
  title: string;
  tagText: string;
  background: 'void' | 'deep' | 'surface';
  content?: string;
}

// --- Advanced Types ---
export interface AdvancedConfig {
  seoTitle: string;
  seoDescription: string;
}

// --- Main Config Interface ---

export interface PortfolioConfig {
  version: string;
  personal: PersonalInfo;
  hero: HeroConfig;
  projects: Project[];
  experience: ExperienceItem[];
  skills: Record<string, string[]>;
  achievements: Achievement[];
  certifications: Certification[];
  theme: ThemeConfig;
  animations: AnimationConfig;
  sections: SectionBlock[];
  advanced: AdvancedConfig;
  // Remote file URLs (synced to Vercel Blob for all visitors)
  avatarUrl?: string;
  resumeUrl?: string;
  resumeFileName?: string;
}
