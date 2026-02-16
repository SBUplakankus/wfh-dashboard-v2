import React from 'react';
import { openMeetingUrl } from '../../utils/ipc';

const Group = ({ title, meetings }) => (
  <div className="meeting-group">
    <h4>{title}</h4>
    {meetings.length === 0 ? <p className="muted">No meetings</p> : null}
    {meetings.map((meeting) => (
      <article key={`${meeting.id}-${meeting.start}`} className="meeting-card">
        <div>
          <strong>{meeting.title}</strong>
          <p className="muted">{new Date(meeting.start).toLocaleString()}</p>
        </div>
        {meeting.url ? (
          <button className="btn" type="button" onClick={() => openMeetingUrl(meeting.url)}>
            Join
          </button>
        ) : null}
      </article>
    ))}
  </div>
);

const MeetingsList = ({ groups }) => (
  <div className="card stack">
    <h3>Meetings</h3>
    <Group title="Today" meetings={groups.today} />
    <Group title="Tomorrow" meetings={groups.tomorrow} />
    <Group title="This Week" meetings={groups.week} />
    <Group title="Later" meetings={groups.later} />
  </div>
);

export default MeetingsList;
