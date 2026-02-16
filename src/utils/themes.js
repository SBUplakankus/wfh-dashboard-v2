const baseTheme = {
  colors: {
    primary: '#4f7cff',
    secondary: '#6b93ff',
    tertiary: '#89a9ff',
    background: { primary: '#0c0d10', secondary: '#121419' },
    text: { primary: '#e6e8ec', secondary: '#9aa3b2' },
    border: '#262b36'
  },
  gradients: {
    header: { type: 'linear', angle: 180, stops: ['#121419', '#121419'] },
    section: { type: 'linear', angle: 180, stops: ['#121419', '#121419'] },
    background: { type: 'linear', angle: 180, stops: ['#0c0d10', '#0c0d10'] }
  },
  typography: { fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif', baseFontSize: 14, headingMultiplier: 1.2, lineHeight: 1.55 },
  layout: { sidebarWidth: 200, spacing: 24, borderRadius: 7, transitionSpeed: 'normal', tileStyle: 'solid' }
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
  makeTheme('linear-dark', 'Linear Dark'),
  makeTheme('vercel-night', 'Vercel Night', { colors: { primary: '#5f8dff', secondary: '#7ca2ff', tertiary: '#9db8ff', background: { primary: '#0a0a0a', secondary: '#111113' }, text: { primary: '#e7e7ea', secondary: '#9fa1a8' }, border: '#24252b' } }),
  makeTheme('figma-slate', 'Figma Slate', { colors: { primary: '#6d8cff', secondary: '#89a3ff', tertiary: '#a2b7ff', background: { primary: '#101215', secondary: '#171a20' }, text: { primary: '#eaedf3', secondary: '#a2aab7' }, border: '#2d3440' } }),
  makeTheme('obsidian-glass', 'Obsidian Glass', { layout: { ...baseTheme.layout, tileStyle: 'glass' }, colors: { primary: '#5b8cff', secondary: '#7aa3ff', tertiary: '#9bb9ff', border: '#394352' } })
];

export const DEFAULT_THEME = THEME_PRESETS[0];

export const gradientToCss = ({ type, angle, stops }) => `${type}-gradient(${angle}deg, ${stops.join(', ')})`;
