import React from 'react';
import { useProjectContext } from '../../context/ProjectContext';

const CalendarSettings = () => {
  const { currentProject, updateProject } = useProjectContext();
  const calendarFile = currentProject?.paths?.calendarFile || '';

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
      <p className="muted">Set the local ICS file path used by the calendar parser.</p>
    </div>
  );
};

export default CalendarSettings;
