import { create } from 'zustand';
import { Task, ViewMode, SortField, SortDir, FilterState, Status, CollaboratorPresence } from '../types';
import { generateTasks, USERS } from '../data/seed';
import { searchToFilters } from '../utils';

export { USERS };

const EMPTY: FilterState = { statuses: [], priorities: [], assignees: [], dateFrom: '', dateTo: '' };

interface Store {
  tasks: Task[];
  view: ViewMode;
  sort: { field: SortField; dir: SortDir };
  filters: FilterState;
  collaborators: CollaboratorPresence[];
  sidebarOpen: boolean;

  setView: (v: ViewMode) => void;
  setSort: (f: SortField) => void;
  moveTask: (id: string, s: Status) => void;
  updateStatus: (id: string, s: Status) => void;
  setFilter: (p: Partial<FilterState>) => void;
  clearFilters: () => void;
  setCollaborators: (c: CollaboratorPresence[]) => void;
  toggleSidebar: () => void;
}

export const useStore = create<Store>((set, get) => ({
  tasks: generateTasks(500),
  view: 'kanban',
  sort: { field: 'dueDate', dir: 'asc' },
  filters: searchToFilters(window.location.search),
  collaborators: [],
  sidebarOpen: false,

  setView: (v) => set({ view: v }),
  setSort: (field) => set((s) => ({
    sort: s.sort.field === field ? { field, dir: s.sort.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: 'asc' }
  })),
  moveTask: (id, status) => set((s) => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, status } : t) })),
  updateStatus: (id, status) => set((s) => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, status } : t) })),
  setFilter: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  clearFilters: () => set({ filters: { ...EMPTY } }),
  setCollaborators: (c) => set({ collaborators: c }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
