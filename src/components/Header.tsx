
import React from 'react';
import { Project, ThemeConfig, ViewType } from '../types';
import { Command, ChevronRight, Search } from 'lucide-react';

interface HeaderProps {
  activeView: ViewType;
  project: Project;
  onOpenSettings: () => void;
  theme: ThemeConfig;
}

const Header: React.FC<HeaderProps> = ({ activeView, project, onOpenSettings, theme }) => {
  const getStatusColor = (status: Project['status']) => {
    switch(status) {
      case 'Active': return 'bg-emerald-500/90';
      case 'Paused': return 'bg-amber-500/90';
      case 'Backlog': return 'bg-slate-500/90';
      case 'Completed': return 'bg-blue-500/90';
      default: return 'bg-slate-500/90';
    }
  };

  return (
    <header className="h-12 px-6 border-b flex items-center justify-between z-10 shrink-0" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--header-bg)' }}>
      <div className="flex items-center gap-3">
        {/* Breadcrumbs - tighter, cleaner */}
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          <span>{project.category}</span>
          <ChevronRight className="w-3 h-3 opacity-30" />
          <span style={{ color: 'var(--text-primary)' }}>{activeView}</span>
        </div>
        
        {/* Divider */}
        <div className="h-3 w-px bg-white/10" />
        
        {/* Project name and status - more compact */}
        <div className="flex items-center gap-2">
          <h1 className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {project.name}
          </h1>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.03]">
            <div className={`w-1 h-1 rounded-full ${getStatusColor(project.status)}`} />
            <span className="text-[9px] font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              {project.status}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Search - more refined */}
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-56 pl-8 pr-3 py-1.5 bg-white/[0.02] border border-white/[0.05] rounded-md text-[12px] focus:outline-none focus:border-white/20 transition-all placeholder:text-neutral-700"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* Cmd+K hint - cleaner */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-white/[0.08] bg-white/[0.02]">
          <Command className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
          <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>K</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
