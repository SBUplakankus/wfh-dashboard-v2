import React, { useState } from 'react';
import Modal from '../Modal';
import { FileText, Tag, BookOpen } from 'lucide-react';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteCreated: (note: any) => void;
}

const NOTEBOOKS = [
  { id: '1', name: 'Project Notes' },
  { id: '2', name: 'Meeting Notes' },
  { id: '3', name: 'Research' },
  { id: '4', name: 'Personal' },
];

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ isOpen, onClose, onNoteCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notebookId, setNotebookId] = useState('1');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setCreating(true);
    setError('');

    try {
      // Mock note creation - in real implementation, this would call Joplin API
      const newNote = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        notebookId,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        created: new Date(),
        modified: new Date(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      onNoteCreated(newNote);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setNotebookId('1');
    setTags('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Note" size="lg">
      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Note Title
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My new note..."
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.02] border border-white/10 rounded-lg text-[13px] focus:outline-none focus:border-blue-500/50 transition-all"
              style={{ color: 'var(--text-primary)' }}
              autoFocus
            />
          </div>
        </div>

        {/* Notebook Selector */}
        <div>
          <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Notebook
          </label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <select
              value={notebookId}
              onChange={(e) => setNotebookId(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.02] border border-white/10 rounded-lg text-[13px] focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              {NOTEBOOKS.map((nb) => (
                <option key={nb.id} value={nb.id} className="bg-neutral-900">
                  {nb.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Textarea */}
        <div>
          <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content here..."
            rows={6}
            className="w-full px-3 py-2.5 bg-white/[0.02] border border-white/10 rounded-lg text-[13px] focus:outline-none focus:border-blue-500/50 transition-all resize-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* Tags Input */}
        <div>
          <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Tags (comma-separated)
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, important, project-name"
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.02] border border-white/10 rounded-lg text-[13px] focus:outline-none focus:border-blue-500/50 transition-all"
              style={{ color: 'var(--text-primary)' }}
            />
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
            {creating ? 'Creating...' : 'Create Note'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateNoteModal;
