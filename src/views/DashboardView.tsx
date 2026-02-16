
import React from 'react';
import { ThemeConfig, ModularityConfig, Meeting, Project, KanriTask, JoplinNotebook, DocFile } from '../types';
import { 
  ArrowUpRight, 
  Plus, 
  Clock, 
  Video
} from 'lucide-react';
import RecentItemsWidget from '../components/RecentItemsWidget';
import KanriStatsWidget from '../components/widgets/KanriStatsWidget';
import JoplinStatsWidget from '../components/widgets/JoplinStatsWidget';
import MkDocsStatsWidget from '../components/widgets/MkDocsStatsWidget';

interface DashboardViewProps {
  theme: ThemeConfig;
  modularity: ModularityConfig;
  meetings: Meeting[];
  currentProject?: Project;
  onNavigateToView?: (view: string) => void;
  onOpenCreateTask?: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ theme, modularity, meetings, currentProject, onNavigateToView, onOpenCreateTask }) => {
  const glassStyle = theme.glassEnabled ? 'glass shadow-xl' : '';
  
  // Get project integrations (default to showing nothing if not specified)
  const integrations = currentProject?.integrations || {
    hasCalendar: false,
    hasKanban: false,
    hasNotes: false,
    hasDocs: false
  };
  
  // Mock integration data (in real app, this would come from actual integrations)
  const mockKanriTasks: KanriTask[] = [
    { id: 't1', title: 'Implement file browser UI', description: 'Create component for browsing MkDocs files', column: 'Done', priority: 'high', dueDate: new Date('2024-02-14'), tags: ['frontend', 'ui'] },
    { id: 't2', title: 'Add Joplin integration', description: 'Connect to Joplin notes database', column: 'In Progress', priority: 'high', dueDate: new Date('2024-02-16'), tags: ['integration'] },
    { id: 't3', title: 'Design calendar sync feature', description: 'Plan how to sync calendar events', column: 'To Do', priority: 'medium', dueDate: new Date('2024-02-20'), tags: ['planning'] },
    { id: 't4', title: 'Write documentation', description: 'Document all integration features', column: 'To Do', priority: 'low', dueDate: new Date('2024-02-25'), tags: ['docs'] },
    { id: 't5', title: 'Test Kanri browser', description: 'QA testing for task browser component', column: 'Review', priority: 'high', dueDate: new Date('2024-02-17'), tags: ['testing'] },
    { id: 't6', title: 'Optimize performance', description: 'Profile and optimize file operations', column: 'To Do', priority: 'medium', dueDate: new Date('2024-02-22'), tags: ['performance'] }
  ];
  
  const mockJoplinNotebooks: JoplinNotebook[] = [
    { 
      id: 'nb1', 
      name: 'Project Notes', 
      notes: [
        { id: 'n1', title: 'Architecture decisions', content: 'Key decisions about app structure', created: new Date('2024-02-10'), modified: new Date('2024-02-15'), tags: ['architecture'], notebookId: 'nb1' },
        { id: 'n2', title: 'Feature ideas', content: 'Brainstorming new features', created: new Date('2024-02-12'), modified: new Date('2024-02-14'), tags: ['ideas'], notebookId: 'nb1' }
      ]
    },
    { 
      id: 'nb2', 
      name: 'Meeting Notes', 
      notes: [
        { id: 'n3', title: 'Daily standup 2/15', content: 'Team updates', created: new Date('2024-02-15'), modified: new Date('2024-02-15'), tags: ['meetings'], notebookId: 'nb2' }
      ]
    },
    { 
      id: 'nb3', 
      name: 'Research', 
      notes: [
        { id: 'n4', title: 'React best practices', content: 'Research on React patterns', created: new Date('2024-02-08'), modified: new Date('2024-02-13'), tags: ['research', 'react'], notebookId: 'nb3' },
        { id: 'n5', title: 'Electron integration', content: 'How to integrate with Electron', created: new Date('2024-02-09'), modified: new Date('2024-02-14'), tags: ['research', 'electron'], notebookId: 'nb3' }
      ]
    }
  ];
  
  const mockDocFiles: DocFile[] = [
    { name: 'getting-started', path: '/docs/getting-started', isFolder: true, modified: new Date('2024-02-15'), children: [
      { name: 'index.md', path: '/docs/getting-started/index.md', isFolder: false, size: 1024, modified: new Date('2024-02-15') },
      { name: 'installation.md', path: '/docs/getting-started/installation.md', isFolder: false, size: 2048, modified: new Date('2024-02-14') }
    ]},
    { name: 'api', path: '/docs/api', isFolder: true, modified: new Date('2024-02-13'), children: [
      { name: 'reference.md', path: '/docs/api/reference.md', isFolder: false, size: 4096, modified: new Date('2024-02-13') }
    ]},
    { name: 'README.md', path: '/docs/README.md', isFolder: false, size: 512, modified: new Date('2024-02-16') }
  ];
  
  // Filter meetings for work calendar only if integration is enabled
  const relevantMeetings = integrations.hasCalendar ? meetings.filter(m => m.calendarType === 'work') : [];
  const upcomingMeeting = relevantMeetings.length > 0 ? relevantMeetings[0] : null;
  
  // Count active tasks for summary
  const activeTasks = integrations.hasKanban ? mockKanriTasks.filter(t => t.column === 'In Progress').length : 0;

  return (
    <div className="p-10 space-y-12 max-w-[1400px] mx-auto">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
          {currentProject?.name || 'Workspace'} Overview
        </h1>
        <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Welcome back. 
          {integrations.hasCalendar && relevantMeetings.length > 0 && ` You have ${relevantMeetings.length} ${relevantMeetings.length === 1 ? 'meeting' : 'meetings'} today`}
          {integrations.hasKanban && activeTasks > 0 && (integrations.hasCalendar ? ' and' : '') && ` ${activeTasks} active ${activeTasks === 1 ? 'task' : 'tasks'}`}
          {!integrations.hasCalendar && !integrations.hasKanban && ' Your project dashboard is ready.'}
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Integration Stat Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Show upcoming meeting widget only if project has calendar integration */}
            {integrations.hasCalendar && modularity.showUpcomingMeeting && upcomingMeeting && (
              <div 
                className={`p-6 border transition-all duration-300 cursor-default ${glassStyle}`} 
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--border)', 
                  borderRadius: 'var(--radius)',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)' }}>
                    <Clock className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  </div>
                </div>
                <h3 className="text-[15px] font-semibold mb-1">Upcoming Meeting</h3>
                <p className="text-[12px] mb-6" style={{ color: 'var(--text-secondary)' }}>{upcomingMeeting.title} at {upcomingMeeting.time}</p>
                <button 
                  className="w-full py-2.5 text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                  style={{ backgroundColor: 'var(--accent)' }}
                  onClick={() => {
                    if (upcomingMeeting.joinUrl) {
                      window.open(upcomingMeeting.joinUrl, '_blank');
                    }
                  }}
                >
                  <Video className="w-3.5 h-3.5" /> Join Meeting
                </button>
              </div>
            )}

            {/* Show Kanri stats only if project has kanban integration */}
            {integrations.hasKanban && (
              <KanriStatsWidget 
                tasks={mockKanriTasks} 
                glassStyle={glassStyle}
                onNavigateToTasks={() => onNavigateToView?.('Integrations')}
              />
            )}
            
            {/* Show Joplin stats only if project has notes integration */}
            {integrations.hasNotes && (
              <JoplinStatsWidget 
                notebooks={mockJoplinNotebooks} 
                glassStyle={glassStyle}
                onNavigateToNotes={() => onNavigateToView?.('Integrations')}
              />
            )}
            
            {/* Show MkDocs stats only if project has docs integration */}
            {integrations.hasDocs && (
              <MkDocsStatsWidget 
                files={mockDocFiles} 
                glassStyle={glassStyle}
                onNavigateToDocs={() => onNavigateToView?.('Integrations')}
              />
            )}
          </div>

          {/* Show schedule only if project has calendar integration */}
          {integrations.hasCalendar && modularity.showSchedule && relevantMeetings.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">Today's Schedule</h2>
              <div className="space-y-1">
                {relevantMeetings.map((m) => (
                  <div 
                    key={m.id} 
                    className="group flex items-center justify-between p-3.5 rounded-lg border border-transparent transition-all hover:bg-white/[0.03] hover:translate-x-1"
                  >
                    <div className="flex items-center gap-6">
                      <span className="text-[11px] font-mono text-neutral-500 w-16">{m.time}</span>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)', boxShadow: `0 0 12px var(--accent)` }} />
                      <div>
                        <h4 className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{m.title}</h4>
                        <p className="text-[11px] opacity-60" style={{ color: 'var(--text-secondary)' }}>{m.duration}</p>
                      </div>
                    </div>
                    <button
                      className="p-2 text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"
                      onClick={() => {
                        if (m.joinUrl) {
                          window.open(m.joinUrl, '_blank');
                        }
                      }}
                      title="Join meeting"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
           {modularity.showQuickActions && (
             <section className={`p-6 border transition-all duration-300 ${glassStyle}`} style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}>
               <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">Quick Actions</h3>
               <div className="space-y-2">
                  <button 
                    className="w-full flex items-center justify-between p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:translate-x-1 text-[13px] font-medium transition-all group active:scale-[0.98]"
                    onClick={onOpenCreateTask}
                  >
                    <div className="flex items-center gap-3">
                      <Plus className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                      <span>Create New Task</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-500 font-bold">N</span>
                  </button>
               </div>
             </section>
           )}

           {/* Recent Items Widget */}
           <RecentItemsWidget maxItems={5} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
