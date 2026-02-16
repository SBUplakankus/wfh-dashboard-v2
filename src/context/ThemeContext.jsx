import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEFAULT_THEME, THEME_PRESETS } from '../utils/themes';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [savedThemes, setSavedThemes] = useState([]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      presets: THEME_PRESETS,
      savedThemes,
      saveThemePreset: (customTheme) => setSavedThemes((prev) => [...prev, customTheme])
    }),
    [theme, savedThemes]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => useContext(ThemeContext);
