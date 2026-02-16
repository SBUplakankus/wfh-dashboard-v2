import { useMemo } from 'react';

const dayStart = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const useCalendar = (events = []) => {
  return useMemo(() => {
    const now = new Date();
    const today = dayStart(now);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);

    return events.reduce(
      (groups, event) => {
        const start = dayStart(new Date(event.start));
        if (start.getTime() === today.getTime()) groups.today.push(event);
        else if (start.getTime() === tomorrow.getTime()) groups.tomorrow.push(event);
        else if (start < weekEnd) groups.week.push(event);
        else groups.later.push(event);
        return groups;
      },
      { today: [], tomorrow: [], week: [], later: [] }
    );
  }, [events]);
};
