import React from 'react';
import { useProjectContext } from '../../context/ProjectContext';

const CalendarSettings = () => {
  const { currentProject, updateProject } = useProjectContext() as any;
  const calendarFile = currentProject?.paths?.calendarFile || '';
  const calendarSettings = currentProject?.calendarSettings || { hideAllDayEvents: false, hidePastMeetings: false, timeZone: '' };

  const updateCalendarSettings = (update: any) => updateProject(currentProject.id, { calendarSettings: { ...calendarSettings, ...update } });

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold tracking-tight">Calendar Settings</h3>
      <label className="block space-y-2">
        <span className="md3-label">ICS File Path</span>
        <input
          className="md3-input"
          value={calendarFile}
          onChange={(e) => updateProject(currentProject.id, { paths: { ...currentProject.paths, calendarFile: e.target.value } })}
          placeholder="/path/to/calendar.ics"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-md3-on-surface">
        <input
          type="checkbox"
          checked={calendarSettings.hideAllDayEvents}
          onChange={(e) => updateCalendarSettings({ hideAllDayEvents: e.target.checked })}
        />
        Hide all-day events
      </label>
      <label className="flex items-center gap-2 text-sm text-md3-on-surface">
        <input
          type="checkbox"
          checked={calendarSettings.hidePastMeetings}
          onChange={(e) => updateCalendarSettings({ hidePastMeetings: e.target.checked })}
        />
        Hide past meetings
      </label>
      <label className="block space-y-2">
        <span className="md3-label">Time Zone (IANA)</span>
        <input
          className="md3-input"
          value={calendarSettings.timeZone}
          onChange={(e) => updateCalendarSettings({ timeZone: e.target.value })}
          placeholder="e.g. America/New_York"
        />
      </label>
      <p className="text-sm text-md3-on-surface-variant">Set the local ICS file path used by the calendar parser.</p>
    </div>
  );
};

export default CalendarSettings;
