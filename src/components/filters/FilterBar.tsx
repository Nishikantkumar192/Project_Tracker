import React, { useState } from 'react';
import { useStore, USERS } from '../../store/useStore';
import { hasActiveFilters } from '../../utils';
import { Status, Priority } from '../../types';

const STATUSES: { id: Status; label: string }[] = [
  { id: 'todo', label: 'To Do' }, { id: 'inprogress', label: 'In Progress' },
  { id: 'inreview', label: 'In Review' }, { id: 'done', label: 'Done' },
];
const PRIORITIES: { id: Priority; label: string }[] = [
  { id: 'critical', label: 'Critical' }, { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' }, { id: 'low', label: 'Low' },
];

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

const chip = (active: boolean, color?: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 99,
  border: `1px solid ${active ? (color || '#7c3aed') : '#2a2540'}`,
  background: active ? (color ? color + '22' : '#7c3aed22') : 'transparent',
  color: active ? (color || '#a78bfa') : '#8b7fb8',
  fontSize: 11, fontWeight: 500, cursor: 'pointer', transition: 'all 0.12s', userSelect: 'none', whiteSpace: 'nowrap',
});

export const FilterBar: React.FC = () => {
  const filters = useStore(s => s.filters);
  const setFilter = useStore(s => s.setFilter);
  const clearFilters = useStore(s => s.clearFilters);
  const active = hasActiveFilters(filters);
  const [open, setOpen] = useState(false);

  const totalActive = filters.statuses.length + filters.priorities.length + filters.assignees.length + (filters.dateFrom ? 1 : 0) + (filters.dateTo ? 1 : 0);

  return (
    <div style={{ background: '#12101f', border: '1px solid #2a2540', borderRadius: 12, overflow: 'hidden' }}>
      {/* Toggle row - always visible */}
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={() => setOpen(o => !o)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
          background: open ? '#7c3aed22' : '#1a1730', border: '1px solid #2a2540',
          borderRadius: 8, color: '#a78bfa', fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>
          <span>⚙ Filters</span>
          {totalActive > 0 && (
            <span style={{ background: '#7c3aed', color: '#fff', borderRadius: 99, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{totalActive}</span>
          )}
          <span style={{ fontSize: 10, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
        </button>

        {/* Active filter chips summary */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
          {filters.statuses.map(s => (
            <span key={s} onClick={() => setFilter({ statuses: toggle(filters.statuses, s) })} style={{ ...chip(true), fontSize: 10 }}>
              {s} ✕
            </span>
          ))}
          {filters.priorities.map(p => (
            <span key={p} onClick={() => setFilter({ priorities: toggle(filters.priorities, p) })} style={{ ...chip(true), fontSize: 10 }}>
              {p} ✕
            </span>
          ))}
          {filters.assignees.map(id => {
            const u = USERS.find(u => u.id === id);
            return u ? (
              <span key={id} onClick={() => setFilter({ assignees: toggle(filters.assignees, id) })} style={{ ...chip(true, u.color), fontSize: 10 }}>
                {u.name.split(' ')[0]} ✕
              </span>
            ) : null;
          })}
        </div>

        {active && (
          <button onClick={clearFilters} style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 8, background: 'transparent', border: '1px solid #3b3559', color: '#8b7fb8', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Clear all
          </button>
        )}
      </div>

      {/* Expandable filter panel */}
      {open && (
        <div style={{ borderTop: '1px solid #1e1b2e', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Status row */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Status</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {STATUSES.map(s => (
                <button key={s.id} onClick={() => setFilter({ statuses: toggle(filters.statuses, s.id) })} style={chip(filters.statuses.includes(s.id))}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority row */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Priority</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {PRIORITIES.map(p => (
                <button key={p.id} onClick={() => setFilter({ priorities: toggle(filters.priorities, p.id) })} style={chip(filters.priorities.includes(p.id))}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assignee row */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Assignee</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {USERS.map(u => (
                <button key={u.id} onClick={() => setFilter({ assignees: toggle(filters.assignees, u.id) })} style={chip(filters.assignees.includes(u.id), u.color)}>
                  {u.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Due Date Range</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <input type="date" value={filters.dateFrom} onChange={e => setFilter({ dateFrom: e.target.value })}
                style={{ background: '#1a1730', border: '1px solid #2a2540', borderRadius: 6, color: '#c4b5fd', padding: '4px 8px', fontSize: 12 }} />
              <span style={{ color: '#6b7280', fontSize: 12 }}>to</span>
              <input type="date" value={filters.dateTo} onChange={e => setFilter({ dateTo: e.target.value })}
                style={{ background: '#1a1730', border: '1px solid #2a2540', borderRadius: 6, color: '#c4b5fd', padding: '4px 8px', fontSize: 12 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
