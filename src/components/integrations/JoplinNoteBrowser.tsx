import React, { useState, useEffect } from 'react';
import { JoplinNote, JoplinNotebook } from '../../types';
import { BookOpen, FileText, Tag, Clock, Search, ExternalLink, ChevronRight, ChevronDown, Plus } from 'lucide-react';
import CreateNoteModal from './CreateNoteModal';

interface JoplinNoteBrowserProps {
  joplinDataPath?: string;
  onNoteClick?: (note: JoplinNote) => void;
}

const JoplinNoteBrowser: React.FC<JoplinNoteBrowserProps> = ({ joplinDataPath, onNoteClick }) => {
  const [notebooks, setNotebooks] = useState<JoplinNotebook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedNotebooks, setExpandedNotebooks] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock data for demo purposes (will be replaced with actual Joplin API/database reading)
  useEffect(() => {
    // Simulate loading notebooks
    const mockNotebooks: JoplinNotebook[] = [
      {
        id: 'nb1',
        name: 'Project Notes',
        notes: [
          {
            id: 'n1',
            title: 'Sprint Planning Notes',
            content: '# Sprint Planning\n\nGoals for this sprint...',
            created: new Date('2024-02-10'),
            modified: new Date('2024-02-15'),
            tags: ['sprint', 'planning'],
            notebookId: 'nb1',
          },
          {
            id: 'n2',
            title: 'Architecture Decisions',
            content: '# Architecture\n\nWe decided to use...',
            created: new Date('2024-02-12'),
            modified: new Date('2024-02-14'),
            tags: ['architecture', 'technical'],
            notebookId: 'nb1',
          },
        ],
      },
      {
        id: 'nb2',
        name: 'Meeting Notes',
        notes: [
          {
            id: 'n3',
            title: 'Daily Standup - Feb 15',
            content: '# Daily Standup\n\nToday I worked on...',
            created: new Date('2024-02-15'),
            modified: new Date('2024-02-15'),
            tags: ['standup', 'daily'],
            notebookId: 'nb2',
          },
        ],
      },
      {
        id: 'nb3',
        name: 'Research',
        notes: [
          {
            id: 'n4',
            title: 'React Performance Tips',
            content: '# Performance\n\nMemo and useMemo...',
            created: new Date('2024-02-08'),
            modified: new Date('2024-02-10'),
            tags: ['react', 'performance'],
            notebookId: 'nb3',
          },
          {
            id: 'n5',
            title: 'Database Design Patterns',
            content: '# Databases\n\nNormalization vs denormalization...',
            created: new Date('2024-02-05'),
            modified: new Date('2024-02-06'),
            tags: ['database', 'design'],
            notebookId: 'nb3',
          },
        ],
      },
    ];

    setNotebooks(mockNotebooks);
  }, [joplinDataPath]);

  const toggleNotebook = (notebookId: string) => {
    setExpandedNotebooks(prev => {
      const next = new Set(prev);
      if (next.has(notebookId)) {
        next.delete(notebookId);
      } else {
        next.add(notebookId);
      }
      return next;
    });
  };

  const handleNoteClick = (note: JoplinNote) => {
    if (onNoteClick) {
      onNoteClick(note);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredNotebooks = notebooks.map(notebook => ({
    ...notebook,
    notes: notebook.notes.filter(note =>
      searchQuery === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter(notebook => notebook.notes.length > 0);

  if (!joplinDataPath) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--text-secondary)' }}>
        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-[13px]">No Joplin path configured</p>
        <p className="text-[11px] mt-1">Set your Joplin data folder in Settings → Tools</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--text-secondary)' }}>
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[13px]">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Search Bar */}
      <div className="px-3 py-2 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search notes and tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/[0.02] border border-white/[0.05] rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-neutral-700"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between px-3 py-2 mb-2">
        <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          <BookOpen className="w-3.5 h-3.5" />
          <span>{notebooks.length} notebooks</span>
          <span>•</span>
          <span>{notebooks.reduce((sum, nb) => sum + nb.notes.length, 0)} notes</span>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="p-1 hover:bg-white/[0.04] rounded transition-colors"
          title="Create Note"
        >
          <Plus className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Notebooks List */}
      {filteredNotebooks.length === 0 ? (
        <div className="p-6 text-center" style={{ color: 'var(--text-secondary)' }}>
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-[13px]">No notes found</p>
          {searchQuery && <p className="text-[11px] mt-1">Try a different search term</p>}
        </div>
      ) : (
        filteredNotebooks.map(notebook => {
          const isExpanded = expandedNotebooks.has(notebook.id);
          
          return (
            <div key={notebook.id}>
              {/* Notebook Header */}
              <button
                onClick={() => toggleNotebook(notebook.id)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.04] rounded-lg text-[13px] transition-colors group"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                )}
                <BookOpen className="w-4 h-4 text-orange-400" />
                <span className="flex-1 text-left font-medium" style={{ color: 'var(--text-primary)' }}>
                  {notebook.name}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  {notebook.notes.length}
                </span>
              </button>

              {/* Notes in Notebook */}
              {isExpanded && (
                <div className="ml-6 space-y-1 mt-1">
                  {notebook.notes.map(note => (
                    <button
                      key={note.id}
                      onClick={() => handleNoteClick(note)}
                      className="w-full flex items-start gap-2 px-3 py-2 hover:bg-white/[0.04] rounded-lg text-[12px] transition-colors group"
                    >
                      <FileText className="w-3.5 h-3.5 mt-0.5 text-neutral-500" />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ color: 'var(--text-primary)' }}>{note.title}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-secondary)' }} />
                        </div>
                        <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(note.modified)}</span>
                          {note.tags.length > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {note.tags.slice(0, 2).map(tag => (
                                  <span key={tag} className="px-1.5 py-0.5 bg-white/[0.05] rounded">
                                    {tag}
                                  </span>
                                ))}
                                {note.tags.length > 2 && (
                                  <span className="px-1.5 py-0.5 bg-white/[0.05] rounded">
                                    +{note.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNoteCreated={(note) => {
          // In real implementation, this would refresh the notes list
          console.log('Note created:', note);
        }}
      />
    </div>
  );
};

export default JoplinNoteBrowser;
