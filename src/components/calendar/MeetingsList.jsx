import React from 'react';

const Group = ({ title, meetings }) => (
  <div>
    <h4>{title}</h4>
    {meetings.length === 0 ? <p className="muted">No meetings</p> : null}
    {meetings.map((meeting) => (
      <article key={`${meeting.id}-${meeting.start}`} className="meeting-card">
        <div>
          <strong>{meeting.title}</strong>
          <p>{new Date(meeting.start).toLocaleString()}</p>
        </div>
        <button className="btn" type="button">
          Join
        </button>
      </article>
    ))}
  </div>
);

const MeetingsList = ({ groups }) => (
  <div className="card">
    <h3>Meetings</h3>
    <Group title="Today" meetings={groups.today} />
    <Group title="Tomorrow" meetings={groups.tomorrow} />
    <Group title="This Week" meetings={groups.week} />
    <Group title="Later" meetings={groups.later} />
  </div>
);

export default MeetingsList;
