
import React from 'react';
import { ThemeConfig, ModularityConfig, Meeting } from '../types';
import { 
  ArrowUpRight, 
  Plus, 
  Clock, 
  Video,
  ListTodo
} from 'lucide-react';

interface DashboardViewProps {
  theme: ThemeConfig;
  modularity: ModularityConfig;
  meetings: Meeting[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ theme, modularity, meetings }) => {
  const glassStyle = theme.glassEnabled ? 'glass shadow-xl' : '';

  return (
    <div className="p-10 space-y-12 max-w-[1400px] mx-auto">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Workspace Overview</h1>
        <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Welcome back. You have {meetings.length} meetings today and 8 pending tasks.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modularity.showUpcomingMeeting && (
              <div 
                className={`p-6 border transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 cursor-default ${glassStyle}`} 
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)' }}>
                    <Clock className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  </div>
                </div>
                <h3 className="text-[15px] font-semibold mb-1">Upcoming Meeting</h3>
                <p className="text-[12px] mb-6" style={{ color: 'var(--text-secondary)' }}>Daily Standup begins in 15 minutes.</p>
                <button 
                  className="w-full py-2.5 text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  <Video className="w-3.5 h-3.5" /> Join Google Meet
                </button>
              </div>
            )}

            {modularity.showSprintProgress && (
              <div 
                className={`p-6 border transition-all duration-300 hover:-translate-y-1 cursor-default ${glassStyle}`}
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-2 rounded-lg bg-green-500/10"><ListTodo className="w-4 h-4 text-green-500" /></div>
                </div>
                <h3 className="text-[15px] font-semibold mb-1">Sprint Progress</h3>
                <div className="space-y-3 mt-auto">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-1000" 
                      style={{ width: '65%' }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-neutral-500 uppercase">
                    <span>65% Completed</span>
                    <span>12 / 18 Tasks</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {modularity.showSchedule && (
            <section>
              <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">Today's Schedule</h2>
              <div className="space-y-1">
                {meetings.map((m) => (
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
