import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SettingsPanel from './SettingsPanel';

vi.mock('./settings/ProjectManager', () => ({ default: () => <div>Projects Tab</div> }));
vi.mock('./settings/ThemeCustomizer', () => ({ default: () => <div>Theme Tab</div> }));
vi.mock('./settings/CalendarSettings', () => ({ default: () => <div>Calendar Tab</div> }));

describe('SettingsPanel', () => {
  it('closes when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<SettingsPanel open onClose={onClose} />);

    expect(screen.getByText('Projects Tab')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
