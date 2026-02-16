import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useProjectContext } from '../context/ProjectContext';
import Header from './Header';
import Sidebar from './Sidebar';
import CalendarSection from './sections/CalendarSection';
import ToolsSection from './sections/ToolsSection';
import CustomLinksSection from './sections/CustomLinksSection';
import { readFile } from '../utils/ipc';
import { parseICS } from '../utils/calendarParser';

type DashboardProps = {
  onOpenSettings: () => void;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
  url?: string;
  calendarName?: any;
};

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Daily Standup',
    start: new Date(),
    end: new Date(Date.now() + 30 * 60 * 1000),
    allDay: false,
    url: 'https://meet.google.com',
    calendarName: 'Default Calendar'
  },
  {
    id: '2',
    title: 'Build Review',
    start: new Date(Date.now() + 86400000),
    end: new Date(Date.now() + 90000000),
    allDay: false,
    url: '',
    calendarName: 'Default Calendar'
  }
];

const Dashboard = ({ onOpenSettings }: DashboardProps) => {
  const { currentProject } = useProjectContext() as any;
  const features = currentProject?.features || {};
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const calendarSettings = currentProject?.calendarSettings || { hideAllDayEvents: false, hidePastMeetings: false, timeZone: '' };

  useEffect(() => {
    const calendarFile = currentProject?.paths?.calendarFile;
    if (!calendarFile) {
      setEvents(sampleEvents);
      return;
    }
    readFile(calendarFile)
      .then((content: string) => setEvents(parseICS(content) as CalendarEvent[]))
      .catch(() => setEvents(sampleEvents));
  }, [currentProject?.paths?.calendarFile]);

  const filteredEvents = useMemo(() => {
    const now = Date.now();
    return events.filter((event) => {
      if (calendarSettings.hideAllDayEvents && event.allDay) return false;
      if (calendarSettings.hidePastMeetings && new Date(event.end).getTime() < now) return false;
      return true;
    });
  }, [events, calendarSettings.hideAllDayEvents, calendarSettings.hidePastMeetings]);

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 p-6 lg:grid-cols-[256px_1fr]">
      <Sidebar onOpenSettings={onOpenSettings} />
      <motion.main
        className="md3-card space-y-6 overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <Header title={currentProject?.name || 'Dashboard'} onOpenSettings={onOpenSettings} />
        <div className="space-y-6 p-6">
          {features.calendar ? <CalendarSection events={filteredEvents} calendarSettings={calendarSettings} /> : null}
          {features.kanri || features.joplin || features.mkdocs || features.marktext ? <ToolsSection project={currentProject} /> : null}
          {features.customLinks ? <CustomLinksSection links={currentProject?.links} /> : null}
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;
