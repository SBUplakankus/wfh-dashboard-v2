
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Project, ThemeConfig, ViewType } from '../types';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  Briefcase, 
  Settings, 
  ChevronDown, 
  Search,
  Check,
  Plus,
  Zap,
  Layers
} from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenSettings: () => void;
  theme: ThemeConfig;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  projects, 
  activeProjectId, 
  onSelectProject, 
  activeView, 
  onSelectView, 
  onOpenSettings, 
  theme 
}) => {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const navItems: { id: ViewType; label: string; icon: any }[] = [
    { id: 'Dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'Calendar', label: 'Calendar', icon: Calendar },
    { id: 'WorkWeek', label: 'Work Week', icon: Clock },
    { id: 'Tools', label: 'Launcher', icon: Briefcase },
    { id: 'Integrations', label: 'Integrations', icon: Layers },
  ];

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside 
      className="w-64 h-full border-r flex flex-col z-20 shrink-0" 
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--sidebar-bg)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Project Switcher */}
      <div className="p-4 relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
          aria-expanded={isProjectDropdownOpen}
          aria-haspopup="listbox"
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.04] transition-all group active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
              <span className="text-[10px] font-bold text-white tracking-tighter">{activeProject.name.substring(0,2).toUpperCase()}</span>
            </div>
            <div className="text-left">
              <p className="text-[13px] font-semibold tracking-tight leading-none mb-1" style={{ color: 'var(--text-primary)' }}>{activeProject.name}</p>
              <p className="text-[10px] leading-none" style={{ color: 'var(--text-secondary)' }}>{activeProject.category}</p>
            </div>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isProjectDropdownOpen && (
          <div 
            className="absolute top-full left-4 right-4 mt-1 bg-[#0d0e10]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 p-1 animate-in fade-in slide-in-from-top-1 duration-150 ring-1 ring-black"
            role="listbox"
          >
            {projects.map(p => (
              <button
                key={p.id}
                role="option"
                aria-selected={p.id === activeProjectId}
                onClick={() => {
                  onSelectProject(p.id);
                  setIsProjectDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-[12px] hover:bg-white/[0.04] text-neutral-400 hover:text-white transition-colors focus-visible:bg-white/[0.04] outline-none"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-sm border ${p.id === activeProjectId ? 'bg-blue-500 border-blue-400' : 'bg-neutral-800 border-white/5'}`} />
                  <span>{p.name}</span>
                </div>
                {p.id === activeProjectId && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </button>
            ))}
            <div className="border-t border-white/5 my-1" />
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[12px] hover:bg-white/[0.04] text-neutral-500 hover:text-white transition-colors outline-none">
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 px-4 py-4 space-y-6">
        <div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search Workspace..."
              className="w-full pl-9 pr-3 py-1.5 bg-white/[0.02] border border-white/[0.05] rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-neutral-700"
              aria-label="Search workspace"
            />
          </div>
        </div>

        <nav className="space-y-1" aria-label="Main View Selector">
          {navItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all group outline-none focus-visible:ring-1 focus-visible:ring-blue-500 ${isActive ? 'bg-white/[0.05] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.02]'}`}
              >
                <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-500' : 'group-hover:text-neutral-300'}`} style={{ color: isActive ? 'var(--accent)' : undefined }} />
                <span className={isActive ? 'font-medium' : ''}>{item.label}</span>
              </button>
            );
          })}
          
          <div className="h-4" />
          
          <button
            onClick={() => onSelectView('DesignSystem')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all group outline-none focus-visible:ring-1 focus-visible:ring-blue-500 ${activeView === 'DesignSystem' ? 'bg-white/[0.05] text-white' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.02]'}`}
          >
            <Zap className={`w-4 h-4 transition-colors ${activeView === 'DesignSystem' ? 'text-amber-500' : 'group-hover:text-amber-400'}`} />
            <span>Design System</span>
          </button>
        </nav>
      </div>

      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <button 
          onClick={onOpenSettings}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all outline-none focus-visible:ring-1 focus-visible:ring-blue-500 ${activeView === 'Settings' ? 'bg-white/[0.05] text-white' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.02]'}`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);
