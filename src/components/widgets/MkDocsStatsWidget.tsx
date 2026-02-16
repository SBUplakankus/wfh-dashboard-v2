import React from 'react';
import { FileText, Folder, ArrowUpRight } from 'lucide-react';
import { DocFile } from '../../types';

interface MkDocsStatsWidgetProps {
  files: DocFile[];
  glassStyle?: string;
  onNavigateToDocs?: () => void;
}

const MkDocsStatsWidget: React.FC<MkDocsStatsWidgetProps> = ({ files, glassStyle = '', onNavigateToDocs }) => {
  // Calculate real stats from file tree
  const countFiles = (fileList: DocFile[]): number => {
    return fileList.reduce((count, file) => {
      if (file.isFolder && file.children) {
        return count + countFiles(file.children);
      }
      return count + (file.isFolder ? 0 : 1);
    }, 0);
  };
  
  const countFolders = (fileList: DocFile[]): number => {
    return fileList.reduce((count, file) => {
      if (file.isFolder && file.children) {
        return count + 1 + countFolders(file.children);
      }
      return count + (file.isFolder ? 1 : 0);
    }, 0);
  };
  
  const getAllFiles = (fileList: DocFile[]): DocFile[] => {
    return fileList.reduce((all: DocFile[], file) => {
      if (file.isFolder && file.children) {
        return [...all, ...getAllFiles(file.children)];
      }
      return file.isFolder ? all : [...all, file];
    }, []);
  };
  
  const totalFiles = countFiles(files);
  const totalFolders = countFolders(files);
  const allFiles = getAllFiles(files);
  
  // Get recently modified files
  const recentFiles = allFiles
    .filter(f => f.modified)
    .sort((a, b) => (b.modified?.getTime() || 0) - (a.modified?.getTime() || 0))
    .slice(0, 3);
  
  return (
    <div 
      className={`p-6 border transition-all duration-300 cursor-default ${glassStyle}`}
      style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderColor: 'var(--border)', 
        borderRadius: 'var(--radius)',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <FileText className="w-4 h-4 text-blue-400" />
        </div>
        <button 
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors opacity-60 hover:opacity-100"
          onClick={onNavigateToDocs}
          title="View all documentation"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <h3 className="text-[15px] font-semibold mb-1">Documentation</h3>
      <p className="text-[11px] mb-4" style={{ color: 'var(--text-secondary)' }}>
        {totalFiles} markdown {totalFiles === 1 ? 'file' : 'files'} across {totalFolders} {totalFolders === 1 ? 'folder' : 'folders'}
      </p>
      
      <div className="space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <div className="text-[15px] font-bold">{totalFiles}</div>
              <div className="text-[9px] text-neutral-500 uppercase">Files</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <Folder className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <div className="text-[15px] font-bold">{totalFolders}</div>
              <div className="text-[9px] text-neutral-500 uppercase">Folders</div>
            </div>
          </div>
        </div>
        
        {/* Recent files */}
        {recentFiles.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Recent Changes</div>
            {recentFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] text-neutral-400 truncate">
                <FileText className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MkDocsStatsWidget;
