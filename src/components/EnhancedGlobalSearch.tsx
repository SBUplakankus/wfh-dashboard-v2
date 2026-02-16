import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, FileText, BookOpen, CheckSquare, X, ArrowRight, Filter, Clock, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { mockKanriTasks, mockJoplinNotebooks, mockDocFiles } from '../mockData';

interface SearchResult {
  id: string;
  type: 'file' | 'note' | 'task' | 'link';
  title: string;
  subtitle?: string;
  path?: string;
  preview?: string;
  icon: React.ReactNode;
  tags?: string[];
  priority?: string;
  modified?: Date;
  projectId?: string;
}

interface SearchFilters {
  type: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
  tags: string[];
  priority: string[];
  projectId?: string;
}

interface EnhancedGlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId?: string;
}

const EnhancedGlobalSearch: React.FC<EnhancedGlobalSearchProps> = ({ 
  isOpen, 
  onClose,
  currentProjectId 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    dateRange: 'all',
    tags: [],
    priority: [],
    projectId: currentProjectId
  });

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Save search to history
  const saveToHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const newHistory = [
      searchQuery,
      ...searchHistory.filter(h => h !== searchQuery)
    ].slice(0, 10); // Keep last 10 searches
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  }, [searchHistory]);

  // Build searchable index from all sources
  const searchableItems = useMemo(() => {
    const items: SearchResult[] = [];

    // Add tasks from Kanri
    if (mockKanriTasks) {
      mockKanriTasks.forEach(task => {
        items.push({
          id: task.id,
          type: 'task',
          title: task.title,
          subtitle: task.column,
          preview: task.description,
          icon: <CheckSquare className="w-4 h-4" style={{ color: '#3b82f6' }} />,
          tags: task.tags,
          priority: task.priority,
          modified: task.dueDate
        });
      });
    }

    // Add notes from Joplin
    if (mockJoplinNotebooks) {
      mockJoplinNotebooks.forEach(notebook => {
        notebook.notes.forEach(note => {
          items.push({
            id: note.id,
            type: 'note',
            title: note.title,
            subtitle: notebook.name,
            preview: note.content.substring(0, 100),
            icon: <BookOpen className="w-4 h-4" style={{ color: '#8b5cf6' }} />,
            tags: note.tags,
            modified: note.modified
          });
        });
      });
    }

    // Add files from MkDocs
    const addFiles = (files: typeof mockDocFiles) => {
      files.forEach(file => {
        if (!file.isFolder) {
          items.push({
            id: file.path,
            type: 'file',
            title: file.name,
            subtitle: file.path,
            path: file.path,
            icon: <FileText className="w-4 h-4" style={{ color: '#10b981' }} />,
            modified: file.modified
          });
        }
        if (file.children) {
          addFiles(file.children);
        }
      });
    };
    
    if (mockDocFiles) {
      addFiles(mockDocFiles);
    }

    return items;
  }, []);

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(searchableItems, {
      keys: ['title', 'subtitle', 'preview', 'tags'],
      threshold: 0.3,
      includeScore: true
    });
  }, [searchableItems]);

  // Apply filters to results
  const applyFilters = useCallback((items: SearchResult[]): SearchResult[] => {
    let filtered = items;

    // Filter by type
    if (filters.type.length > 0) {
      filtered = filtered.filter(item => filters.type.includes(item.type));
    }

    // Filter by date range
    if (filters.dateRange !== 'all' && filtered.length > 0) {
      const now = new Date();
      const cutoff = new Date();
      
      if (filters.dateRange === 'today') {
        cutoff.setHours(0, 0, 0, 0);
      } else if (filters.dateRange === 'week') {
        cutoff.setDate(now.getDate() - 7);
      } else if (filters.dateRange === 'month') {
        cutoff.setMonth(now.getMonth() - 1);
      }

      filtered = filtered.filter(item => 
        item.modified && item.modified >= cutoff
      );
    }

    // Filter by priority
    if (filters.priority.length > 0) {
      filtered = filtered.filter(item => 
        item.priority && filters.priority.includes(item.priority)
      );
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(item => 
        item.tags && item.tags.some(tag => filters.tags.includes(tag))
      );
    }

    return filtered;
  }, [filters]);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    setLoading(true);
    
    // Simulate slight delay for realism
    await new Promise(resolve => setTimeout(resolve, 100));

    // Use Fuse.js for fuzzy search
    const fuseResults = fuse.search(searchQuery);
    const searchResults = fuseResults.map(result => result.item);

    // Apply filters
    const filteredResults = applyFilters(searchResults);

    setResults(filteredResults);
    setSelectedIndex(0);
    setLoading(false);
  }, [fuse, applyFilters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSelect = (result: SearchResult) => {
    saveToHistory(query);
    console.log('Selected:', result);
    // TODO: Navigate to the selected item
    onClose();
  };

  const toggleFilter = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        const arr = prev[filterType] as any[];
        const newArr = arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value];
        return { ...prev, [filterType]: newArr };
      }
      return { ...prev, [filterType]: value };
    });
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      dateRange: 'all',
      tags: [],
      priority: [],
      projectId: currentProjectId
    });
  };

  const resultsByType = useMemo(() => {
    const grouped: Record<string, SearchResult[]> = {};
    results.forEach(result => {
      if (!grouped[result.type]) {
        grouped[result.type] = [];
      }
      grouped[result.type].push(result);
    });
    return grouped;
  }, [results]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-32">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Search Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden"
          style={{ maxHeight: '70vh' }}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-800">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files, notes, tasks..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base"
              autoFocus
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-lg hover:bg-gray-800 transition-colors ${
                showFilters ? 'bg-gray-800 text-blue-400' : 'text-gray-400'
              }`}
              title="Filters"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="p-4 border-b border-gray-800 bg-gray-900/50 space-y-3">
              {/* Type Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400">Type:</span>
                {['file', 'note', 'task'].map(type => (
                  <button
                    key={type}
                    onClick={() => toggleFilter('type', type)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      filters.type.includes(type)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Date Range Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400">Date:</span>
                {[
                  { value: 'all', label: 'All Time' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' }
                ].map(range => (
                  <button
                    key={range.value}
                    onClick={() => setFilters(prev => ({ ...prev, dateRange: range.value as any }))}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      filters.dateRange === range.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400">Priority:</span>
                {['high', 'medium', 'low'].map(priority => (
                  <button
                    key={priority}
                    onClick={() => toggleFilter('priority', priority)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      filters.priority.includes(priority)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>

              <button
                onClick={clearFilters}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Results */}
          <div className="overflow-y-auto" style={{ maxHeight: '50vh' }}>
            {!query.trim() && searchHistory.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Recent Searches</span>
                </div>
                {searchHistory.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(search)}
                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 text-sm transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="p-8 text-center text-gray-400">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-sm">Searching...</p>
              </div>
            )}

            {!loading && query.trim() && results.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No results found for "{query}"</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="p-2">
                {Object.entries(resultsByType).map(([type, items]) => (
                  <div key={type} className="mb-4">
                    <div className="flex items-center gap-2 px-2 mb-2">
                      <Tag className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-400 uppercase tracking-wide">
                        {type}s ({items.length})
                      </span>
                    </div>
                    {items.map((result, idx) => {
                      const globalIdx = results.indexOf(result);
                      const isSelected = globalIdx === selectedIndex;
                      
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleSelect(result)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3 ${
                            isSelected ? 'bg-blue-600/20 border border-blue-500/50' : 'hover:bg-gray-800 border border-transparent'
                          }`}
                        >
                          <div className="flex-shrink-0">{result.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-medium truncate">{result.title}</div>
                            {result.subtitle && (
                              <div className="text-xs text-gray-400 truncate">{result.subtitle}</div>
                            )}
                            {result.preview && (
                              <div className="text-xs text-gray-500 truncate mt-1">{result.preview}</div>
                            )}
                          </div>
                          {isSelected && (
                            <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-800 bg-gray-900/50 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↵</kbd> Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Esc</kbd> Close
              </span>
            </div>
            <span>{results.length} results</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EnhancedGlobalSearch;
