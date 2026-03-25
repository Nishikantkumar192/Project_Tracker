import { useMemo, useEffect } from 'react';
import { Task, FilterState, SortField, SortDir } from '../types';
import { PRIORITY_ORDER, filtersToSearch } from '../utils';
import { useStore, USERS } from '../store/useStore';
import { CollaboratorPresence } from '../types';

export function useFilteredTasks(tasks: Task[], filters: FilterState, sort: { field: SortField; dir: SortDir }): Task[] {
  return useMemo(() => {
    let r = tasks;
    if (filters.statuses.length)   r = r.filter(t => filters.statuses.includes(t.status));
    if (filters.priorities.length) r = r.filter(t => filters.priorities.includes(t.priority));
    if (filters.assignees.length)  r = r.filter(t => filters.assignees.includes(t.assigneeId));
    if (filters.dateFrom)          r = r.filter(t => t.dueDate >= filters.dateFrom);
    if (filters.dateTo)            r = r.filter(t => t.dueDate <= filters.dateTo);
    return [...r].sort((a, b) => {
      let c = 0;
      if (sort.field === 'title')    c = a.title.localeCompare(b.title);
      if (sort.field === 'priority') c = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sort.field === 'dueDate')  c = a.dueDate.localeCompare(b.dueDate);
      return sort.dir === 'asc' ? c : -c;
    });
  }, [tasks, filters, sort]);
}

export function useUrlSync(filters: FilterState) {
  useEffect(() => {
    const s = filtersToSearch(filters);
    window.history.replaceState(null, '', s ? `?${s}` : window.location.pathname);
  }, [filters]);
}

const COLLAB_USERS = USERS.slice(0, 4);

export function useCollaboration(taskIds: string[]) {
  const setCollaborators = useStore(s => s.setCollaborators);
  useEffect(() => {
    const pick = () => {
      if (!taskIds.length) return;
      const p: CollaboratorPresence[] = COLLAB_USERS.map(user => ({
        user,
        taskId: Math.random() < 0.8 ? taskIds[Math.floor(Math.random() * Math.min(taskIds.length, 30))] : null,
      }));
      setCollaborators(p);
    };
    pick();
    const id = setInterval(pick, 3000);
    return () => clearInterval(id);
  }, [taskIds, setCollaborators]);
}
