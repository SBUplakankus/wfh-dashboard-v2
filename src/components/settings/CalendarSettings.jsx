import React from 'react';
import { useProjectContext } from '../../context/ProjectContext';

const CalendarSettings = () => {
  const { currentProject, updateProject } = useProjectContext();
  const calendarFile = currentProject?.paths?.calendarFile || '';
  const calendarSettings = currentProject?.calendarSettings || { hideAllDayEvents: false, hidePastMeetings: false, timeZone: '' };

  const updateCalendarSettings = (update) =>
    updateProject(currentProject.id, { calendarSettings: { ...calendarSettings, ...update } });

  return (
    <div className="stack">
      <h3>Calendar Settings</h3>
      <label>
        ICS File Path
        <input
          value={calendarFile}
          onChange={(e) => updateProject(currentProject.id, { paths: { ...currentProject.paths, calendarFile: e.target.value } })}
          placeholder="/path/to/calendar.ics"
        />
      </label>
      <label className="row">
        <input
          type="checkbox"
          checked={calendarSettings.hideAllDayEvents}
          onChange={(e) => updateCalendarSettings({ hideAllDayEvents: e.target.checked })}
        />
        Hide all-day events
      </label>
      <label className="row">
        <input
          type="checkbox"
          checked={calendarSettings.hidePastMeetings}
          onChange={(e) => updateCalendarSettings({ hidePastMeetings: e.target.checked })}
        />
        Hide past meetings
      </label>
      <label>
        Time Zone (IANA)
        <input
          value={calendarSettings.timeZone}
          onChange={(e) => updateCalendarSettings({ timeZone: e.target.value })}
          placeholder="e.g. America/New_York"
        />
      </label>
      <p className="muted">Set the local ICS file path used by the calendar parser.</p>
    </div>
  );
};

export default CalendarSettings;
