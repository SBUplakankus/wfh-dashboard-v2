import React from 'react';
import { BookOpen, FileText, ArrowUpRight } from 'lucide-react';
import { JoplinNote, JoplinNotebook } from '../../types';

interface JoplinStatsWidgetProps {
  notebooks: JoplinNotebook[];
  glassStyle?: string;
}

const JoplinStatsWidget: React.FC<JoplinStatsWidgetProps> = ({ notebooks, glassStyle = '' }) => {
  // Calculate real stats from Joplin data
  const allNotes = notebooks.flatMap(nb => nb.notes);
  const totalNotes = allNotes.length;
  
  // Get recent notes (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentNotes = allNotes.filter(note => note.modified > sevenDaysAgo);
  
  // Find most active notebook
  const notebookCounts = notebooks.map(nb => ({ name: nb.name, count: nb.notes.length }));
  const mostActiveNotebook = notebookCounts.reduce((max, nb) => 
    nb.count > max.count ? nb : max, 
    { name: '', count: 0 }
  );
  
  return (
    <div 
      className={`p-6 border transition-all duration-300 hover:-translate-y-1 cursor-default ${glassStyle}`}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <BookOpen className="w-4 h-4 text-purple-400" />
        </div>
        <button 
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors opacity-60 hover:opacity-100"
          onClick={() => {/* Navigate to Integrations/Notes */}}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <h3 className="text-[15px] font-semibold mb-1">Notes</h3>
      <p className="text-[11px] mb-4" style={{ color: 'var(--text-secondary)' }}>
        {recentNotes.length} {recentNotes.length === 1 ? 'update' : 'updates'} this week
      </p>
      
      <div className="space-y-3">
        {/* Total count */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-[13px] font-medium">Total Notes</span>
          </div>
          <span className="text-[15px] font-bold text-purple-400">{totalNotes}</span>
        </div>
        
        {/* Notebook breakdown */}
        <div className="space-y-2 pt-2">
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Notebooks</div>
          {notebooks.slice(0, 3).map(notebook => (
            <div key={notebook.id} className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">{notebook.name}</span>
              <span className="text-neutral-500 font-mono">{notebook.notes.length}</span>
            </div>
          ))}
          {mostActiveNotebook.count > 0 && (
            <div className="text-[10px] text-neutral-500 pt-2">
              Most active: <span className="text-purple-400 font-medium">{mostActiveNotebook.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoplinStatsWidget;
