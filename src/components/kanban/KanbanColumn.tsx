import React, { useState } from 'react';
import { Task, Status } from '../../types';
import { KanbanCard } from './KanbanCard';
import { useStore } from '../../store/useStore';

interface Props {
  status: Status; label: string; color: string; tasks: Task[];
  onDragStart: (e: React.DragEvent, id: string) => void;
  draggingId: string | null;
}

export const KanbanColumn: React.FC<Props> = ({ status, label, color, tasks, onDragStart, draggingId }) => {
  const moveTask = useStore(s => s.moveTask);
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); const id = e.dataTransfer.getData('taskId'); if (id) moveTask(id, status); setOver(false); }}
      style={{
        flex: '1 1 200px', minWidth: 0, display: 'flex', flexDirection: 'column',
        background: over ? `${color}0d` : '#12101f',
        border: `1px solid ${over ? color + '66' : '#2a2540'}`,
        borderRadius: 12, transition: 'background 0.15s, border-color 0.15s', overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '12px 14px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ color: '#e2e0f0', fontWeight: 600, fontSize: 12 }}>{label}</span>
        </div>
        <span style={{ background: '#2a2540', color: '#8b7fb8', borderRadius: 99, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{tasks.length}</span>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2px 10px 10px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {tasks.length === 0 ? (
          <div style={{ flex: 1, minHeight: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #2a2540', borderRadius: 8, color: '#4b4568', fontSize: 11, gap: 4, padding: 16, textAlign: 'center' }}>
            <span style={{ fontSize: 20 }}>📭</span>
            <span>No tasks</span>
          </div>
        ) : (
          tasks.map(task => (
            <React.Fragment key={task.id}>
              {draggingId === task.id
                ? <div style={{ height: 80, borderRadius: 8, border: '2px dashed #7c3aed44', background: '#7c3aed08' }} />
                : <KanbanCard task={task} onDragStart={onDragStart} />
              }
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};
