import React, { useMemo, useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { useFilteredTasks, useUrlSync, useCollaboration } from './hooks';
import { FilterBar } from './components/filters/FilterBar';
import { CollaborationBar } from './components/collaboration/CollaborationBar';
import { KanbanView } from './components/kanban/KanbanView';
import { ListView } from './components/list/ListView';
import { TimelineView } from './components/timeline/TimelineView';
import { ViewMode } from './types';

const VIEW_ICONS: Record<ViewMode, string> = { kanban: '⊞', list: '≡', timeline: '◫' };
const VIEW_LABELS: Record<ViewMode, string> = { kanban: 'Board', list: 'List', timeline: 'Timeline' };

export default function App() {
  const tasks = useStore(s => s.tasks);
  const view = useStore(s => s.view);
  const setView = useStore(s => s.setView);
  const filters = useStore(s => s.filters);
  const sort = useStore(s => s.sort);

  const filtered = useFilteredTasks(tasks, filters, sort);
  const ids = useMemo(() => filtered.map(t => t.id), [filtered]);

  useUrlSync(filters);
  useCollaboration(ids);

  // Responsive: detect if mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const VIEWS: ViewMode[] = ['kanban', 'list', 'timeline'];

  return (
    <div style={{ minHeight: '100vh', background: '#0e0c1a', color: '#e2e0f0', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ── */}
      <header style={{
        background: '#12101f', borderBottom: '1px solid #2a2540',
        padding: isMobile ? '10px 14px' : '10px 24px',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: isMobile ? 14 : 16, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>ProjectFlow</span>
        </div>

        {/* View toggle - inline on desktop, below on mobile */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 2, background: '#0e0c1a', borderRadius: 10, padding: 3, border: '1px solid #2a2540' }}>
            {VIEWS.map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '5px 13px', borderRadius: 7,
                border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
                background: view === v ? '#7c3aed' : 'transparent',
                color: view === v ? '#fff' : '#8b7fb8', transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 13 }}>{VIEW_ICONS[v]}</span>
                {VIEW_LABELS[v]}
              </button>
            ))}
          </div>
        )}

        <div style={{ marginLeft: 'auto' }}>
          <CollaborationBar />
        </div>
      </header>

      {/* Mobile view switcher */}
      {isMobile && (
        <div style={{ background: '#12101f', borderBottom: '1px solid #2a2540', display: 'flex', padding: '0 14px' }}>
          {VIEWS.map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '10px 4px', border: 'none', cursor: 'pointer', background: 'transparent',
              borderBottom: view === v ? '2px solid #7c3aed' : '2px solid transparent',
              color: view === v ? '#a78bfa' : '#6b7280', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
            }}>
              <span style={{ fontSize: 16 }}>{VIEW_ICONS[v]}</span>
              <span style={{ fontSize: 10, fontWeight: 600 }}>{VIEW_LABELS[v]}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── FILTERS ── */}
      <div style={{ padding: isMobile ? '10px 14px 0' : '12px 24px 0', flexShrink: 0 }}>
        <FilterBar />
      </div>

      {/* Task count */}
      <div style={{ padding: isMobile ? '6px 14px 2px' : '8px 24px 2px', color: '#6b7280', fontSize: 11, flexShrink: 0 }}>
        {filtered.length} / {tasks.length} tasks
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, padding: isMobile ? '0 14px 14px' : '0 24px 24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {view === 'kanban'   && <KanbanView   tasks={filtered} />}
        {view === 'list'     && <ListView     tasks={filtered} />}
        {view === 'timeline' && <TimelineView tasks={filtered} />}
      </main>
    </div>
  );
}
