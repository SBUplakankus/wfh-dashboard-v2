
import React, { useState, useEffect, useMemo } from 'react';
import { Meeting, ThemeConfig } from '../types';
import { 
  Video, 
  Clock, 
  MoreVertical, 
  ExternalLink, 
  Trash2, 
  CalendarPlus,
  Maximize2,
  Minimize2,
  Layout
} from 'lucide-react';

interface WorkWeekViewProps {
  meetings: Meeting[];
  theme: ThemeConfig;
}

type Density = 'compact' | 'comfortable' | 'spacious';

const WorkWeekView: React.FC<WorkWeekViewProps> = ({ meetings, theme }) => {
  const [density, setDensity] = useState<Density>('comfortable');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredMeeting, setHoveredMeeting] = useState<string | null>(null);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hourHeight = useMemo(() => {
    switch (density) {
      case 'compact': return 48;
      case 'comfortable': return 72;
      case 'spacious': return 110;
    }
  }, [density]);

  const getTimePosition = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    const decimalHours = hours + minutes / 60;
    const startHour = 8;
    return (decimalHours - startHour) * hourHeight;
  };

  const getDurationHeight = (durationStr: string) => {
    const minutes = parseInt(durationStr);
    return (minutes / 60) * hourHeight;
  };

  const getMeetingStatus = (meeting: Meeting) => {
    const [time, modifier] = meeting.time.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (modifier === 'PM' && h < 12) h += 12;
    
    const meetingDate = new Date(currentTime);
    meetingDate.setHours(h, m, 0, 0);
    
    const durationMins = parseInt(meeting.duration);
    const endDate = new Date(meetingDate.getTime() + durationMins * 60000);

    if (currentTime > endDate) return 'past';
    if (currentTime >= meetingDate && currentTime <= endDate) return 'active';
    return 'future';
  };

  const timeIndicatorPos = useMemo(() => {
    const h = currentTime.getHours();
    const m = currentTime.getMinutes();
    const decimalHours = h + m / 60;
    const startHour = 8;
    if (decimalHours < 8 || decimalHours > 19) return null;
    return (decimalHours - startHour) * hourHeight;
  }, [currentTime, hourHeight]);

  const currentDayName = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', { weekday: 'short' });
  }, [currentTime]);

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between mb-6 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-2xl">
        <div className="flex items-center gap-2">
          <CalendarPlus className="w-4 h-4 text-neutral-500" />
          <span className="text-[13px] font-medium">May 13 - 17, 2024</span>
        </div>
        
        <div className="flex items-center gap-1 p-1 bg-black/20 rounded-xl border border-white/5">
          {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${density === d ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              {d === 'compact' && <Minimize2 className="w-3 h-3" />}
              {d === 'comfortable' && <Layout className="w-3 h-3" />}
              {d === 'spacious' && <Maximize2 className="w-3 h-3" />}
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden border border-white/5 rounded-2xl bg-black/10">
        <div className="w-16 border-r border-white/5 flex flex-col mt-[53px]">
          {hours.map(hour => (
            <div 
              key={hour} 
              className="text-[10px] font-mono text-neutral-600 text-right pr-3"
              style={{ height: hourHeight }}
            >
              {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto relative scrollbar-hide">
          <div className="flex min-w-[800px] h-full relative">
            {weekDays.map(day => {
              const isToday = day === currentDayName;
              const dayMeetings = meetings.filter(m => m.day === day);

              return (
                <div 
                  key={day} 
                  className={`flex-1 border-r border-white/5 relative group transition-colors ${isToday ? 'bg-white/[0.02]' : ''}`}
                >
                  <div className={`h-[53px] flex flex-col items-center justify-center border-b border-white/5 sticky top-0 z-10 bg-inherit transition-all ${isToday ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500' : ''}`}>
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${isToday ? 'text-blue-500' : 'text-neutral-500'}`}>{day}</span>
                  </div>

                  <div className="relative">
                    {hours.map(h => (
                      <div key={h} className="border-b border-white/[0.03] w-full" style={{ height: hourHeight }} />
                    ))}

                    {dayMeetings.map(meeting => {
                      const top = getTimePosition(meeting.time);
                      const height = getDurationHeight(meeting.duration);
                      const status = getMeetingStatus(meeting);
                      const isHovered = hoveredMeeting === meeting.id;

                      return (
                        <div
                          key={meeting.id}
                          onMouseEnter={() => setHoveredMeeting(meeting.id)}
                          onMouseLeave={() => setHoveredMeeting(null)}
                          className={`absolute left-1 right-1 px-3 py-2 border rounded-xl shadow-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${
                            status === 'past' ? 'opacity-40 grayscale-[0.5]' : 
                            status === 'active' ? 'ring-2 ring-white/10' : ''
                          }`}
                          style={{ 
                            top: top + 4, 
                            height: Math.max(height - 8, density === 'compact' ? 40 : 50),
                            backgroundColor: status === 'active' ? 'var(--accent)' : 'var(--card-bg)',
                            borderColor: status === 'active' ? 'transparent' : 'var(--border)',
                            borderLeft: `3px solid ${status === 'active' ? '#fff' : 'var(--accent)'}`,
                            zIndex: isHovered ? 40 : 20
                          }}
                        >
                          <div className="flex flex-col h-full relative overflow-hidden">
                            <span className={`text-[10px] font-bold uppercase ${status === 'active' ? 'text-white/80' : ''}`}>
                              {meeting.time}
                            </span>
                            <h4 className={`text-[12px] font-bold mt-0.5 leading-tight truncate ${status === 'active' ? 'text-white' : 'text-neutral-200'}`}>
                              {meeting.title}
                            </h4>
                          </div>
                          {isHovered && meeting.joinUrl && (
                            <div className="absolute bottom-2 right-2 flex gap-1 animate-in fade-in slide-in-from-right-2">
                               <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors"><Video className="w-3 h-3" /></button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {isToday && timeIndicatorPos !== null && (
                      <div className="absolute left-0 right-0 h-px z-30 flex items-center pointer-events-none" style={{ top: timeIndicatorPos }}>
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 absolute -left-1.25" />
                        <div className="flex-1 h-px bg-red-500/50" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkWeekView;
