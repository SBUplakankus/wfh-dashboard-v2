import React from 'react';
import CalendarGrid from '../calendar/CalendarGrid';
import MeetingsSection from './MeetingsSection';
import { useCalendar } from '../../hooks/useCalendar';

const CalendarSection = ({ events }) => {
  const groups = useCalendar(events);
  return (
    <section className="stack">
      <CalendarGrid events={events} />
      <MeetingsSection groups={groups} />
    </section>
  );
};

export default CalendarSection;
