import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gamepad2, User, Cpu, Briefcase } from 'lucide-react';
import { Project } from '../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Omit<Project, 'id'>) => void;
  editProject?: Project;
}

const ICON_OPTIONS = [
  { name: 'Gamepad2', icon: Gamepad2, label: 'Game Dev' },
  { name: 'User', icon: User, label: 'Personal' },
  { name: 'Cpu', icon: Cpu, label: 'Technical' },
  { name: 'Briefcase', icon: Briefcase, label: 'Work' },
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreateProject,
  editProject 
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    name: editProject?.name || '',
    description: editProject?.description || '',
    category: editProject?.category || 'Work',
    status: editProject?.status || 'Active',
    icon: editProject?.icon || 'Gamepad2',
    links: editProject?.links || [],
    integrations: editProject?.integrations || {
      hasCalendar: false,
      hasKanban: true,
      hasNotes: true,
      hasDocs: true,
    },
  });

  if (!isOpen) return null;

  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }
    setError('');
    onCreateProject(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            {editProject ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 px-6 pt-4 border-b border-[var(--border)]">
          <button
            className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'general'
                ? 'text-[var(--accent)] border-[var(--accent)]'
                : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'features'
                ? 'text-[var(--accent)] border-[var(--accent)]'
                : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5'
            }`}
            onClick={() => setActiveTab('features')}
          >
            Features
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[400px]">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Game Dev Project"
                      className="w-full px-4 py-2.5 bg-[var(--app-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] focus:bg-[var(--accent)]/5 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of your project"
                      rows={3}
                      className="w-full px-4 py-2.5 bg-[var(--app-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] focus:bg-[var(--accent)]/5 transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-[var(--app-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:bg-[var(--accent)]/5 transition-all"
                      >
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Side">Side Project</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-[var(--app-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:bg-[var(--accent)]/5 transition-all"
                      >
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Completed">Completed</option>
                        <option value="Backlog">Backlog</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                      Project Icon
                    </label>
                    <div className="flex gap-3">
                      {ICON_OPTIONS.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <button
                            key={option.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: option.name })}
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                              formData.icon === option.name
                                ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                                : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5'
                            }`}
                          >
                            <IconComponent className="w-6 h-6" />
                            <span className="text-xs">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="space-y-4">
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Enable features and integrations for this project:
                  </p>

                  <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-[var(--accent)]/5">
                    <input
                      type="checkbox"
                      checked={formData.integrations?.hasCalendar || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          integrations: {
                            ...formData.integrations!,
                            hasCalendar: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-[var(--accent)]"
                    />
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Calendar & Meetings</div>
                      <div className="text-xs text-[var(--text-secondary)]">Track meetings and calendar events</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-[var(--accent)]/5">
                    <input
                      type="checkbox"
                      checked={formData.integrations?.hasKanban || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          integrations: {
                            ...formData.integrations!,
                            hasKanban: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-[var(--accent)]"
                    />
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Kanri (Tasks)</div>
                      <div className="text-xs text-[var(--text-secondary)]">Task management and kanban board</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-[var(--accent)]/5">
                    <input
                      type="checkbox"
                      checked={formData.integrations?.hasNotes || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          integrations: {
                            ...formData.integrations!,
                            hasNotes: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-[var(--accent)]"
                    />
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Joplin (Notes)</div>
                      <div className="text-xs text-[var(--text-secondary)]">Note-taking and knowledge management</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-[var(--accent)]/5">
                    <input
                      type="checkbox"
                      checked={formData.integrations?.hasDocs || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          integrations: {
                            ...formData.integrations!,
                            hasDocs: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-[var(--accent)]"
                    />
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">MkDocs (Documentation)</div>
                      <div className="text-xs text-[var(--text-secondary)]">Project documentation and wiki</div>
                    </div>
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 transition-all"
          >
            {editProject ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateProjectModal;
