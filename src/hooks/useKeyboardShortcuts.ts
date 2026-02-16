import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description?: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    shortcuts.forEach(shortcut => {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatches = shortcut.ctrl === undefined || event.ctrlKey === shortcut.ctrl;
      const metaMatches = shortcut.meta === undefined || event.metaKey === shortcut.meta;
      const shiftMatches = shortcut.shift === undefined || event.shiftKey === shortcut.shift;
      const altMatches = shortcut.alt === undefined || event.altKey === shortcut.alt;

      if (keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches) {
        event.preventDefault();
        shortcut.callback();
      }
    });
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Common keyboard shortcuts
export const SHORTCUTS = {
  SEARCH: { key: 'k', meta: true, ctrl: true, description: 'Open global search' },
  NEW_TASK: { key: 'n', meta: true, ctrl: true, description: 'Create new task' },
  NEW_NOTE: { key: 'm', meta: true, ctrl: true, description: 'Create new note' },
  NEW_FILE: { key: 'p', meta: true, ctrl: true, description: 'Create new file' },
  SETTINGS: { key: ',', meta: true, ctrl: true, description: 'Open settings' },
  CLOSE: { key: 'Escape', description: 'Close modal/dialog' },
};
