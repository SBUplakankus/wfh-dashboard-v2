import ICAL from 'ical.js';

export const parseICS = (icsText = '') => {
  if (!icsText.trim()) return [];
  try {
    const jcalData = ICAL.parse(icsText);
    const comp = new ICAL.Component(jcalData);
    return comp.getAllSubcomponents('vevent').map((eventComp) => {
      const event = new ICAL.Event(eventComp);
      return {
        id: event.uid,
        title: event.summary || 'Untitled Event',
        start: event.startDate.toJSDate(),
        end: event.endDate.toJSDate(),
        allDay: event.startDate.isDate,
        location: event.location || ''
      };
    });
  } catch {
    return [];
  }
};
