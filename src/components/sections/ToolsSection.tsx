import React from 'react';
import { openApp, openFile } from '../../utils/ipc';

type ToolButtonProps = {
  label: string;
  onClick: () => void;
};

const ToolButton = ({ label, onClick }: ToolButtonProps) => (
  <button className="md3-button w-full justify-start" type="button" onClick={onClick}>
    {label}
  </button>
);

const ToolsSection = ({ project }: { project: any }) => {
  const paths = project?.paths || {};
  return (
    <section className="md3-card space-y-4 p-6">
      <h3 className="text-base font-semibold tracking-tight">Tools</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ToolButton label="Open Kanri" onClick={() => openApp(paths.kanriPath)} />
        <ToolButton label="Open Joplin" onClick={() => openApp(paths.joplinPath)} />
        <ToolButton label="Open MarkText" onClick={() => openApp(paths.marktextPath)} />
        <ToolButton label="Open MkDocs" onClick={() => openFile(paths.mkdocsPath)} />
      </div>
    </section>
  );
};

export default ToolsSection;
