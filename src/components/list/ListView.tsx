import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Task, Status, SortField } from '../../types';
import { useStore, USERS } from '../../store/useStore';
import { PriorityBadge } from '../ui/PriorityBadge';
import { Avatar } from '../ui/Avatar';
import { formatDueDate } from '../../utils';
import { CollaboratorAvatars } from '../collaboration/CollaboratorAvatars';

const ROW_H = 52;
const BUFFER = 5;

const STATUS_OPTS: { value: Status; label: string }[] = [
  { value: 'todo', label: 'To Do' }, { value: 'inprogress', label: 'In Progress' },
  { value: 'inreview', label: 'In Review' }, { value: 'done', label: 'Done' },
];

export const ListView: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const sort = useStore(s => s.sort);
  const setSort = useStore(s => s.setSort);
  const updateStatus = useStore(s => s.updateStatus);
  const collaborators = useStore(s => s.collaborators);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerH, setContainerH] = useState(500);

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const ro = new ResizeObserver(() => setContainerH(el.clientHeight));
    ro.observe(el); setContainerH(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  const handleScroll = useCallback(() => {
    if (containerRef.current) setScrollTop(containerRef.current.scrollTop);
  }, []);

  const totalH = tasks.length * ROW_H;
  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_H) - BUFFER);
  const endIdx = Math.min(tasks.length - 1, Math.ceil((scrollTop + containerH) / ROW_H) + BUFFER);
  const visible = tasks.slice(startIdx, endIdx + 1);

  const SortBtn: React.FC<{ field: SortField; label: string; flex?: string }> = ({ field, label, flex }) => (
    <div onClick={() => setSort(field)} style={{
      flex: flex ?? '1', padding: '10px 12px', fontSize: 10, fontWeight: 700,
      color: sort.field === field ? '#a78bfa' : '#6b7280',
      textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer',
      userSelect: 'none', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
    }}>
      {label}
      <span style={{ opacity: sort.field === field ? 1 : 0.3, fontSize: 9 }}>
        {sort.field === field ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </div>
  );

  if (tasks.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 10, color: '#6b7280', padding: 40 }}>
      <span style={{ fontSize: 40 }}>🔍</span>
      <span style={{ fontSize: 15, fontWeight: 600, color: '#8b7fb8' }}>No tasks match your filters</span>
      <span style={{ fontSize: 12 }}>Try adjusting or clearing filters</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#12101f', borderRadius: 12, border: '1px solid #2a2540', overflow: 'hidden' }}>
      {/* Sticky header */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2a2540', background: '#0e0c1a', flexShrink: 0, overflowX: 'auto' }}>
        <SortBtn field="title" label="Title" flex="3" />
        <SortBtn field="priority" label="Priority" flex="1.2" />
        <div style={{ flex: '1.5', padding: '10px 12px', fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Status</div>
        <SortBtn field="dueDate" label="Due" flex="1.2" />
        <div style={{ flex: '1.5', padding: '10px 12px', fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'none' } as React.CSSProperties}>Assignee</div>
      </div>

      {/* Virtual scroll body */}
      <div ref={containerRef} onScroll={handleScroll} style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', position: 'relative' }}>
        <div style={{ height: totalH, position: 'relative', minWidth: 500 }}>
          <div style={{ position: 'absolute', top: startIdx * ROW_H, left: 0, right: 0 }}>
            {visible.map(task => {
              const user = USERS.find(u => u.id === task.assigneeId)!;
              const { label, isOverdue } = formatDueDate(task.dueDate);
              return (
                <div key={task.id} style={{ display: 'flex', height: ROW_H, borderBottom: '1px solid #1e1b2e', alignItems: 'center', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1a1730')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ flex: 3, padding: '0 12px', color: '#e2e0f0', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.title}
                  </div>
                  <div style={{ flex: 1.2, padding: '0 12px', minWidth: 80 }}>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <div style={{ flex: 1.5, padding: '0 12px', minWidth: 110 }}>
                    <select value={task.status} onChange={e => updateStatus(task.id, e.target.value as Status)}
                      style={{ background: '#1a1730', border: '1px solid #2a2540', borderRadius: 6, color: '#c4b5fd', fontSize: 11, padding: '3px 6px', cursor: 'pointer', width: '100%' }}>
                      {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1.2, padding: '0 12px', fontSize: 11, color: isOverdue ? '#f87171' : '#8b7fb8', whiteSpace: 'nowrap', minWidth: 80 }}>
                    {label}
                  </div>
                  <div style={{ flex: 1.5, padding: '0 12px', minWidth: 100 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Avatar user={user} size={22} />
                      <span style={{ color: '#8b7fb8', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.name.split(' ')[0]}
                      </span>
                      <CollaboratorAvatars taskId={task.id} collaborators={collaborators} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '6px 12px', borderTop: '1px solid #1e1b2e', color: '#6b7280', fontSize: 10, flexShrink: 0 }}>
        {tasks.length} tasks · virtual scrolling (only ~{endIdx - startIdx + 1} rows in DOM)
      </div>
    </div>
  );
};
