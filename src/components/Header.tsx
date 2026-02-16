
import React from 'react';
import { Project, ThemeConfig, ViewType } from '../types';
import { Bell, Command, ChevronRight, Search, Zap, Layers } from 'lucide-react';

interface HeaderProps {
  activeView: ViewType;
  project: Project;
  onOpenSettings: () => void;
  theme: ThemeConfig;
}

const Header: React.FC<HeaderProps> = ({ activeView, project, onOpenSettings, theme }) => {
  const getStatusColor = (status: Project['status']) => {
    switch(status) {
      case 'Active': return 'bg-emerald-500';
      case 'Paused': return 'bg-amber-500';
      case 'Backlog': return 'bg-slate-500';
      case 'Completed': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <header className="h-16 px-8 border-b flex items-center justify-between z-10 shrink-0" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--header-bg)' }}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>
          <Layers className="w-3 h-3" />
          <span>Workspace</span>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span>{project.category}</span>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-white">{activeView}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {project.name}
          </h1>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
            <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(project.status)} shadow-[0_0_8px] shadow-current`} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{project.status}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative group hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Quick search..."
            className="w-48 pl-9 pr-3 py-1.5 bg-white/[0.02] border border-white/[0.05] rounded-lg text-[12px] focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-neutral-700"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="text-neutral-500 hover:text-white transition-colors p-1 relative">
            <Bell className="w-4 h-4" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-black" />
          </button>
          
          <div className="h-4 w-px bg-white/10" />
          
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/[0.03] border border-white/[0.05] cursor-default">
            <Command className="w-3 h-3 text-neutral-600" />
            <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">K</span>
          </div>

          <div 
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-lg overflow-hidden cursor-pointer"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
