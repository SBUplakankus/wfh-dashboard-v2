import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FileText, Folder, FolderOpen, NotebookText, SquareKanban } from 'lucide-react';
import { listDirectory, openApp, openAppWithFile, openFile, readFile, writeFile } from '../../utils/ipc';

type ToolButtonProps = {
  label: string;
  onClick: () => void;
};

const ToolButton = ({ label, onClick }: ToolButtonProps) => (
  <button className="md3-button w-full justify-start" type="button" onClick={onClick}>
    {label}
  </button>
);

const TEMPLATE_MAP: Record<string, string> = {
  blank: '# New Document\n',
  page: '---\ntitle: New Page\n---\n\n# New Page\n\n## Summary\n\n',
  tutorial: '# Tutorial\n\n## Goal\n\n## Steps\n\n1. Step one\n2. Step two\n',
  api: '# API Reference\n\n## Endpoint\n\n- Method:\n- Path:\n- Request:\n- Response:\n'
};

const flattenFolders = (nodes: any[] = []) =>
  nodes.flatMap((node) => (node.type === 'folder' ? [node.path, ...flattenFolders(node.children || [])] : []));

const parseJoplinData = (raw: string) => {
  try {
    const data = JSON.parse(raw || '{}');
    const notebooks = Array.isArray(data.notebooks) ? data.notebooks : [];
    const notes = Array.isArray(data.notes) ? data.notes : [];
    return { notebooks, notes };
  } catch {
    return { notebooks: [], notes: [] };
  }
};

const parseKanriData = (raw: string) => {
  try {
    const data = JSON.parse(raw || '{}');
    const columns = Array.isArray(data.columns) ? data.columns : [];
    const tasks = Array.isArray(data.tasks) ? data.tasks : [];
    return { columns, tasks };
  } catch {
    return { columns: [], tasks: [] };
  }
};

const TreeNode = ({
  node,
  depth,
  expanded,
  toggleFolder,
  onSelectFile
}: {
  node: any;
  depth: number;
  expanded: Record<string, boolean>;
  toggleFolder: (path: string) => void;
  onSelectFile: (path: string) => void;
}) => {
  if (node.type === 'folder') {
    const open = !!expanded[node.path];
    return (
      <div className="space-y-1">
        <button className="md3-button w-full justify-start gap-2 px-2 py-1.5 text-left" type="button" onClick={() => toggleFolder(node.path)}>
          {open ? <FolderOpen size={14} /> : <Folder size={14} />}
          <span className="truncate text-xs">{node.name}</span>
        </button>
        {open ? (
          <div className="space-y-1" style={{ paddingLeft: `${(depth + 1) * 10}px` }}>
            {(node.children || []).map((child: any) => (
              <TreeNode key={child.path} node={child} depth={depth + 1} expanded={expanded} toggleFolder={toggleFolder} onSelectFile={onSelectFile} />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <button className="md3-button w-full justify-start gap-2 px-2 py-1.5 text-left" type="button" onClick={() => onSelectFile(node.path)}>
      <FileText size={14} />
      <span className="truncate text-xs">{node.name}</span>
    </button>
  );
};

const ToolsSection = ({ project }: { project: any }) => {
  const paths = project?.paths || {};
  const [mkdocsTree, setMkdocsTree] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState('');
  const [preview, setPreview] = useState('');
  const [template, setTemplate] = useState('blank');
  const [newFileName, setNewFileName] = useState('');
  const [targetFolder, setTargetFolder] = useState('');
  const [joplinData, setJoplinData] = useState<{ notebooks: any[]; notes: any[] }>({ notebooks: [], notes: [] });
  const [kanriData, setKanriData] = useState<{ columns: any[]; tasks: any[] }>({ columns: [], tasks: [] });
  const [statusMessage, setStatusMessage] = useState('');

  const refreshMkdocsTree = useCallback(async () => {
    const tree = await listDirectory(paths.mkdocsPath || '');
    setMkdocsTree(tree);
    if (!targetFolder && paths.mkdocsPath) setTargetFolder(paths.mkdocsPath);
    setExpanded((prev) => ({ ...prev, [paths.mkdocsPath]: true }));
  }, [paths.mkdocsPath, targetFolder]);

  useEffect(() => {
    refreshMkdocsTree();
  }, [refreshMkdocsTree]);

  useEffect(() => {
    if (!paths.joplinDataFile) {
      setJoplinData({ notebooks: [], notes: [] });
      return;
    }
    readFile(paths.joplinDataFile).then((raw: any) => setJoplinData(parseJoplinData(typeof raw === 'string' ? raw : '')));
  }, [paths.joplinDataFile]);

  useEffect(() => {
    if (!paths.kanriDataFile) {
      setKanriData({ columns: [], tasks: [] });
      return;
    }
    readFile(paths.kanriDataFile).then((raw: any) => setKanriData(parseKanriData(typeof raw === 'string' ? raw : '')));
  }, [paths.kanriDataFile]);

  const folderOptions = useMemo(() => [paths.mkdocsPath, ...flattenFolders(mkdocsTree)].filter(Boolean), [mkdocsTree, paths.mkdocsPath]);
  const recentNotes = useMemo(() => [...joplinData.notes].slice(0, 5), [joplinData.notes]);
  const recentTasks = useMemo(() => [...kanriData.tasks].slice(0, 6), [kanriData.tasks]);

  const openInMarkText = (filePath: string) => {
    if (paths.marktextPath) return openAppWithFile(paths.marktextPath, filePath);
    return openFile(filePath);
  };

  const onSelectFile = async (filePath: string) => {
    setSelectedFile(filePath);
    const content = await readFile(filePath);
    setPreview(typeof content === 'string' ? content : '');
  };

  const createMkdocsFile = async () => {
    if (!newFileName.trim() || !targetFolder) return;
    const normalizedName = newFileName.trim().endsWith('.md') ? newFileName.trim() : `${newFileName.trim()}.md`;
    const fullPath = `${targetFolder.replace(/\/$/, '')}/${normalizedName}`;
    const result = await writeFile(fullPath, TEMPLATE_MAP[template] || TEMPLATE_MAP.blank);
    if (result?.ok === false) {
      setStatusMessage(result.error || 'Unable to create markdown file.');
      return;
    }
    setNewFileName('');
    setStatusMessage(`Created ${normalizedName}`);
    await refreshMkdocsTree();
    await onSelectFile(fullPath);
    openInMarkText(fullPath);
  };

  return (
    <section className="md3-card space-y-4 p-6">
      <h3 className="text-base font-semibold tracking-tight">Tools</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ToolButton label="Open Kanri" onClick={() => openApp(paths.kanriPath)} />
        <ToolButton label="Open Joplin" onClick={() => openApp(paths.joplinPath)} />
        <ToolButton label="Open MarkText" onClick={() => openApp(paths.marktextPath)} />
        <ToolButton label="Open MkDocs" onClick={() => openFile(paths.mkdocsPath)} />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="md3-card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-md3-on-surface">MkDocs Browser</h4>
            <button className="md3-button" type="button" onClick={refreshMkdocsTree}>
              Refresh
            </button>
          </div>
          {!paths.mkdocsPath ? <p className="text-sm text-md3-on-surface-variant">Set MkDocs docs folder path in Settings → Tools.</p> : null}
          <div className="max-h-60 space-y-1 overflow-auto rounded-lg border border-md3-outline p-2">
            {mkdocsTree.length === 0 ? <p className="px-2 py-1 text-xs text-md3-on-surface-variant">No markdown files detected.</p> : null}
            {mkdocsTree.map((node) => (
              <TreeNode
                key={node.path}
                node={node}
                depth={0}
                expanded={expanded}
                toggleFolder={(path) => setExpanded((prev) => ({ ...prev, [path]: !prev[path] }))}
                onSelectFile={onSelectFile}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto]">
            <select className="md3-input" value={targetFolder} onChange={(e) => setTargetFolder(e.target.value)}>
              {folderOptions.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
            <select className="md3-input" value={template} onChange={(e) => setTemplate(e.target.value)}>
              <option value="blank">Blank</option>
              <option value="page">Page Template</option>
              <option value="tutorial">Tutorial Template</option>
              <option value="api">API Doc Template</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <input className="md3-input max-w-sm" placeholder="new-doc.md" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} />
            <button className="md3-button md3-button-primary" type="button" onClick={createMkdocsFile}>
              Create & Open
            </button>
            {selectedFile ? (
              <button className="md3-button" type="button" onClick={() => openInMarkText(selectedFile)}>
                Edit in MarkText
              </button>
            ) : null}
          </div>
          {statusMessage ? <p className="text-xs text-md3-on-surface-variant">{statusMessage}</p> : null}
        </div>
        <div className="md3-card space-y-3 p-4">
          <h4 className="text-sm font-semibold text-md3-on-surface">Markdown Preview</h4>
          {selectedFile ? <p className="text-xs text-md3-on-surface-variant">{selectedFile}</p> : <p className="text-sm text-md3-on-surface-variant">Select a markdown file to preview.</p>}
          <div className="max-h-72 overflow-auto rounded-lg border border-md3-outline bg-md3-surface-variant p-3">
            <pre className="whitespace-pre-wrap text-xs text-md3-on-surface">{preview || 'No content loaded.'}</pre>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="md3-card space-y-3 p-4">
          <div className="flex items-center gap-2">
            <NotebookText size={16} />
            <h4 className="text-sm font-semibold text-md3-on-surface">Joplin Notes</h4>
          </div>
          {!paths.joplinDataFile ? <p className="text-sm text-md3-on-surface-variant">Optional: set Joplin data JSON path to preview notes.</p> : null}
          <p className="text-xs text-md3-on-surface-variant">{joplinData.notebooks.length} notebooks • {joplinData.notes.length} notes</p>
          <div className="space-y-2">
            {recentNotes.length === 0 ? <p className="text-xs text-md3-on-surface-variant">No notes available.</p> : null}
            {recentNotes.map((note: any) => (
              <button key={note.id || note.title} className="md3-button w-full justify-start gap-2 text-left" type="button" onClick={() => openApp(paths.joplinPath)}>
                <FileText size={14} />
                <span className="truncate text-xs">{note.title || 'Untitled note'}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="md3-card space-y-3 p-4">
          <div className="flex items-center gap-2">
            <SquareKanban size={16} />
            <h4 className="text-sm font-semibold text-md3-on-surface">Kanri Tasks</h4>
          </div>
          {!paths.kanriDataFile ? <p className="text-sm text-md3-on-surface-variant">Optional: set Kanri data JSON path to preview tasks.</p> : null}
          <div className="flex flex-wrap gap-2">
            {kanriData.columns.map((column: any) => {
              const count = kanriData.tasks.filter((task: any) => task.status === column.id || task.status === column.name).length;
              return (
                <span key={column.id || column.name} className="rounded-full border border-md3-outline px-2 py-1 text-xs text-md3-on-surface-variant">
                  {column.name}: {count}
                </span>
              );
            })}
          </div>
          <div className="space-y-2">
            {recentTasks.length === 0 ? <p className="text-xs text-md3-on-surface-variant">No tasks available.</p> : null}
            {recentTasks.map((task: any) => (
              <button key={task.id || task.title} className="md3-button w-full justify-start gap-2 text-left" type="button" onClick={() => openApp(paths.kanriPath)}>
                <SquareKanban size={14} />
                <span className="truncate text-xs">{task.title || 'Untitled task'}</span>
                {task.priority ? <span className="ml-auto text-[10px] text-md3-on-surface-variant">{task.priority}</span> : null}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
