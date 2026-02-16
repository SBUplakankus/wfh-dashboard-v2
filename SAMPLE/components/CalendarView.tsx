
import React, { useState } from 'react';
import { ThemeConfig, Meeting } from '../types';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { mockMeetings } from '../mockData';

interface CalendarViewProps {
  theme: ThemeConfig;
}

const CalendarView: React.FC<CalendarViewProps> = ({ theme }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 4)); // May 2024
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const numDays = getDaysInMonth(year, currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(year, currentMonth.getMonth());

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= numDays; i++) calendarDays.push(i);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const getMeetingsForDay = (day: number | null) => {
    if (!day) return [];
    // Just a mock check for demonstration
    // In a real app we would compare date strings
    return mockMeetings.filter(m => m.date.getDate() === day && m.date.getMonth() === currentMonth.getMonth());
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return today.getDate() === day && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === year;
  };

  const navMonth = (offset: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold tracking-tight">{monthName} {year}</h2>
          <p className="text-[12px] text-neutral-500">You have {mockMeetings.length} events scheduled this month.</p>
        </div>
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/5">
          <button onClick={() => navMonth(-1)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1 text-[11px] font-bold uppercase hover:bg-white/10 rounded-md transition-colors tracking-widest">Today</button>
          <button onClick={() => navMonth(1)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div 
        className="rounded-xl border overflow-hidden shadow-2xl transition-all duration-300" 
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card-bg)' }}
      >
        <div className="grid grid-cols-7 border-b border-white/5 bg-black/20">
          {days.map(d => (
            <div key={d} className="py-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dayMeetings = getMeetingsForDay(day);
            const active = isToday(day);

            return (
              <div 
                key={idx} 
                className={`h-32 border-r border-b border-white/[0.03] p-2 last:border-r-0 relative group transition-colors hover:bg-white/[0.02] cursor-pointer`}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[12px] font-medium w-6 h-6 flex items-center justify-center rounded-md transition-all ${active ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'text-neutral-500 group-hover:text-white'}`}>
                        {day}
                      </span>
                      {dayMeetings.length > 0 && (
                        <span className="text-[10px] text-neutral-600 font-bold">{dayMeetings.length} ev</span>
                      )}
                    </div>
                    
                    <div className="space-y-1 overflow-hidden h-[70px]">
                      {dayMeetings.slice(0, 2).map(m => (
                        <div key={m.id} className="px-1.5 py-1 bg-white/[0.03] border border-white/5 rounded text-[10px] truncate transition-colors hover:border-white/20">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${m.calendarType === 'work' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                          {m.title}
                        </div>
                      ))}
                      {dayMeetings.length > 2 && (
                        <div className="text-[9px] text-neutral-600 flex items-center gap-1 pl-1">
                          <MoreHorizontal className="w-3 h-3" />
                          <span>{dayMeetings.length - 2} more</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-[11px] text-neutral-500 uppercase tracking-widest font-bold">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Work</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /> Personal</div>
      </div>
    </div>
  );
};

export default CalendarView;
