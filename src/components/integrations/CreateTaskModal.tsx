import React, { useState } from 'react';
import Modal from '../Modal';
import { CheckSquare, Calendar, Flag, AlignLeft } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: any) => void;
}

const COLUMNS = ['To Do', 'In Progress', 'Review', 'Done'];
const PRIORITIES: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [column, setColumn] = useState('To Do');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setCreating(true);
    setError('');

    try {
      // Mock task creation - in real implementation, this would write to Kanri database
      const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        column,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        created: new Date(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      onTaskCreated(newTask);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setColumn('To Do');
    setPriority('medium');
    setDueDate('');
    setError('');
    onClose();
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'border-red-500/50 bg-red-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-green-500/50 bg-green-500/10';
      default: return 'border-white/10 bg-white/[0.02]';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task" size="md">
      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Task Title
          </label>
          <div className="relative">
            <CheckSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Implement new feature..."
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.02] border border-white/10 rounded-lg text-[13px] focus:outline-none focus:border-blue-500/50 transition-all"
              style={{ color: 'var(--text-primary)' }}
              autoFocus
            />
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Description (optional)
          </label>
          <div className="relative">
            <AlignLeft className="absolute left-3 top-3 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task details..."
              rows={3}
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.02] border border-white/10 rounded-lg text-[13px] focus:outline-none focus:border-blue-500/50 transition-all resize-none"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Column Selector */}
          <div>
            <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Column
            </label>
            <select
              value={column}
              onChange={(e) => setColumn(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/[0.02] border border-white/10 rounded-lg text-[13px] focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              {COLUMNS.map((col) => (
                <option key={col} value={col} className="bg-neutral-900">
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Due Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-white/[0.02] border border-white/10 rounded-lg text-[13px] focus:outline-none focus:border-blue-500/50 transition-all"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-[13px] font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            <Flag className="inline w-3.5 h-3.5 mr-1.5" />
            Priority
          </label>
          <div className="flex gap-3">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`flex-1 py-2 px-3 rounded-lg border text-[12px] font-medium transition-all ${
                  priority === p ? getPriorityColor(p) : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
                style={{ color: priority === p ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-[12px] text-red-400">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 px-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-lg text-[13px] font-medium transition-all"
            style={{ color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-[13px] font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateTaskModal;
