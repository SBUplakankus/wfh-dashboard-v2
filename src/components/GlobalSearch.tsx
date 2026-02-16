import React, { useState, useEffect, useCallback } from 'react';
import { Search, FileText, BookOpen, CheckSquare, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  type: 'file' | 'note' | 'task';
  title: string;
  subtitle?: string;
  path?: string;
  icon: React.ReactNode;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Mock search function - will be replaced with real search across all tools
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Mock results from different sources
    const mockResults: SearchResult[] = [
      // Files
      {
        id: 'file1',
        type: 'file',
        title: 'Getting Started Guide',
        subtitle: 'docs/getting-started/index.md',
        path: '/docs/getting-started/index.md',
        icon: <FileText className="w-4 h-4" style={{ color: '#10b981' }} />,
      },
      {
        id: 'file2',
        type: 'file',
        title: 'API Reference',
        subtitle: 'docs/api/reference.md',
        path: '/docs/api/reference.md',
        icon: <FileText className="w-4 h-4" style={{ color: '#10b981' }} />,
      },
      // Notes
      {
        id: 'note1',
        type: 'note',
        title: 'Sprint Planning Notes',
        subtitle: 'Project Notes',
        icon: <BookOpen className="w-4 h-4" style={{ color: '#3b82f6' }} />,
      },
      {
        id: 'note2',
        type: 'note',
        title: 'Architecture Decisions',
        subtitle: 'Project Notes',
        icon: <BookOpen className="w-4 h-4" style={{ color: '#3b82f6' }} />,
      },
      // Tasks
      {
        id: 'task1',
        type: 'task',
        title: 'Implement file browser UI',
        subtitle: 'Done',
        icon: <CheckSquare className="w-4 h-4" style={{ color: '#10b981' }} />,
      },
      {
        id: 'task2',
        type: 'task',
        title: 'Add calendar integration',
        subtitle: 'In Progress',
        icon: <CheckSquare className="w-4 h-4" style={{ color: '#3b82f6' }} />,
      },
    ];

    // Filter results based on query
    const filtered = mockResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered);
    setSelectedIndex(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query);
    }, 150);

    return () => clearTimeout(debounce);
  }, [query, performSearch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleResultClick = (result: SearchResult) => {
    console.log('Navigate to:', result);
    // In real implementation, this would navigate to the item
    onClose();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'file': return 'Documentation';
      case 'note': return 'Notes';
      case 'task': return 'Tasks';
      default: return type;
    }
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Search Modal */}
          <div className="fixed inset-0 flex items-start justify-center z-50 pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Search Input */}
              <div className="p-4 border-b border-white/[0.05]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search files, notes, and tasks..."
                    className="w-full pl-12 pr-12 py-3 bg-transparent border-none text-[15px] focus:outline-none"
                    style={{ color: 'var(--text-primary)' }}
                    autoFocus
                  />
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/[0.05] rounded transition-colors"
                  >
                    <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                    <Search className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                    <p className="text-[13px]">Searching...</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                    {query ? (
                      <>
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-[13px]">No results found</p>
                        <p className="text-[11px] mt-1">Try a different search term</p>
                      </>
                    ) : (
                      <>
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-[13px]">Start typing to search</p>
                        <p className="text-[11px] mt-1">Search across files, notes, and tasks</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="py-2">
                    {Object.entries(groupedResults).map(([type, items]) => (
                      <div key={type} className="mb-4 last:mb-0">
                        {/* Type Header */}
                        <div className="px-4 py-2 text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                          {getTypeLabel(type)}
                        </div>

                        {/* Items */}
                        {items.map((result, idx) => {
                          const globalIndex = results.indexOf(result);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <button
                              key={result.id}
                              onClick={() => handleResultClick(result)}
                              className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                                isSelected ? 'bg-blue-500/10' : 'hover:bg-white/[0.02]'
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {result.icon}
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                                  {result.title}
                                </div>
                                {result.subtitle && (
                                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                    {result.subtitle}
                                  </div>
                                )}
                              </div>
                              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-secondary)' }} />
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-white/[0.05] flex items-center justify-between text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-4">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>ESC Close</span>
                </div>
                {results.length > 0 && (
                  <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearch;
