import React from 'react';
import CalendarGrid from '../calendar/CalendarGrid';
import MeetingsSection from './MeetingsSection';
import { useCalendar } from '../../hooks/useCalendar';
import WorkWeekMeetingsSection from './WorkWeekMeetingsSection';

const CalendarSection = ({ events, calendarSettings }) => {
  const groups = useCalendar(events);
  return (
    <section className="stack">
      <CalendarGrid events={events} />
      <WorkWeekMeetingsSection events={events} timeZone={calendarSettings?.timeZone} />
      <MeetingsSection groups={groups} />
    </section>
  );
};

export default CalendarSection;
