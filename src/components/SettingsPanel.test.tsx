import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SettingsPanel from './SettingsPanel';

jest.mock('./settings/ProjectManager', () => () => <div>Projects Tab</div>);
jest.mock('./settings/ThemeCustomizer', () => () => <div>Theme Tab</div>);
jest.mock('./settings/CalendarSettings', () => () => <div>Calendar Tab</div>);

describe('SettingsPanel', () => {
  it('closes when Escape is pressed', () => {
    const onClose = jest.fn();
    render(<SettingsPanel open onClose={onClose} />);

    expect(screen.getByText('Projects Tab')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
