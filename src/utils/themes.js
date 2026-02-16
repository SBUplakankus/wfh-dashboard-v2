const baseTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    tertiary: '#06b6d4',
    background: { primary: '#0f172a', secondary: '#1e293b' },
    text: { primary: '#f1f5f9', secondary: '#cbd5e1' },
    border: '#475569'
  },
  gradients: {
    header: { type: 'linear', angle: 135, stops: ['#6366f1', '#8b5cf6'] },
    section: { type: 'linear', angle: 180, stops: ['#1e293b', '#334155'] },
    background: { type: 'linear', angle: 135, stops: ['#0f172a', '#1a1f3a'] }
  },
  typography: { fontFamily: 'system-ui', baseFontSize: 14, headingMultiplier: 1.3, lineHeight: 1.5 },
  layout: { sidebarWidth: 240, spacing: 16, borderRadius: 8, transitionSpeed: 'normal' }
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
