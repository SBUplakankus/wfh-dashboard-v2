import React from 'react';
import { useThemeContext } from '../../context/ThemeContext';

const ThemeCustomizer = () => {
  const { theme, setTheme, presets } = useThemeContext() as any;
  const colors = theme?.colors || {};
  const background = colors.background || {};
  const text = colors.text || {};
  const layout = theme?.layout || {};
  const typography = theme?.typography || {};
  const gradients = theme?.gradients || {};
  const backgroundGradient = gradients.background || { type: 'linear', angle: 180, stops: [background.primary || '#0A0E27', background.secondary || '#1a202c'] };

  const updateTheme = (next: any) =>
    setTheme({
      ...theme,
      ...next,
      colors: { ...colors, ...(next.colors || {}), background: { ...background, ...(next.colors?.background || {}) }, text: { ...text, ...(next.colors?.text || {}) } },
      layout: { ...layout, ...(next.layout || {}) },
      typography: { ...typography, ...(next.typography || {}) },
      gradients: { ...gradients, ...(next.gradients || {}), background: { ...backgroundGradient, ...(next.gradients?.background || {}) } }
    });

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold tracking-tight">Theme Customizer</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="md3-label">Primary Color</span>
          <input className="md3-input h-10" type="color" value={colors.primary || '#3b82f6'} onChange={(e) => updateTheme({ colors: { primary: e.target.value } })} />
        </label>
        <label className="block space-y-2">
          <span className="md3-label">Secondary Color</span>
          <input className="md3-input h-10" type="color" value={colors.secondary || '#94a3b8'} onChange={(e) => updateTheme({ colors: { secondary: e.target.value } })} />
        </label>
        <label className="block space-y-2">
          <span className="md3-label">Background Primary</span>
          <input className="md3-input h-10" type="color" value={background.primary || '#0a0e27'} onChange={(e) => updateTheme({ colors: { background: { primary: e.target.value } } })} />
        </label>
        <label className="block space-y-2">
          <span className="md3-label">Background Secondary</span>
          <input className="md3-input h-10" type="color" value={background.secondary || '#1a202c'} onChange={(e) => updateTheme({ colors: { background: { secondary: e.target.value } } })} />
        </label>
        <label className="block space-y-2">
          <span className="md3-label">Text Primary</span>
          <input className="md3-input h-10" type="color" value={text.primary || '#f1f5f9'} onChange={(e) => updateTheme({ colors: { text: { primary: e.target.value } } })} />
        </label>
        <label className="block space-y-2">
          <span className="md3-label">Text Secondary</span>
          <input className="md3-input h-10" type="color" value={text.secondary || '#94a3b8'} onChange={(e) => updateTheme({ colors: { text: { secondary: e.target.value } } })} />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="md3-label">Tile Style</span>
          <select className="md3-input" value={layout.tileStyle || 'solid'} onChange={(e) => updateTheme({ layout: { tileStyle: e.target.value } })}>
            <option value="solid">Solid</option>
            <option value="glass">Glass</option>
          </select>
        </label>
        <label className="block space-y-2">
          <span className="md3-label">Background Gradient Type</span>
          <select className="md3-input" value={backgroundGradient.type || 'linear'} onChange={(e) => updateTheme({ gradients: { background: { type: e.target.value } } })}>
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
            <option value="conic">Conic</option>
          </select>
        </label>
        <label className="block space-y-2">
          <span className="md3-label">Spacing: {layout.spacing || 24}px</span>
          <input className="md3-input" type="range" min={12} max={40} value={layout.spacing || 24} onChange={(e) => updateTheme({ layout: { spacing: Number(e.target.value) } })} />
        </label>
        <label className="block space-y-2">
          <span className="md3-label">Radius: {layout.borderRadius || 8}px</span>
          <input className="md3-input" type="range" min={4} max={20} value={layout.borderRadius || 8} onChange={(e) => updateTheme({ layout: { borderRadius: Number(e.target.value) } })} />
        </label>
        <label className="block space-y-2">
          <span className="md3-label">Font Size: {typography.baseFontSize || 14}px</span>
          <input className="md3-input" type="range" min={12} max={18} value={typography.baseFontSize || 14} onChange={(e) => updateTheme({ typography: { baseFontSize: Number(e.target.value) } })} />
        </label>
        <label className="block space-y-2">
          <span className="md3-label">Line Height: {(typography.lineHeight || 1.55).toFixed(2)}</span>
          <input className="md3-input" type="range" min={1.3} max={1.8} step={0.05} value={typography.lineHeight || 1.55} onChange={(e) => updateTheme({ typography: { lineHeight: Number(e.target.value) } })} />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset: any) => (
          <button key={preset.id} className="md3-button" type="button" onClick={() => setTheme(preset)}>
            {preset.name}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-md3-outline bg-md3-surface-variant p-3 text-xs text-md3-on-surface-variant">
        SAMPLE presentation guide: keep accent usage restrained, prefer subtle borders over shadows, and use a consistent spacing rhythm.
      </div>
    </div>
  );
};

export default ThemeCustomizer;
