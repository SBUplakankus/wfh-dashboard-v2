import React from 'react';
import { useThemeContext } from '../../context/ThemeContext';

const ThemeCustomizer = () => {
  const { theme, setTheme, presets } = useThemeContext();

  return (
    <div className="stack">
      <h3>Theme Customizer</h3>
      <label>
        Primary Color
        <input
          type="color"
          value={theme.colors.primary}
          onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, primary: e.target.value } })}
        />
      </label>
      <label>
        Secondary Color
        <input
          type="color"
          value={theme.colors.secondary}
          onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, secondary: e.target.value } })}
        />
      </label>
      <label>
        Tile Style
        <select
          value={theme.layout?.tileStyle || 'solid'}
          onChange={(e) => setTheme({ ...theme, layout: { ...theme.layout, tileStyle: e.target.value } })}
        >
          <option value="solid">Solid</option>
          <option value="glass">Glass</option>
        </select>
      </label>
      <div className="chip-list">
        {presets.map((preset) => (
          <button key={preset.id} className="btn" type="button" onClick={() => setTheme(preset)}>
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeCustomizer;
