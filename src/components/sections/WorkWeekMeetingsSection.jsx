import React, { useMemo, useState } from 'react';
import { openMeetingUrl } from '../../utils/ipc';

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfMonday = (date) => {
  const value = new Date(date);
  const day = value.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  value.setHours(0, 0, 0, 0);
  value.setDate(value.getDate() + diff);
  return value;
};

const isSameLocalDay = (left, right) =>
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();

const formatWithZone = (date, options, timeZone) => {
  try {
    return new Intl.DateTimeFormat(undefined, { ...options, ...(timeZone ? { timeZone } : {}) }).format(date);
  } catch {
    return new Intl.DateTimeFormat(undefined, options).format(date);
  }
};

const formatTime = (date, timeZone) => formatWithZone(date, { hour: 'numeric', minute: '2-digit' }, timeZone);

const formatDayHeader = (date, timeZone) => formatWithZone(date, { weekday: 'short', month: 'short', day: 'numeric' }, timeZone);

const formatWeekRange = (startDate, timeZone) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 4);
  return `Week of ${formatWithZone(startDate, { month: 'short', day: 'numeric' }, timeZone)}-${formatWithZone(endDate, { month: 'short', day: 'numeric' }, timeZone)}, ${startDate.getFullYear()}`;
};

const durationLabel = (start, end) => {
  const minutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
};

const WorkWeekMeetingsSection = ({ events, timeZone }) => {
  const [weekStart, setWeekStart] = useState(() => startOfMonday(new Date()));
  const today = new Date();

  const weekdays = useMemo(
    () => Array.from({ length: 5 }, (_, index) => new Date(weekStart.getTime() + index * DAY_MS)),
    [weekStart]
  );

  const meetingsByDay = useMemo(() => {
    const map = weekdays.reduce((acc, day) => {
      acc[day.toDateString()] = [];
      return acc;
    }, {});

    events.forEach((event) => {
      const eventStart = new Date(event.start);
      weekdays.forEach((day) => {
        if (isSameLocalDay(eventStart, day)) {
          map[day.toDateString()].push(event);
        }
      });
    });

    Object.values(map).forEach((meetings) => {
      meetings.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    });

    return map;
  }, [events, weekdays]);

  return (
    <section className="card stack" aria-label="work-week-meetings">
      <div className="row between">
        <h3>Work Week Meetings</h3>
        <div className="row">
          <button className="btn" type="button" onClick={() => setWeekStart((prev) => new Date(prev.getTime() - 7 * DAY_MS))}>
            Previous Week
          </button>
          <button className="btn" type="button" onClick={() => setWeekStart((prev) => new Date(prev.getTime() + 7 * DAY_MS))}>
            Next Week
          </button>
        </div>
      </div>
      <p className="muted">{formatWeekRange(weekStart, timeZone)}</p>
      <div className="work-week-grid">
        {weekdays.map((day) => {
          const meetings = meetingsByDay[day.toDateString()] || [];
          const isToday = isSameLocalDay(day, today);
          return (
            <article key={day.toISOString()} className={`day-column ${isToday ? 'today' : ''}`}>
              <h4>{formatDayHeader(day, timeZone)}</h4>
              <div className="day-meetings">
                {meetings.length === 0 ? <p className="muted">Clear</p> : null}
                {meetings.map((meeting) => {
                  const start = new Date(meeting.start);
                  const end = new Date(meeting.end);
                  return (
                    <div className="week-meeting-card" key={`${meeting.id}-${start.toISOString()}`}>
                      <p>
                        {formatTime(start, timeZone)} - {formatTime(end, timeZone)}
                      </p>
                      <strong>{meeting.title}</strong>
                      <p className="muted">Duration: {durationLabel(start, end)}</p>
                      <p className="muted">{meeting.calendarName || 'Default Calendar'}</p>
                      {meeting.url ? (
                        <button className="btn" type="button" onClick={() => openMeetingUrl(meeting.url)}>
                          Join
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default WorkWeekMeetingsSection;
