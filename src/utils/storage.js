const KEY = 'wfh-dashboard-v2-config';

const hasElectron = () => typeof window !== 'undefined' && window.dashboardAPI;

export const saveConfig = async (config) => {
  localStorage.setItem(KEY, JSON.stringify(config));
  if (hasElectron()) {
    await window.dashboardAPI.saveConfig(config);
  }
};

export const loadConfig = async () => {
  if (hasElectron()) {
    const data = await window.dashboardAPI.loadConfig();
    if (data) return data;
  }
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
