const baseTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    tertiary: '#93c5fd',
    background: { primary: '#0f1419', secondary: '#111827' },
    text: { primary: '#e2e8f0', secondary: '#94a3b8' },
    border: '#334155'
  },
  gradients: {
    header: { type: 'linear', angle: 180, stops: ['#111827', '#0f172a'] },
    section: { type: 'linear', angle: 180, stops: ['#111827', '#0f172a'] },
    background: { type: 'linear', angle: 180, stops: ['#0f1419', '#0b1220'] }
  },
  typography: { fontFamily: 'system-ui', baseFontSize: 15, headingMultiplier: 1.2, lineHeight: 1.6 },
  layout: { sidebarWidth: 200, spacing: 20, borderRadius: 8, transitionSpeed: 'normal' }
};

const makeTheme = (id, name, overrides = {}) => ({
  id,
  name,
  preset: true,
  ...baseTheme,
  ...overrides,
  colors: { ...baseTheme.colors, ...(overrides.colors || {}) }
});

export const THEME_PRESETS = [
  makeTheme('dark-mode', 'Dark Mode'),
  makeTheme('light-mode', 'Light Mode', { colors: { background: { primary: '#f8fafc', secondary: '#e2e8f0' }, text: { primary: '#0f172a', secondary: '#334155' }, border: '#cbd5e1' } }),
  makeTheme('cyberpunk', 'Cyberpunk', { colors: { primary: '#ff00ff', secondary: '#00ffff', tertiary: '#ffff00' } }),
  makeTheme('forest', 'Forest', { colors: { primary: '#22c55e', secondary: '#14532d', tertiary: '#84cc16' } }),
  makeTheme('ocean', 'Ocean', { colors: { primary: '#0ea5e9', secondary: '#0284c7', tertiary: '#38bdf8' } }),
  makeTheme('sunset', 'Sunset', { colors: { primary: '#f97316', secondary: '#ec4899', tertiary: '#facc15' } })
];

export const DEFAULT_THEME = THEME_PRESETS[0];

export const gradientToCss = ({ type, angle, stops }) => `${type}-gradient(${angle}deg, ${stops.join(', ')})`;
