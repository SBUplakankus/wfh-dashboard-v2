import React from 'react';

const CalendarGrid = ({ events }) => (
  <div className="card">
    <h3>Calendar Month View</h3>
    <p>{events.length} events loaded</p>
    <div className="chip-list">
      {events.slice(0, 8).map((event) => (
        <span key={`${event.id}-${event.start}`} className="chip">
          {new Date(event.start).toLocaleDateString()} · {event.title}
        </span>
      ))}
    </div>
  </div>
);

export default CalendarGrid;
