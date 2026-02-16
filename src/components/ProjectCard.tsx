import React from 'react';
import { Project } from '../types';
import { Edit, Trash2, Calendar, ListTodo, BookOpen, FileText } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const getIconComponent = (iconName?: string) => {
  if (!iconName) return LucideIcons.Folder;
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Folder;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const IconComponent = getIconComponent(project.icon);

  const statusColors = {
    Active: 'bg-green-500/10 text-green-400 border-green-500/20',
    Paused: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Backlog: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <div
      className="border border-[var(--border)] rounded-xl p-5 cursor-pointer transition-all bg-[var(--card-bg)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
      onClick={() => onSelect(project)}
    >
      {/* Project Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-6 h-6 text-[var(--accent)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">{project.name}</h3>
            <span className={`px-2 py-0.5 text-xs rounded-full border ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{project.description}</p>
        </div>
      </div>

      {/* Project Stats */}
      <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-[var(--border)]">
        {project.integrations?.hasCalendar && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </div>
        )}
        {project.integrations?.hasKanban && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <ListTodo className="w-3.5 h-3.5" />
            <span>Tasks</span>
          </div>
        )}
        {project.integrations?.hasNotes && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notes</span>
          </div>
        )}
        {project.integrations?.hasDocs && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <FileText className="w-3.5 h-3.5" />
            <span>Docs</span>
          </div>
        )}
        {!project.integrations?.hasCalendar && 
         !project.integrations?.hasKanban && 
         !project.integrations?.hasNotes && 
         !project.integrations?.hasDocs && (
          <span className="text-xs text-[var(--text-secondary)]">No integrations</span>
        )}
      </div>

      {/* Project Actions */}
      <div className="flex gap-2">
        {showDeleteConfirm ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
              className="flex-1 px-3 py-2 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--text-primary)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="flex-1 px-3 py-2 text-sm font-medium border border-red-500 rounded-lg text-red-500 transition-all hover:bg-red-500/10"
            >
              Confirm Delete
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--text-primary)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--text-primary)] transition-all hover:border-red-500 hover:text-red-500 hover:bg-red-500/5"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
