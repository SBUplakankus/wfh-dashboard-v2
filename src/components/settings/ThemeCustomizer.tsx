import React from 'react';
import { useThemeContext } from '../../context/ThemeContext';

const ThemeCustomizer = () => {
  const { theme, setTheme, presets } = useThemeContext() as any;

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold tracking-tight">Theme Customizer</h3>
      <label className="block space-y-2">
        <span className="md3-label">Primary Color</span>
        <input
          className="md3-input h-10"
          type="color"
          value={theme.colors.primary}
          onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, primary: e.target.value } })}
        />
      </label>
      <label className="block space-y-2">
        <span className="md3-label">Secondary Color</span>
        <input
          className="md3-input h-10"
          type="color"
          value={theme.colors.secondary}
          onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, secondary: e.target.value } })}
        />
      </label>
      <label className="block space-y-2">
        <span className="md3-label">Tile Style</span>
        <select
          className="md3-input"
          value={theme.layout?.tileStyle || 'solid'}
          onChange={(e) => setTheme({ ...theme, layout: { ...theme.layout, tileStyle: e.target.value } })}
        >
          <option value="solid">Solid</option>
          <option value="glass">Glass</option>
        </select>
      </label>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset: any) => (
          <button key={preset.id} className="md3-button" type="button" onClick={() => setTheme(preset)}>
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeCustomizer;
