
import React from 'react';
import { ThemeConfig, Tool } from '../types';
import { 
  ExternalLink, 
  Terminal, 
  FileText, 
  BookOpen, 
  Github,
  Trello,
  Plus,
  Link as LinkIcon,
  Search,
  Settings2
} from 'lucide-react';

interface ToolsViewProps {
  theme: ThemeConfig;
}

const ToolsView: React.FC<ToolsViewProps> = ({ theme }) => {
  const tools: Tool[] = [
    { id: 't1', name: 'Kanri', description: 'Advanced board-based task management.', icon: Trello, color: 'text-blue-500' },
    { id: 't2', name: 'Joplin', description: 'End-to-end encrypted notes and to-do app.', icon: FileText, color: 'text-orange-500' },
    { id: 't3', name: 'MarkText', description: 'Real-time preview markdown editor.', icon: BookOpen, color: 'text-green-500' },
    { id: 't4', name: 'MkDocs', description: 'Project documentation with Markdown.', icon: BookOpen, color: 'text-pink-500' },
    { id: 't5', name: 'Terminal', description: 'High-performance integrated shell.', icon: Terminal, color: 'text-neutral-400' },
    { id: 't6', name: 'Github', description: 'Global version control and code hosting.', icon: Github, color: 'text-white' },
  ];

  const customLinks = [
    { id: 'l1', label: 'Production Logs', url: '#', icon: Search },
    { id: 'l2', label: 'Sentry Issues', url: '#', icon: Settings2 },
    { id: 'l3', label: 'AWS Console', url: '#', icon: ExternalLink },
  ];

  return (
    <div className="p-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <header className="mb-12 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Launcher</h1>
          <p className="text-sm text-neutral-500">One-click access to your specialized toolset and resources.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95">
          <Plus className="w-3.5 h-3.5" /> Configure Path
        </button>
      </header>

      <section className="mb-16">
        <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5" /> Professional Suite
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <div 
              key={tool.id}
              className="p-6 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all flex flex-col group h-48"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-neutral-900 rounded-lg border border-white/5 group-hover:border-white/10 transition-all ${tool.color}`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white text-neutral-500">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-sm font-bold mb-1">{tool.name}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-auto line-clamp-2">
                {tool.description}
              </p>
              <button className="mt-4 w-full py-2 bg-white/5 border border-white/5 rounded-lg text-[11px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 active:scale-[0.98]">
                Launch Tool
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <LinkIcon className="w-3.5 h-3.5" /> Project Specific Links
          </h2>
          <button className="text-[11px] text-blue-500 hover:text-blue-400 font-bold tracking-wider">ADD NEW LINK</button>
        </div>
        
        {customLinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {customLinks.map(link => (
              <button 
                key={link.id}
                className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all group text-left"
              >
                <div className="p-2 rounded-lg bg-white/5 text-neutral-400 group-hover:text-white transition-colors">
                  <link.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold truncate group-hover:text-white transition-colors">{link.label}</p>
                  <p className="text-[10px] text-neutral-600 truncate">Internal Link</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <LinkIcon className="w-8 h-8 text-neutral-700 mb-3" />
            <p className="text-sm text-neutral-500 mb-1">No custom links yet.</p>
            <p className="text-xs text-neutral-600">Add project-specific resources in the Settings panel.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ToolsView;
