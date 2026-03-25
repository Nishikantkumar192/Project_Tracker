import { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Alex Rivera',  color: '#7c3aed' },
  { id: 'u2', name: 'Sam Chen',     color: '#d97706' },
  { id: 'u3', name: 'Jordan Blake', color: '#059669' },
  { id: 'u4', name: 'Morgan Lee',   color: '#dc2626' },
  { id: 'u5', name: 'Casey Kim',    color: '#0284c7' },
  { id: 'u6', name: 'Riley Torres', color: '#db2777' },
];

const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
const STATUSES: Status[] = ['todo', 'inprogress', 'inreview', 'done'];
const PREFIXES = ['Implement','Refactor','Design','Fix','Add','Update','Remove','Optimise','Review','Test','Deploy','Document','Migrate','Audit','Build'];
const SUBJECTS = [
  'authentication flow','dashboard layout','API gateway','user profile page',
  'notification system','payment integration','search functionality','data pipeline',
  'error handling','cache layer','CI/CD pipeline','database schema','WebSocket client',
  'form validation','file upload component','permission matrix','rate limiter',
  'GraphQL resolvers','unit test suite','accessibility audit','dark mode support',
  'onboarding flow','email templates','analytics dashboard','mobile responsiveness',
  'session management','logging service','feature flags','A/B test framework','SSO integration',
];

function rnd(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }

function isoOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function generateTasks(count = 500): Task[] {
  const tasks: Task[] = [];
  for (let i = 0; i < count; i++) {
    const prefix = PREFIXES[i % PREFIXES.length];
    const subject = SUBJECTS[Math.floor(i / PREFIXES.length) % SUBJECTS.length];
    const dueDays = rnd(-20, 35);
    const hasStart = Math.random() > 0.15;
    const startDays = hasStart ? dueDays - rnd(1, 12) : null;
    tasks.push({
      id: `task-${i}`,
      title: `${prefix} ${subject} #${i + 1}`,
      assigneeId: USERS[i % USERS.length].id,
      priority: PRIORITIES[i % PRIORITIES.length],
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      startDate: startDays !== null ? isoOffset(startDays) : null,
      dueDate: isoOffset(dueDays),
    });
  }
  return tasks;
}
