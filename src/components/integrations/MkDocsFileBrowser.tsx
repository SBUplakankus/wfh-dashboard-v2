import React, { useState, useEffect } from 'react';
import { DocFile } from '../../types';
import { Folder, File, ChevronRight, ChevronDown, FileText, Clock, HardDrive, ExternalLink } from 'lucide-react';

interface MkDocsFileBrowserProps {
  docsPath: string;
  onFileClick?: (file: DocFile) => void;
}

const MkDocsFileBrowser: React.FC<MkDocsFileBrowserProps> = ({ docsPath, onFileClick }) => {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFiles();
  }, [docsPath]);

  const loadFiles = async () => {
    if (!window.dashboardAPI || !docsPath) return;

    setLoading(true);
    setError(null);

    try {
      const result = await window.dashboardAPI.readDirectoryRecursive(docsPath, 3);
      if (result.success && result.data) {
        setFiles(result.data);
      } else {
        setError(result.error || 'Failed to load files');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleFileClick = async (file: DocFile) => {
    if (file.isFolder) {
      toggleFolder(file.path);
    } else {
      if (onFileClick) {
        onFileClick(file);
      } else {
        // Default: open in MarkText or default editor
        if (window.dashboardAPI) {
          await window.dashboardAPI.openFile(file.path);
        }
      }
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderFile = (file: DocFile, depth: number = 0) => {
    const isExpanded = expandedFolders.has(file.path);
    const isMarkdown = file.name.endsWith('.md');

    return (
      <div key={file.path}>
        <button
          onClick={() => handleFileClick(file)}
          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.04] rounded-lg text-[13px] transition-colors group"
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          {file.isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              )}
              <Folder className="w-4 h-4 text-blue-400" />
            </>
          ) : (
            <>
              <div className="w-3.5" />
              {isMarkdown ? (
                <FileText className="w-4 h-4 text-green-400" />
              ) : (
                <File className="w-4 h-4 text-neutral-500" />
              )}
            </>
          )}
          
          <span className="flex-1 text-left truncate" style={{ color: 'var(--text-primary)' }}>
            {file.name}
          </span>

          {!file.isFolder && (
            <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                {formatFileSize(file.size)}
              </span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </button>

        {file.isFolder && isExpanded && file.children && (
          <div>
            {file.children
              .sort((a, b) => {
                // Folders first, then files alphabetically
                if (a.isFolder && !b.isFolder) return -1;
                if (!a.isFolder && b.isFolder) return 1;
                return a.name.localeCompare(b.name);
              })
              .map(child => renderFile(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!docsPath) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--text-secondary)' }}>
        <Folder className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-[13px]">No MkDocs path configured</p>
        <p className="text-[11px] mt-1">Set your docs folder in Settings → Tools</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--text-secondary)' }}>
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[13px]">Loading documentation files...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--text-secondary)' }}>
        <p className="text-[13px] text-red-400 mb-2">Error loading files</p>
        <p className="text-[11px]">{error}</p>
        <button
          onClick={loadFiles}
          className="mt-3 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[11px] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-3 py-2 mb-2">
        <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          <HardDrive className="w-3.5 h-3.5" />
          <span>{files.length} items</span>
        </div>
        <button
          onClick={loadFiles}
          className="p-1 hover:bg-white/[0.04] rounded transition-colors"
          title="Refresh"
        >
          <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {files.length === 0 ? (
        <div className="p-6 text-center" style={{ color: 'var(--text-secondary)' }}>
          <Folder className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-[13px]">No files found</p>
        </div>
      ) : (
        files
          .sort((a, b) => {
            if (a.isFolder && !b.isFolder) return -1;
            if (!a.isFolder && b.isFolder) return 1;
            return a.name.localeCompare(b.name);
          })
          .map(file => renderFile(file))
      )}
    </div>
  );
};

export default MkDocsFileBrowser;
