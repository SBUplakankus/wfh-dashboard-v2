import { useEffect } from 'react';
import { gradientToCss } from '../utils/themes';

const setVar = (key, value) => document.documentElement.style.setProperty(key, value);

export const useTheme = (theme) => {
  useEffect(() => {
    if (!theme) return;
    setVar('--color-primary', theme.colors.primary);
    setVar('--color-secondary', theme.colors.secondary);
    setVar('--color-tertiary', theme.colors.tertiary);
    setVar('--bg-primary', theme.colors.background.primary);
    setVar('--bg-secondary', theme.colors.background.secondary);
    setVar('--text-primary', theme.colors.text.primary);
    setVar('--text-secondary', theme.colors.text.secondary);
    setVar('--border-color', theme.colors.border);
    setVar('--header-gradient', gradientToCss(theme.gradients.header));
    setVar('--section-gradient', gradientToCss(theme.gradients.section));
    setVar('--background-gradient', gradientToCss(theme.gradients.background));
    setVar('--sidebar-width', `${theme.layout.sidebarWidth}px`);
    setVar('--spacing', `${theme.layout.spacing}px`);
    setVar('--radius', `${theme.layout.borderRadius}px`);
    setVar('--base-font-size', `${theme.typography.baseFontSize}px`);
    setVar('--line-height', theme.typography.lineHeight);
    setVar('--font-family', theme.typography.fontFamily);
  }, [theme]);
};
