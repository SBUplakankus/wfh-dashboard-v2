import React from 'react';
import { useProjectContext } from '../../context/ProjectContext';

const ToolIntegrationsSettings = () => {
  const { currentProject, updateProject } = useProjectContext() as any;
  const paths = currentProject?.paths || {};

  const setPath = (key: string, value: string) => updateProject(currentProject.id, { paths: { ...paths, [key]: value } });

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold tracking-tight">Tool Integration Paths</h3>
      <p className="text-sm text-md3-on-surface-variant">
        Configure local tool executables and optional JSON exports used for dashboard previews.
      </p>
      <label className="block space-y-2">
        <span className="md3-label">MarkText executable path</span>
        <input className="md3-input" value={paths.marktextPath || ''} onChange={(e) => setPath('marktextPath', e.target.value)} placeholder="/Applications/MarkText.app/Contents/MacOS/MarkText" />
      </label>
      <label className="block space-y-2">
        <span className="md3-label">MkDocs docs folder path</span>
        <input className="md3-input" value={paths.mkdocsPath || ''} onChange={(e) => setPath('mkdocsPath', e.target.value)} placeholder="/workspace/project/docs" />
      </label>
      <label className="block space-y-2">
        <span className="md3-label">Joplin executable path</span>
        <input className="md3-input" value={paths.joplinPath || ''} onChange={(e) => setPath('joplinPath', e.target.value)} placeholder="/Applications/Joplin.app/Contents/MacOS/Joplin" />
      </label>
      <label className="block space-y-2">
        <span className="md3-label">Joplin data JSON path (optional)</span>
        <input className="md3-input" value={paths.joplinDataFile || ''} onChange={(e) => setPath('joplinDataFile', e.target.value)} placeholder="/workspace/exports/joplin-notes.json" />
      </label>
      <label className="block space-y-2">
        <span className="md3-label">Kanri executable path</span>
        <input className="md3-input" value={paths.kanriPath || ''} onChange={(e) => setPath('kanriPath', e.target.value)} placeholder="/Applications/Kanri.app/Contents/MacOS/Kanri" />
      </label>
      <label className="block space-y-2">
        <span className="md3-label">Kanri data JSON path (optional)</span>
        <input className="md3-input" value={paths.kanriDataFile || ''} onChange={(e) => setPath('kanriDataFile', e.target.value)} placeholder="/workspace/exports/kanri-tasks.json" />
      </label>
    </div>
  );
};

export default ToolIntegrationsSettings;

