import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import { Project } from '../types';

export const HomePage: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, setActiveProjectId } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
      setEditingProject(undefined);
    } else {
      addProject(projectData);
    }
    setShowCreateModal(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingProject(undefined);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Your Projects</h1>
            <p className="text-[var(--text-secondary)]">
              Manage all your projects in one place
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-medium transition-all hover:bg-[var(--accent)]/90"
          >
            <Plus className="w-5 h-5" />
            Create New Project
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] focus:bg-[var(--accent)]/5 transition-all"
            />
          </div>
        </div>

        {/* Projects Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-[var(--accent)]" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
              {searchTerm ? 'No projects found' : 'No projects yet'}
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Create your first project to start managing your workflow'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-medium transition-all hover:bg-[var(--accent)]/90"
              >
                Create Your First Project
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProjectCard
                  project={project}
                  onSelect={(p) => setActiveProjectId(p.id)}
                  onEdit={handleEditProject}
                  onDelete={deleteProject}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Create/Edit Project Modal */}
        {showCreateModal && (
          <CreateProjectModal
            isOpen={showCreateModal}
            onClose={handleCloseModal}
            onCreateProject={handleCreateProject}
            editProject={editingProject}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
