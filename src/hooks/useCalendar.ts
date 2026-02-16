import { useState, useEffect, useCallback } from 'react';
import { Meeting } from '../types';
import ICAL from 'ical.js';

interface CalendarConfig {
  workCalendarPath?: string;
  personalCalendarPath?: string;
}

export const useCalendar = (config: CalendarConfig) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseICSFile = async (filePath: string, calendarType: 'work' | 'personal'): Promise<Meeting[]> => {
    try {
      if (!window.dashboardAPI) {
        return [];
      }

      const result = await window.dashboardAPI.readFile(filePath);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to read calendar file');
      }

      const jcalData = ICAL.parse(result.data);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');

      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const parsedMeetings: Meeting[] = vevents
        .map((vevent: any) => {
          const event = new ICAL.Event(vevent);
          const startDate = event.startDate.toJSDate();
          
          // Only include events within the next week
          if (startDate < now || startDate > nextWeek) {
            return null;
          }

          const endDate = event.endDate.toJSDate();
          const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

          return {
            id: event.uid || `cal-${Date.now()}-${Math.random()}`,
            title: event.summary || 'Untitled Event',
            time: startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            duration: `${duration}m`,
            day: days[startDate.getDay()] as any,
            date: startDate,
            joinUrl: event.description?.match(/https?:\/\/[^\s]+/)?.[0],
            calendarType,
          } as Meeting;
        })
        .filter((m): m is Meeting => m !== null);

      return parsedMeetings;
    } catch (err) {
      console.error(`Error parsing ${calendarType} calendar:`, err);
      return [];
    }
  };

  const loadCalendars = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const allMeetings: Meeting[] = [];

      if (config.workCalendarPath) {
        const workMeetings = await parseICSFile(config.workCalendarPath, 'work');
        allMeetings.push(...workMeetings);
      }

      if (config.personalCalendarPath) {
        const personalMeetings = await parseICSFile(config.personalCalendarPath, 'personal');
        allMeetings.push(...personalMeetings);
      }

      // Sort by date
      allMeetings.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      setMeetings(allMeetings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calendars');
    } finally {
      setIsLoading(false);
    }
  }, [config.workCalendarPath, config.personalCalendarPath]);

  useEffect(() => {
    if (config.workCalendarPath || config.personalCalendarPath) {
      loadCalendars();
    }
  }, [config.workCalendarPath, config.personalCalendarPath, loadCalendars]);

  return {
    meetings,
    isLoading,
    error,
    refresh: loadCalendars,
  };
};
