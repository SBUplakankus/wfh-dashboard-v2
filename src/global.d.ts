interface DashboardAPI {
  openExternal: (url: string) => Promise<void>;
  openFile: (filePath: string) => Promise<void>;
  readFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string }>;
  writeFile: (filePath: string, data: string) => Promise<{ success: boolean; error?: string }>;
  saveConfig: (config: any) => Promise<{ success: boolean; error?: string }>;
  loadConfig: () => Promise<{ success: boolean; data?: any; error?: string }>;
}

interface Window {
  dashboardAPI?: DashboardAPI;
}
