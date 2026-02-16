import React from 'react';
import { render, screen } from '@testing-library/react';
import WorkWeekMeetingsSection from './WorkWeekMeetingsSection';

describe('WorkWeekMeetingsSection', () => {
  it('renders a Monday to Friday column range even when a timezone is provided', () => {
    render(<WorkWeekMeetingsSection events={[]} timeZone="America/New_York" />);

    const dayHeadings = screen.getAllByRole('heading', { level: 4 }).map((heading) => heading.textContent || '');
    expect(dayHeadings).toHaveLength(5);
    expect(dayHeadings[0]).toMatch(/^Mon/);
    expect(dayHeadings[4]).toMatch(/^Fri/);
    expect(dayHeadings.join(' ')).not.toMatch(/\bSun\b/);
    expect(dayHeadings.join(' ')).not.toMatch(/\bSat\b/);
  });
});
