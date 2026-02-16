
export interface Project {
  id: string;
  name: string;
  description: string;
  category: 'Work' | 'Personal' | 'Side';
  status: 'Active' | 'Paused' | 'Completed' | 'Backlog';
  links?: CustomLink[];
}

export interface CustomLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  path?: string;
}

export interface Meeting {
  id: string;
  title: string;
  time: string;
  duration: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  date: Date;
  joinUrl?: string;
  calendarType?: 'work' | 'personal';
}

export interface ThemeConfig {
  background: string;
  sidebarBackground: string;
  headerBackground: string;
  cardBackground: string;
  accent: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  bgType: 'solid' | 'linear' | 'radial';
  bgGradientColor: string;
  bgGradientAngle: number;
  borderRadius: string;
  spacingBase: number;
  glassEnabled: boolean;
  glassIntensity: number;
  controlLevel: 'preset' | 'simple' | 'advanced';
}

export interface ModularityConfig {
  showQuickActions: boolean;
  showResources: boolean;
  showSprintProgress: boolean;
  showUpcomingMeeting: boolean;
  showSchedule: boolean;
}

export type ViewType = 'Dashboard' | 'Calendar' | 'WorkWeek' | 'Tools' | 'Settings' | 'DesignSystem';
export type TabType = 'Projects' | 'Theme' | 'Modularity' | 'Tools';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
