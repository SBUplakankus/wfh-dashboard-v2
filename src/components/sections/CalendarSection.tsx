import React from 'react';
import { motion } from 'framer-motion';
import CalendarGrid from '../calendar/CalendarGrid';
import MeetingsSection from './MeetingsSection';
import { useCalendar } from '../../hooks/useCalendar';
import WorkWeekMeetingsSection from './WorkWeekMeetingsSection';

type CalendarSectionProps = {
  events: any[];
  calendarSettings: { timeZone?: string };
};

const CalendarSection = ({ events, calendarSettings }: CalendarSectionProps) => {
  const groups = useCalendar(events);
  return (
    <section className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
        <CalendarGrid events={events} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <WorkWeekMeetingsSection events={events} timeZone={calendarSettings?.timeZone} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
        <MeetingsSection groups={groups} />
      </motion.div>
    </section>
  );
};

export default CalendarSection;
