
export interface ProjectIntegrations {
  hasCalendar: boolean;
  hasKanban: boolean;
  hasNotes: boolean;
  hasDocs: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: 'Work' | 'Personal' | 'Side';
  status: 'Active' | 'Paused' | 'Completed' | 'Backlog';
  icon?: string; // Lucide icon name
  links?: CustomLink[];
  integrations?: ProjectIntegrations;
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

export interface AnalyticsConfig {
  showBurndown: boolean;
  showVelocity: boolean;
  showTaskDistribution: boolean;
  showCycleTime: boolean;
  showDailyActivity: boolean;
}

export type ViewType = 'Home' | 'Dashboard' | 'Calendar' | 'WorkWeek' | 'Tools' | 'Settings' | 'Integrations' | 'Analytics';
export type TabType = 'Projects' | 'Theme' | 'Modularity' | 'Tools';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Phase 2: Deep Tool Integrations

export interface DocFile {
  name: string;
  path: string;
  isFolder: boolean;
  size?: number;
  modified?: Date;
  children?: DocFile[];
}

export interface JoplinNotebook {
  id: string;
  name: string;
  notes: JoplinNote[];
}

export interface JoplinNote {
  id: string;
  title: string;
  content: string;
  created: Date;
  modified: Date;
  tags: string[];
  notebookId: string;
}

export interface KanriTask {
  id: string;
  title: string;
  description?: string;
  column: string; // "To Do", "In Progress", "Done"
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags?: string[];
}

export interface KanriBoard {
  name: string;
  columns: string[];
  tasks: KanriTask[];
}

export interface ToolIntegrationConfig {
  mkdocsPath?: string;
  joplinDataPath?: string;
  kanriDataPath?: string;
}
