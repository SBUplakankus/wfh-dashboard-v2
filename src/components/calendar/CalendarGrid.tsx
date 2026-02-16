import React from 'react';

type CalendarGridProps = {
  events: any[];
};

const CalendarGrid = ({ events }: CalendarGridProps) => (
  <section className="md3-card space-y-3 p-6">
    <h3 className="text-base font-semibold tracking-tight">Calendar Month View</h3>
    <p className="text-sm text-md3-on-surface-variant">{events.length} events loaded</p>
    <div className="flex flex-wrap gap-2">
      {events.slice(0, 8).map((event) => (
        <span key={`${event.id}-${event.start}`} className="rounded-full border border-md3-outline bg-md3-surface-variant px-3 py-1 text-xs text-md3-on-surface-variant">
          {new Date(event.start).toLocaleDateString()} · {event.title}
        </span>
      ))}
    </div>
  </section>
);

export default CalendarGrid;
