import React, { useState, useEffect } from 'react';
import { KanriTask, KanriBoard } from '../../types';
import { Trello, CheckCircle2, Circle, Clock, AlertCircle, ExternalLink, Filter, Plus } from 'lucide-react';
import CreateTaskModal from './CreateTaskModal';

interface KanriTaskBrowserProps {
  kanriDataPath?: string;
  onTaskClick?: (task: KanriTask) => void;
}

const KanriTaskBrowser: React.FC<KanriTaskBrowserProps> = ({ kanriDataPath, onTaskClick }) => {
  const [board, setBoard] = useState<KanriBoard | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterColumn, setFilterColumn] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock data for demo purposes (will be replaced with actual Kanri database reading)
  useEffect(() => {
    const mockBoard: KanriBoard = {
      name: 'Project Board',
      columns: ['To Do', 'In Progress', 'Review', 'Done'],
      tasks: [
        {
          id: 't1',
          title: 'Implement file browser UI',
          description: 'Create component for browsing MkDocs files',
          column: 'Done',
          priority: 'high',
          dueDate: new Date('2024-02-14'),
          tags: ['frontend', 'ui'],
        },
        {
          id: 't2',
          title: 'Add Joplin integration',
          description: 'Connect to Joplin notes database',
          column: 'In Progress',
          priority: 'high',
          dueDate: new Date('2024-02-16'),
          tags: ['integration', 'backend'],
        },
        {
          id: 't3',
          title: 'Design calendar sync feature',
          description: 'Plan how to sync calendar events with tasks',
          column: 'To Do',
          priority: 'medium',
          dueDate: new Date('2024-02-20'),
          tags: ['planning', 'calendar'],
        },
        {
          id: 't4',
          title: 'Write documentation',
          description: 'Document all integration features',
          column: 'To Do',
          priority: 'low',
          dueDate: new Date('2024-02-25'),
          tags: ['docs'],
        },
        {
          id: 't5',
          title: 'Test Kanri browser',
          description: 'QA testing for task browser component',
          column: 'Review',
          priority: 'high',
          dueDate: new Date('2024-02-17'),
          tags: ['testing', 'qa'],
        },
        {
          id: 't6',
          title: 'Optimize performance',
          description: 'Profile and optimize file operations',
          column: 'To Do',
          priority: 'medium',
          dueDate: new Date('2024-02-22'),
          tags: ['performance', 'optimization'],
        },
      ],
    };

    setBoard(mockBoard);
  }, [kanriDataPath]);

  const handleTaskClick = (task: KanriTask) => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (date: Date) => {
    return new Date(date) < new Date();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-neutral-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Clock;
      case 'low': return CheckCircle2;
      default: return Circle;
    }
  };

  if (!kanriDataPath) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--text-secondary)' }}>
        <Trello className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-[13px]">No Kanri path configured</p>
        <p className="text-[11px] mt-1">Set your Kanri data folder in Settings → Tools</p>
      </div>
    );
  }

  if (loading || !board) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--text-secondary)' }}>
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[13px]">Loading tasks...</p>
      </div>
    );
  }

  const filteredTasks = board.tasks.filter(task => {
    if (filterColumn && task.column !== filterColumn) return false;
    if (filterPriority && task.priority !== filterPriority) return false;
    return true;
  });

  const tasksByColumn = board.columns.map(column => ({
    column,
    tasks: filteredTasks.filter(task => task.column === column),
  }));

  return (
    <div className="space-y-3">
      {/* Board Header */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 mb-3">
          <Trello className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <h3 className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {board.name}
          </h3>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
          <select
            value={filterColumn || ''}
            onChange={(e) => setFilterColumn(e.target.value || null)}
            className="px-2 py-1 bg-white/[0.02] border border-white/[0.05] rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            style={{ color: 'var(--text-primary)' }}
          >
            <option value="">All Columns</option>
            {board.columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          
          <select
            value={filterPriority || ''}
            onChange={(e) => setFilterPriority(e.target.value || null)}
            className="px-2 py-1 bg-white/[0.02] border border-white/[0.05] rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            style={{ color: 'var(--text-primary)' }}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            <span>{filteredTasks.length} tasks</span>
            <span>•</span>
            <span>{filteredTasks.filter(t => t.column === 'Done').length} completed</span>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-1 hover:bg-white/[0.04] rounded transition-colors"
            title="Create Task"
          >
            <Plus className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
      </div>

      {/* Tasks by Column */}
      {tasksByColumn.map(({ column, tasks }) => (
        tasks.length > 0 && (
          <div key={column} className="space-y-1">
            {/* Column Header */}
            <div className="px-3 py-1.5 bg-white/[0.02] rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ 
                  backgroundColor: column === 'Done' ? '#10b981' : column === 'In Progress' ? '#3b82f6' : column === 'Review' ? '#f59e0b' : '#6b7280' 
                }} />
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  {column}
                </span>
                <span className="text-[10px] ml-auto" style={{ color: 'var(--text-secondary)' }}>
                  {tasks.length}
                </span>
              </div>
            </div>

            {/* Tasks */}
            {tasks.map(task => {
              const PriorityIcon = getPriorityIcon(task.priority);
              const overdueDate = task.dueDate && isOverdue(task.dueDate);

              return (
                <button
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="w-full px-3 py-2.5 ml-3 mr-1 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-lg text-left transition-colors group"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <PriorityIcon className={`w-4 h-4 mt-0.5 ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                          {task.title}
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-secondary)' }} />
                      </div>
                      
                      {task.description && (
                        <p className="text-[11px] mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                        {task.dueDate && (
                          <>
                            <Clock className="w-3 h-3" />
                            <span className={overdueDate ? 'text-red-400' : ''}>
                              {formatDate(task.dueDate)}
                            </span>
                          </>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <>
                            {task.dueDate && <span>•</span>}
                            {task.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 bg-white/[0.05] rounded">
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="px-1.5 py-0.5 bg-white/[0.05] rounded">
                                +{task.tags.length - 2}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )
      ))}

      {filteredTasks.length === 0 && (
        <div className="p-6 text-center" style={{ color: 'var(--text-secondary)' }}>
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-[13px]">No tasks found</p>
          <p className="text-[11px] mt-1">Try changing the filters</p>
        </div>
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={(task) => {
          // In real implementation, this would add the task to the board
          console.log('Task created:', task);
        }}
      />
    </div>
  );
};

export default KanriTaskBrowser;
