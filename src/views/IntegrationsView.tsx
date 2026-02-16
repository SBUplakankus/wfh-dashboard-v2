import React, { useState } from 'react';
import MkDocsFileBrowser from '../components/integrations/MkDocsFileBrowser';
import JoplinNoteBrowser from '../components/integrations/JoplinNoteBrowser';
import KanriTaskBrowser from '../components/integrations/KanriTaskBrowser';
import { DocFile, JoplinNote, KanriTask } from '../types';
import { FileText, Book, FolderOpen, Settings, Trello, BookOpen } from 'lucide-react';

type IntegrationTab = 'mkdocs' | 'joplin' | 'kanri';

const IntegrationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<IntegrationTab>('mkdocs');
  // TODO: Load these from configuration/settings
  const [mkdocsPath] = useState<string>(process.env.MKDOCS_PATH || './docs');
  const [joplinPath] = useState<string>(process.env.JOPLIN_PATH || '');
  const [kanriPath] = useState<string>(process.env.KANRI_PATH || '');
  const [selectedItem, setSelectedItem] = useState<DocFile | JoplinNote | KanriTask | null>(null);

  const handleFileClick = (file: DocFile) => {
    setSelectedItem(file);
    if (window.dashboardAPI) {
      window.dashboardAPI.openFile(file.path);
    }
  };

  const handleNoteClick = (note: JoplinNote) => {
    setSelectedItem(note);
    // Open in Joplin - would need Joplin CLI or API integration
  };

  const handleTaskClick = (task: KanriTask) => {
    setSelectedItem(task);
    // Open in Kanri - would need Kanri integration
  };

  const tabs: { id: IntegrationTab; label: string; icon: any }[] = [
    { id: 'mkdocs', label: 'Documentation', icon: Book },
    { id: 'joplin', label: 'Notes', icon: BookOpen },
    { id: 'kanri', label: 'Tasks', icon: Trello },
  ];

  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Left Panel - Browser */}
      <div className="w-80 border-r flex flex-col" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card-bg)' }}>
        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-[12px] font-medium transition-colors ${
                  isActive ? 'border-b-2' : 'hover:bg-white/[0.02]'
                }`}
                style={{
                  borderColor: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            {activeTab === 'mkdocs' && (
              <>
                <Book className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <h2 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  MkDocs Browser
                </h2>
              </>
            )}
            {activeTab === 'joplin' && (
              <>
                <BookOpen className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <h2 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Joplin Notes
                </h2>
              </>
            )}
            {activeTab === 'kanri' && (
              <>
                <Trello className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <h2 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Kanri Tasks
                </h2>
              </>
            )}
          </div>
          <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            {activeTab === 'mkdocs' && 'Browse and manage documentation files'}
            {activeTab === 'joplin' && 'Access your notes and notebooks'}
            {activeTab === 'kanri' && 'View and manage tasks'}
          </p>
        </div>

        {/* Browser Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'mkdocs' && (
            <MkDocsFileBrowser 
              docsPath={mkdocsPath}
              onFileClick={handleFileClick}
            />
          )}
          {activeTab === 'joplin' && (
            <JoplinNoteBrowser 
              joplinDataPath={joplinPath}
              onNoteClick={handleNoteClick}
            />
          )}
          {activeTab === 'kanri' && (
            <KanriTaskBrowser 
              kanriDataPath={kanriPath}
              onTaskClick={handleTaskClick}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <button 
            className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-center gap-2"
            onClick={() => console.log('Configure integration paths - would open settings')}
          >
            <Settings className="w-3.5 h-3.5" />
            Configure Paths
          </button>
        </div>
      </div>

      {/* Right Panel - Preview / Details */}
      <div className="flex-1 flex items-center justify-center p-8">
        {selectedItem ? (
          <div className="max-w-md text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            {('name' in selectedItem) ? (
              // DocFile
              <>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {selectedItem.name}
                </h3>
                <p className="text-[13px] mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {selectedItem.path}
                </p>
                <div className="space-y-2 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                  {selectedItem.size && (
                    <p>Size: {(selectedItem.size / 1024).toFixed(1)} KB</p>
                  )}
                  {selectedItem.modified && (
                    <p>Modified: {new Date(selectedItem.modified).toLocaleString()}</p>
                  )}
                </div>
              </>
            ) : ('title' in selectedItem && 'notebookId' in selectedItem) ? (
              // JoplinNote
              <>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {selectedItem.title}
                </h3>
                <div className="space-y-2 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                  <p>Created: {new Date(selectedItem.created).toLocaleDateString()}</p>
                  <p>Modified: {new Date(selectedItem.modified).toLocaleDateString()}</p>
                  {selectedItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mt-3">
                      {selectedItem.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white/[0.05] rounded text-[11px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // KanriTask
              <>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {selectedItem.title}
                </h3>
                <p className="text-[13px] mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {selectedItem.description}
                </p>
                <div className="space-y-2 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                  <p>Column: {selectedItem.column}</p>
                  <p>Priority: <span className={
                    selectedItem.priority === 'high' ? 'text-red-400' :
                    selectedItem.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }>{selectedItem.priority}</span></p>
                  {selectedItem.dueDate && (
                    <p>Due: {new Date(selectedItem.dueDate).toLocaleDateString()}</p>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Select an item to preview
            </h3>
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              Click on any item in the browser to see details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationsView;
