import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ThemeCustomizer from './ThemeCustomizer';
import { useThemeContext } from '../../context/ThemeContext';

vi.mock('../../context/ThemeContext', () => ({
  useThemeContext: vi.fn()
}));

describe('ThemeCustomizer', () => {
  it('updates tile style to glass', () => {
    const setTheme = vi.fn();
    useThemeContext.mockReturnValue({
      theme: {
        colors: { primary: '#4f7cff', secondary: '#6b93ff' },
        layout: { tileStyle: 'solid' }
      },
      setTheme,
      presets: [{ id: 'linear-dark', name: 'Linear Dark' }]
    });

    render(<ThemeCustomizer />);
    fireEvent.change(screen.getByLabelText('Tile Style'), { target: { value: 'glass' } });

    expect(setTheme).toHaveBeenCalledWith(expect.objectContaining({
      layout: expect.objectContaining({ tileStyle: 'glass' })
    }));
  });
});
