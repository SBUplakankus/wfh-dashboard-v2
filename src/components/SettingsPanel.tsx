import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectManager from './settings/ProjectManager';
import ThemeCustomizer from './settings/ThemeCustomizer';
import CalendarSettings from './settings/CalendarSettings';

const tabs = ['Projects', 'Theme', 'Calendar', 'Tools'] as const;

type SettingsPanelProps = {
  open: boolean;
  onClose: () => void;
};

const SettingsPanel = ({ open, onClose }: SettingsPanelProps) => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Projects');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="md3-card w-full max-w-5xl overflow-hidden p-0"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="grid gap-0 md:grid-cols-[220px_1fr]">
              <div className="border-b border-r border-md3-outline p-5 md:border-b-0">
                <div className="flex items-center justify-between">
                  <h2 className="md3-label">Settings</h2>
                  <button className="md3-button md:hidden" onClick={onClose} type="button">Close</button>
                </div>
                <div className="mt-4 grid gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      className={`md3-button w-full justify-start ${tab === activeTab ? 'md3-button-primary' : ''}`}
                      onClick={() => setActiveTab(tab)}
                      type="button"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-5 p-5">
                <div className="hidden justify-end md:flex">
                  <button className="md3-button" onClick={onClose} type="button">Close</button>
                </div>
                <motion.div key={activeTab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                  {activeTab === 'Projects' ? <ProjectManager /> : null}
                  {activeTab === 'Theme' ? <ThemeCustomizer /> : null}
                  {activeTab === 'Calendar' ? <CalendarSettings /> : null}
                  {activeTab === 'Tools' ? <p className="text-sm text-md3-on-surface-variant">Tool paths are configured per-project in this MVP.</p> : null}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SettingsPanel;
