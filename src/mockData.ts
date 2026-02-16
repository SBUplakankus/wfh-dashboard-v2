
import { Project, Meeting, KanriTask, JoplinNotebook, DocFile } from './types';

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

// Mock Kanri Tasks
export const mockKanriTasks: KanriTask[] = [
  {
    id: 'task1',
    title: 'Implement user authentication',
    description: 'Add JWT-based authentication system',
    column: 'Done',
    priority: 'high',
    dueDate: new Date('2024-02-10'),
    tags: ['backend', 'security']
  },
  {
    id: 'task2',
    title: 'Design dashboard UI mockups',
    description: 'Create Figma designs for dashboard',
    column: 'In Progress',
    priority: 'high',
    dueDate: new Date('2024-02-20'),
    tags: ['design', 'ui']
  },
  {
    id: 'task3',
    title: 'Write API documentation',
    description: 'Document all REST endpoints',
    column: 'To Do',
    priority: 'medium',
    dueDate: new Date('2024-02-25'),
    tags: ['documentation']
  },
  {
    id: 'task4',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for deployment',
    column: 'To Do',
    priority: 'medium',
    tags: ['devops']
  },
  {
    id: 'task5',
    title: 'Optimize database queries',
    description: 'Improve query performance',
    column: 'To Do',
    priority: 'low',
    tags: ['backend', 'performance']
  },
  {
    id: 'task6',
    title: 'Add unit tests',
    description: 'Write tests for core modules',
    column: 'Review',
    priority: 'high',
    dueDate: new Date('2024-02-18'),
    tags: ['testing']
  }
];

// Mock Joplin Notebooks and Notes
export const mockJoplinNotebooks: JoplinNotebook[] = [
  {
    id: 'nb1',
    name: 'Project Notes',
    notes: [
      {
        id: 'note1',
        title: 'Sprint Planning Meeting Notes',
        content: 'Discussed upcoming features and priorities for next sprint...',
        created: new Date('2024-02-01'),
        modified: new Date('2024-02-15'),
        tags: ['meeting', 'planning'],
        notebookId: 'nb1'
      },
      {
        id: 'note2',
        title: 'Technical Architecture Decisions',
        content: 'Decided to use PostgreSQL for data persistence...',
        created: new Date('2024-01-28'),
        modified: new Date('2024-02-10'),
        tags: ['architecture', 'technical'],
        notebookId: 'nb1'
      }
    ]
  },
  {
    id: 'nb2',
    name: 'Meeting Notes',
    notes: [
      {
        id: 'note3',
        title: 'Daily Standup - Feb 15',
        content: 'Team discussed blockers and progress...',
        created: new Date('2024-02-15'),
        modified: new Date('2024-02-15'),
        tags: ['standup', 'daily'],
        notebookId: 'nb2'
      }
    ]
  },
  {
    id: 'nb3',
    name: 'Research',
    notes: [
      {
        id: 'note4',
        title: 'React Performance Optimization',
        content: 'Research on memoization and virtualization techniques...',
        created: new Date('2024-02-05'),
        modified: new Date('2024-02-12'),
        tags: ['react', 'performance'],
        notebookId: 'nb3'
      },
      {
        id: 'note5',
        title: 'Database Indexing Strategies',
        content: 'Best practices for PostgreSQL indexing...',
        created: new Date('2024-02-08'),
        modified: new Date('2024-02-14'),
        tags: ['database', 'optimization'],
        notebookId: 'nb3'
      }
    ]
  }
];

// Mock MkDocs Files
export const mockDocFiles: DocFile[] = [
  {
    name: 'README.md',
    path: '/docs/README.md',
    isFolder: false,
    size: 2048,
    modified: new Date('2024-02-15')
  },
  {
    name: 'getting-started',
    path: '/docs/getting-started',
    isFolder: true,
    children: [
      {
        name: 'index.md',
        path: '/docs/getting-started/index.md',
        isFolder: false,
        size: 1536,
        modified: new Date('2024-02-14')
      },
      {
        name: 'installation.md',
        path: '/docs/getting-started/installation.md',
        isFolder: false,
        size: 3072,
        modified: new Date('2024-02-13')
      }
    ]
  },
  {
    name: 'api',
    path: '/docs/api',
    isFolder: true,
    children: [
      {
        name: 'reference.md',
        path: '/docs/api/reference.md',
        isFolder: false,
        size: 4096,
        modified: new Date('2024-02-12')
      }
    ]
  },
  {
    name: 'tutorials',
    path: '/docs/tutorials',
    isFolder: true,
    children: [
      {
        name: 'tutorial-1.md',
        path: '/docs/tutorials/tutorial-1.md',
        isFolder: false,
        size: 2560,
        modified: new Date('2024-02-11')
      }
    ]
  }
];
