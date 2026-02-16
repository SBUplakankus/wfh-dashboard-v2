import React from 'react';
import { X, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KeyboardShortcut {
  keys: string[];
  description: string;
  category: string;
}

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts: KeyboardShortcut[] = [
  // Navigation
  { keys: ['Cmd', 'K'], description: 'Open global search', category: 'Navigation' },
  { keys: ['Cmd', ','], description: 'Open settings', category: 'Navigation' },
  { keys: ['Esc'], description: 'Close modal/dialog', category: 'Navigation' },
  
  // Actions
  { keys: ['Cmd', 'N'], description: 'Create new task', category: 'Actions' },
  { keys: ['Cmd', 'M'], description: 'Create new note', category: 'Actions' },
  { keys: ['Cmd', 'P'], description: 'Create new file', category: 'Actions' },
  
  // Search
  { keys: ['↑', '↓'], description: 'Navigate results', category: 'Search' },
  { keys: ['Enter'], description: 'Select item', category: 'Search' },
];

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ isOpen, onClose }) => {
  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

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

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Command className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-8">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {shortcuts
                        .filter(s => s.category === category)
                        .map((shortcut, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2">
                            <span className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                              {shortcut.description}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {shortcut.keys.map((key, keyIdx) => (
                                <React.Fragment key={keyIdx}>
                                  <kbd
                                    className="px-2 py-1 text-[11px] font-medium rounded border"
                                    style={{
                                      backgroundColor: 'var(--card-bg)',
                                      borderColor: 'rgba(255, 255, 255, 0.1)',
                                      color: 'var(--text-secondary)',
                                    }}
                                  >
                                    {key}
                                  </kbd>
                                  {keyIdx < shortcut.keys.length - 1 && (
                                    <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>+</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/[0.05] text-center">
                <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  Press <kbd className="px-1.5 py-0.5 bg-white/[0.05] rounded text-[10px] font-medium">?</kbd> to toggle this help
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsHelp;
