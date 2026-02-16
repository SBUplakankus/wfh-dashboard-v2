import React from 'react';
import { openMeetingUrl } from '../../utils/ipc';

type GroupProps = {
  title: string;
  meetings: any[];
};

const Group = ({ title, meetings }: GroupProps) => (
  <div className="space-y-3">
    <h4 className="md3-label">{title}</h4>
    {meetings.length === 0 ? <p className="text-sm text-md3-on-surface-variant">No meetings</p> : null}
    {meetings.map((meeting) => (
      <article key={`${meeting.id}-${meeting.start}`} className="md3-card flex items-center justify-between gap-3 p-3">
        <div className="space-y-1">
          <strong className="text-sm font-semibold text-md3-on-surface">{meeting.title}</strong>
          <p className="text-xs text-md3-on-surface-variant">{new Date(meeting.start).toLocaleString()}</p>
        </div>
        {meeting.url ? (
          <button className="md3-button" type="button" onClick={() => openMeetingUrl(meeting.url)}>
            Join
          </button>
        ) : null}
      </article>
    ))}
  </div>
);

const MeetingsList = ({ groups }: { groups: any }) => (
  <section className="md3-card space-y-5 p-6">
    <h3 className="text-base font-semibold tracking-tight">Meetings</h3>
    <Group title="Today" meetings={groups.today} />
    <Group title="Tomorrow" meetings={groups.tomorrow} />
    <Group title="This Week" meetings={groups.week} />
    <Group title="Later" meetings={groups.later} />
  </section>
);

export default MeetingsList;
