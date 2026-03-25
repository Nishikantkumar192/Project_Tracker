import { Priority } from '../types';
import { FilterState, Status } from '../types';

export const PRIORITY_ORDER: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
export const PRIORITY_COLOR: Record<Priority, string> = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#22c55e' };
export const PRIORITY_BG: Record<Priority, string> = { critical: 'rgba(239,68,68,0.12)', high: 'rgba(249,115,22,0.12)', medium: 'rgba(245,158,11,0.12)', low: 'rgba(34,197,94,0.12)' };

export function formatDueDate(dueDate: string): { label: string; isOverdue: boolean } {
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(dueDate); due.setHours(0,0,0,0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return { label: 'Due Today', isOverdue: false };
  if (diff > 0)   return { label: due.toLocaleDateString('en-GB',{day:'numeric',month:'short'}), isOverdue: false };
  const days = Math.abs(diff);
  if (days > 7)   return { label: `${days}d overdue`, isOverdue: true };
  return { label: due.toLocaleDateString('en-GB',{day:'numeric',month:'short'}), isOverdue: true };
}

export function filtersToSearch(f: FilterState): string {
  const p = new URLSearchParams();
  if (f.statuses.length)   p.set('status',   f.statuses.join(','));
  if (f.priorities.length) p.set('priority', f.priorities.join(','));
  if (f.assignees.length)  p.set('assignee', f.assignees.join(','));
  if (f.dateFrom)          p.set('from', f.dateFrom);
  if (f.dateTo)            p.set('to',   f.dateTo);
  return p.toString();
}

export function searchToFilters(search: string): FilterState {
  const p = new URLSearchParams(search);
  return {
    statuses:   (p.get('status')?.split(',').filter(Boolean)   ?? []) as Status[],
    priorities: (p.get('priority')?.split(',').filter(Boolean) ?? []) as any[],
    assignees:  p.get('assignee')?.split(',').filter(Boolean) ?? [],
    dateFrom:   p.get('from') ?? '',
    dateTo:     p.get('to')   ?? '',
  };
}

export function hasActiveFilters(f: FilterState): boolean {
  return f.statuses.length > 0 || f.priorities.length > 0 || f.assignees.length > 0 || !!f.dateFrom || !!f.dateTo;
}
