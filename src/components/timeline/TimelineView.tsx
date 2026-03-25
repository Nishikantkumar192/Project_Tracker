import React, { useMemo } from 'react';
import { Task } from '../../types';
import { PRIORITY_COLOR } from '../../utils';

const LABEL_W = 160;
const DAY_W = 30;
const ROW_H = 38;

export const TimelineView: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthStart = new Date(year, month, 1);
  const todayIdx = today.getDate() - 1;

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return { num: i + 1, isWeekend: d.getDay() === 0 || d.getDay() === 6 };
  });

  const bars = useMemo(() => tasks.map(task => {
    const due = new Date(task.dueDate); due.setHours(0, 0, 0, 0);
    const start = task.startDate ? new Date(task.startDate) : due;
    const dueOff   = Math.round((due.getTime()   - monthStart.getTime()) / 86400000);
    const startOff = Math.round((start.getTime() - monthStart.getTime()) / 86400000);
    const cs = Math.max(0, startOff);
    const ce = Math.min(daysInMonth - 1, dueOff);
    if (ce < 0 || cs >= daysInMonth) return null;
    const single = !task.startDate || startOff === dueOff;
    return { task, left: cs * DAY_W, width: single ? DAY_W - 4 : (ce - cs + 1) * DAY_W - 2, single };
  }).filter(Boolean) as { task: Task; left: number; width: number; single: boolean }[], [tasks, monthStart, daysInMonth]);

  const monthLabel = today.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <div style={{ background: '#12101f', borderRadius: 12, border: '1px solid #2a2540', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2540', color: '#e2e0f0', fontWeight: 600, fontSize: 13, flexShrink: 0 }}>
        📅 {monthLabel}
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ minWidth: LABEL_W + daysInMonth * DAY_W, position: 'relative' }}>
          {/* Header */}
          <div style={{ display: 'flex', position: 'sticky', top: 0, zIndex: 5, background: '#0e0c1a', borderBottom: '1px solid #2a2540' }}>
            <div style={{ width: LABEL_W, flexShrink: 0, padding: '8px 12px', fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Task</div>
            <div style={{ display: 'flex' }}>
              {days.map(d => (
                <div key={d.num} style={{
                  width: DAY_W, flexShrink: 0, textAlign: 'center', fontSize: 10,
                  fontWeight: d.num === today.getDate() ? 700 : 400,
                  color: d.num === today.getDate() ? '#a78bfa' : d.isWeekend ? '#3b3559' : '#6b7280',
                  padding: '8px 0', background: d.isWeekend ? '#09091500' : 'transparent',
                }}>
                  {d.num}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          {tasks.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>No tasks for this month</div>
          ) : tasks.map(task => {
            const bar = bars.find(b => b.task.id === task.id);
            return (
              <div key={task.id} style={{ display: 'flex', height: ROW_H, borderBottom: '1px solid #1a1730', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1a1730')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ width: LABEL_W, flexShrink: 0, padding: '0 12px', fontSize: 11, color: '#c4b5fd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {task.title}
                </div>
                <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                  {days.filter(d => d.isWeekend).map(d => (
                    <div key={d.num} style={{ position: 'absolute', left: (d.num - 1) * DAY_W, top: 0, width: DAY_W, height: '100%', background: '#0a091888', pointerEvents: 'none' }} />
                  ))}
                  {/* Today line */}
                  <div style={{ position: 'absolute', left: todayIdx * DAY_W + DAY_W / 2 - 1, top: 0, width: 2, height: '100%', background: '#7c3aed', opacity: 0.6, pointerEvents: 'none' }} />
                  {bar && (
                    <div title={task.title} style={{
                      position: 'absolute', left: bar.left, top: '50%', transform: 'translateY(-50%)',
                      width: bar.width, height: bar.single ? 22 : 20, borderRadius: bar.single ? '50%' : 4,
                      background: PRIORITY_COLOR[task.priority], opacity: 0.85,
                      display: 'flex', alignItems: 'center', paddingLeft: bar.single ? 0 : 5,
                      overflow: 'hidden', cursor: 'pointer',
                    }}>
                      {!bar.single && bar.width > 50 && (
                        <span style={{ fontSize: 9, color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {task.title}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
