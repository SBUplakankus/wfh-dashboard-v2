import React, { useState } from 'react';
import Modal from '../Modal';
import { FileText, FolderOpen } from 'lucide-react';

interface CreateFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  basePath: string;
  onFileCreated: (path: string) => void;
}

const TEMPLATES = [
  { id: 'blank', name: 'Blank Document', content: '# \n\n' },
  { id: 'page', name: 'Page', content: '# Page Title\n\n## Overview\n\n## Details\n\n' },
  { id: 'tutorial', name: 'Tutorial', content: '# Tutorial: \n\n## Prerequisites\n\n## Steps\n\n### Step 1\n\n### Step 2\n\n## Conclusion\n\n' },
  { id: 'api', name: 'API Documentation', content: '# API Reference\n\n## Endpoint\n\n`GET /api/endpoint`\n\n## Parameters\n\n## Response\n\n## Examples\n\n' },
];

const CreateFileModal: React.FC<CreateFileModalProps> = ({ isOpen, onClose, basePath, onFileCreated }) => {
  const [filename, setFilename] = useState('');
  const [folder, setFolder] = useState('');
  const [template, setTemplate] = useState('blank');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!filename.trim()) {
      setError('Filename is required');
      return;
    }

    if (!filename.endsWith('.md')) {
      setError('Filename must end with .md');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const templateContent = TEMPLATES.find(t => t.id === template)?.content || '';
      const fullPath = folder 
        ? `${basePath}/${folder}/${filename}`
        : `${basePath}/${filename}`;

      if (window.dashboardAPI) {
        // Create folder if needed
        if (folder) {
          await window.dashboardAPI.createDirectory(`${basePath}/${folder}`);
        }

        // Create file
        const result = await window.dashboardAPI.writeFile(fullPath, templateContent);
        
        if (result.success) {
          onFileCreated(fullPath);
          handleClose();
        } else {
          setError(result.error || 'Failed to create file');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create file');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setFilename('');
    setFolder('');
    setTemplate('blank');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Document" size="md">
      <div className="space-y-6">
        {/* Filename Input */}
        <div>
          <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Filename
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="my-document.md"
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.02] border border-white/10 rounded-lg text-[13px] focus:outline-none focus:border-blue-500/50 transition-all"
              style={{ color: 'var(--text-primary)' }}
              autoFocus
            />
          </div>
        </div>

        {/* Folder Input */}
        <div>
          <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Folder (optional)
          </label>
          <div className="relative">
            <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="subfolder (leave empty for root)"
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.02] border border-white/10 rounded-lg text-[13px] focus:outline-none focus:border-blue-500/50 transition-all"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Template Selector */}
        <div>
          <label className="block text-[13px] font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            Template
          </label>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  template === t.id
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                  {t.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-[12px] text-red-400">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 px-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-lg text-[13px] font-medium transition-all"
            style={{ color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-[13px] font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Creating...' : 'Create File'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateFileModal;
