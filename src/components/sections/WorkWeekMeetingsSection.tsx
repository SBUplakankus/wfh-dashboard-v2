import React, { useMemo, useState } from 'react';
import { openMeetingUrl } from '../../utils/ipc';

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfMonday = (date: Date) => {
  const value = new Date(date);
  const day = value.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  value.setHours(0, 0, 0, 0);
  value.setDate(value.getDate() + diff);
  return value;
};

const isSameLocalDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();

const formatWithZone = (date: Date, options: Intl.DateTimeFormatOptions, timeZone?: string) => {
  try {
    return new Intl.DateTimeFormat(undefined, { ...options, ...(timeZone ? { timeZone } : {}) }).format(date);
  } catch {
    return new Intl.DateTimeFormat(undefined, options).format(date);
  }
};

const formatTime = (date: Date, timeZone?: string) => formatWithZone(date, { hour: 'numeric', minute: '2-digit' }, timeZone);
const formatDayHeader = (date: Date) => formatWithZone(date, { weekday: 'short', month: 'short', day: 'numeric' });

const formatWeekRange = (startDate: Date) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 4);
  return `Week of ${formatWithZone(startDate, { month: 'short', day: 'numeric' })}-${formatWithZone(endDate, { month: 'short', day: 'numeric' })}, ${startDate.getFullYear()}`;
};

const durationLabel = (start: Date, end: Date) => {
  const minutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
};

type WorkWeekMeetingsSectionProps = {
  events: any[];
  timeZone?: string;
};

const WorkWeekMeetingsSection = ({ events, timeZone }: WorkWeekMeetingsSectionProps) => {
  const [weekStart, setWeekStart] = useState<Date>(() => startOfMonday(new Date()));
  const today = new Date();

  const weekdays = useMemo(() => Array.from({ length: 5 }, (_, index) => new Date(weekStart.getTime() + index * DAY_MS)), [weekStart]);

  const meetingsByDay = useMemo(() => {
    const map: Record<string, any[]> = weekdays.reduce((acc, day) => {
      acc[day.toDateString()] = [];
      return acc;
    }, {} as Record<string, any[]>);

    events.forEach((event) => {
      const eventStart = new Date(event.start);
      weekdays.forEach((day) => {
        if (isSameLocalDay(eventStart, day)) map[day.toDateString()].push(event);
      });
    });

    Object.values(map).forEach((meetings) => meetings.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()));
    return map;
  }, [events, weekdays]);

  return (
    <section className="md3-card space-y-4 p-6" aria-label="work-week-meetings">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight">Work Week Meetings</h3>
        <div className="flex flex-wrap gap-2">
          <button className="md3-button" type="button" onClick={() => setWeekStart((prev) => new Date(prev.getTime() - 7 * DAY_MS))}>
            Previous Week
          </button>
          <button className="md3-button" type="button" onClick={() => setWeekStart((prev) => new Date(prev.getTime() + 7 * DAY_MS))}>
            Next Week
          </button>
        </div>
      </div>
      <p className="text-sm text-md3-on-surface-variant">{formatWeekRange(weekStart)}</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        {weekdays.map((day) => {
          const meetings = meetingsByDay[day.toDateString()] || [];
          const isToday = isSameLocalDay(day, today);
          return (
            <article
              key={day.toISOString()}
              className={`rounded-[10px] border p-3 ${
                isToday ? 'border-md3-primary bg-[#1d2840]' : 'border-md3-outline bg-md3-surface-variant'
              }`}
            >
              <h4 className="md3-label text-[11px]">{formatDayHeader(day)}</h4>
              <div className="mt-3 space-y-3">
                {meetings.length === 0 ? <p className="text-sm text-md3-on-surface-variant">Clear</p> : null}
                {meetings.map((meeting) => {
                  const start = new Date(meeting.start);
                  const end = new Date(meeting.end);
                  return (
                    <div key={`${meeting.id}-${start.toISOString()}`} className="rounded-[10px] border border-md3-outline border-l-2 border-l-md3-primary bg-[#141c2b] p-3">
                      <p className="text-xs text-md3-on-surface-variant">
                        {formatTime(start, timeZone)} - {formatTime(end, timeZone)}
                      </p>
                      <strong className="mt-1 block text-sm font-semibold text-md3-on-surface">{meeting.title}</strong>
                      <p className="mt-1 text-xs text-md3-on-surface-variant">Duration: {durationLabel(start, end)}</p>
                      <p className="text-xs text-md3-on-surface-variant">{meeting.calendarName || 'Default Calendar'}</p>
                      {meeting.url ? (
                        <button className="md3-button mt-2" type="button" onClick={() => openMeetingUrl(meeting.url)}>
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
