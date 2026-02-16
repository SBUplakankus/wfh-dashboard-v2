
import { Project, Meeting } from './types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Cyber Horizon',
    description: 'Main production workspace for the upcoming RPG.',
    category: 'Work',
    status: 'Active',
    icon: 'Gamepad2',
    links: [
      { id: 'l1', label: 'Trello Board', url: '#' },
      { id: 'l2', label: 'Design Doc', url: '#' }
    ],
    integrations: {
      hasCalendar: true,  // Work project has meetings
      hasKanban: true,    // Uses Kanri for task management
      hasNotes: true,     // Uses Joplin for notes
      hasDocs: true       // Uses MkDocs for documentation
    }
  },
  {
    id: '2',
    name: 'Personal Site',
    description: 'Next.js portfolio and blog.',
    category: 'Personal',
    status: 'Paused',
    icon: 'User',
    integrations: {
      hasCalendar: false, // No meetings for personal project
      hasKanban: false,   // No kanban needed
      hasNotes: true,     // Uses Joplin for blog ideas
      hasDocs: true       // Documentation for the site
    }
  },
  {
    id: '3',
    name: 'Void Engine',
    description: 'Internal rendering experiments in Rust.',
    category: 'Side',
    status: 'Backlog',
    icon: 'Cpu',
    integrations: {
      hasCalendar: false, // No meetings
      hasKanban: true,    // Task tracking
      hasNotes: true,     // Research notes
      hasDocs: true       // Technical docs
    }
  }
];

const today = new Date();
const getDayOffset = (offset: number) => {
  const d = new Date();
  d.setDate(today.getDate() + offset);
  return d;
};

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const currentDay = days[today.getDay()] as any;

export const mockMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Daily Standup',
    time: '09:30 AM',
    duration: '30m',
    day: currentDay || 'Mon',
    date: getDayOffset(0),
    joinUrl: 'https://meet.google.com/abc-defg-hij',
    calendarType: 'work'
  },
  {
    id: 'm2',
    title: 'Environment Review',
    time: '11:00 AM',
    duration: '60m',
    day: currentDay || 'Mon',
    date: getDayOffset(0),
    joinUrl: 'https://zoom.us/j/123456789',
    calendarType: 'work'
  },
  {
    id: 'm-now',
    title: 'Current Active Sync',
    time: `${today.getHours()}:00 ${today.getHours() >= 12 ? 'PM' : 'AM'}`,
    duration: '60m',
    day: currentDay || 'Mon',
    date: getDayOffset(0),
    joinUrl: 'https://meet.google.com/now-now-now',
    calendarType: 'work'
  },
  {
    id: 'm3',
    title: 'Character Rigging Sync',
    time: '02:00 PM',
    duration: '45m',
    day: 'Tue',
    date: getDayOffset(1),
    joinUrl: 'https://meet.google.com/xyz-pdqr-stuv',
    calendarType: 'work'
  },
  {
    id: 'm4',
    title: 'Sprint Retrospective',
    time: '04:00 PM',
    duration: '90m',
    day: 'Fri',
    date: getDayOffset(4),
    joinUrl: 'https://meet.google.com/ret-ros-pec',
    calendarType: 'work'
  },
  {
    id: 'm5',
    title: 'Dinner with Team',
    time: '07:00 PM',
    duration: '120m',
    day: 'Wed',
    date: getDayOffset(2),
    calendarType: 'personal'
  }
];
