const fallback = (error) => ({ ok: false, error });

const invoke = async (method, arg) => {
  if (!window.dashboardAPI?.[method]) return fallback('Electron IPC unavailable');
  return window.dashboardAPI[method](arg);
};

export const openApp = (path) => invoke('openApp', path);
export const openFile = (path) => invoke('openFile', path);
export const readFile = (path) => invoke('readFile', path);
export const selectFile = () => invoke('selectFile');
export const selectFolder = () => invoke('selectFolder');
