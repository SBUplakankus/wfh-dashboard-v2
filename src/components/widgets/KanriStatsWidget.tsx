import React from 'react';
import { ListTodo, Circle, ArrowUpRight } from 'lucide-react';
import { KanriTask } from '../../types';

interface KanriStatsWidgetProps {
  tasks: KanriTask[];
  glassStyle?: string;
  onNavigateToTasks?: () => void;
}

const KanriStatsWidget: React.FC<KanriStatsWidgetProps> = ({ tasks, glassStyle = '', onNavigateToTasks }) => {
  // Calculate real stats from Kanri tasks
  const todoTasks = tasks.filter(t => t.column === 'To Do');
  const inProgressTasks = tasks.filter(t => t.column === 'In Progress');
  const reviewTasks = tasks.filter(t => t.column === 'Review');
  const doneTasks = tasks.filter(t => t.column === 'Done');
  
  const totalTasks = tasks.length;
  const completedTasks = doneTasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.column !== 'Done').length;
  
  return (
    <div 
      className={`p-6 border transition-all duration-300 cursor-default ${glassStyle}`}
      style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderColor: 'var(--border)', 
        borderRadius: 'var(--radius)',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="p-2 rounded-lg bg-green-500/10">
          <ListTodo className="w-4 h-4 text-green-500" />
        </div>
        <button 
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors opacity-60 hover:opacity-100"
          onClick={onNavigateToTasks}
          title="View all tasks"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <h3 className="text-[15px] font-semibold mb-1">Kanban Board</h3>
      <p className="text-[11px] mb-4" style={{ color: 'var(--text-secondary)' }}>
        {inProgressTasks.length} active {inProgressTasks.length === 1 ? 'task' : 'tasks'}
        {highPriorityTasks > 0 && `, ${highPriorityTasks} high priority`}
      </p>
      
      <div className="space-y-3">
        {/* Progress bar */}
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-1000" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        {/* Stats */}
        <div className="flex justify-between text-[10px] font-bold text-neutral-500 uppercase">
          <span>{completionPercentage}% Completed</span>
          <span>{completedTasks} / {totalTasks} Tasks</span>
        </div>
        
        {/* Column breakdown */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="flex items-center gap-2 text-[11px]">
            <Circle className="w-3 h-3 text-gray-400" />
            <span className="text-neutral-400">To Do: {todoTasks.length}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Circle className="w-3 h-3 text-blue-400" fill="currentColor" />
            <span className="text-neutral-400">In Progress: {inProgressTasks.length}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Circle className="w-3 h-3 text-yellow-400" fill="currentColor" />
            <span className="text-neutral-400">Review: {reviewTasks.length}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Circle className="w-3 h-3 text-green-400" fill="currentColor" />
            <span className="text-neutral-400">Done: {doneTasks.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanriStatsWidget;
