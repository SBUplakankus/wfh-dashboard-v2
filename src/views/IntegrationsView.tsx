import React, { useState } from 'react';
import MkDocsFileBrowser from '../components/integrations/MkDocsFileBrowser';
import { DocFile } from '../types';
import { FileText, Book, FolderOpen, Settings } from 'lucide-react';

const IntegrationsView: React.FC = () => {
  const [mkdocsPath, setMkdocsPath] = useState<string>('/home/runner/work/wfh-dashboard-v2/wfh-dashboard-v2/docs');
  const [selectedFile, setSelectedFile] = useState<DocFile | null>(null);

  const handleFileClick = (file: DocFile) => {
    setSelectedFile(file);
    // Open in default editor
    if (window.dashboardAPI) {
      window.dashboardAPI.openFile(file.path);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Left Panel - File Browser */}
      <div className="w-80 border-r flex flex-col" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card-bg)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Book className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              MkDocs Browser
            </h2>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            Browse and manage documentation files
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <MkDocsFileBrowser 
            docsPath={mkdocsPath}
            onFileClick={handleFileClick}
          />
        </div>

        <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <button className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-center gap-2">
            <Settings className="w-3.5 h-3.5" />
            Configure Path
          </button>
        </div>
      </div>

      {/* Right Panel - File Preview / Info */}
      <div className="flex-1 flex items-center justify-center p-8">
        {selectedFile ? (
          <div className="max-w-md text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {selectedFile.name}
            </h3>
            <p className="text-[13px] mb-4" style={{ color: 'var(--text-secondary)' }}>
              {selectedFile.path}
            </p>
            <div className="space-y-2 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              {selectedFile.size && (
                <p>Size: {(selectedFile.size / 1024).toFixed(1)} KB</p>
              )}
              {selectedFile.modified && (
                <p>Modified: {new Date(selectedFile.modified).toLocaleString()}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Select a file to preview
            </h3>
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              Click on any file in the browser to see details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationsView;
