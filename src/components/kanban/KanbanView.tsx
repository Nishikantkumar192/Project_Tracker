import React, { useState, useCallback, useEffect } from 'react';
import { Task, Status } from '../../types';
import { KanbanColumn } from './KanbanColumn';

const COLUMNS: { status: Status; label: string; color: string }[] = [
  { status: 'todo',       label: 'To Do',      color: '#6b7280' },
  { status: 'inprogress', label: 'In Progress', color: '#3b82f6' },
  { status: 'inreview',   label: 'In Review',   color: '#f59e0b' },
  { status: 'done',       label: 'Done',        color: '#22c55e' },
];

export const KanbanView: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(id);
    const ghost = (e.currentTarget as HTMLElement).cloneNode(true) as HTMLElement;
    ghost.style.cssText = 'position:fixed;top:-9999px;opacity:0.75;pointer-events:none;';
    ghost.style.width = (e.currentTarget as HTMLElement).offsetWidth + 'px';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 16, 16);
    setTimeout(() => document.body.removeChild(ghost), 0);
  }, []);

  useEffect(() => {
    const end = () => setDraggingId(null);
    window.addEventListener('dragend', end);
    return () => window.removeEventListener('dragend', end);
  }, []);

  return (
    <div style={{ overflowX: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', gap: 12, height: '100%', minWidth: 'min(100%, 800px)', paddingBottom: 4 }}>
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            color={col.color}
            tasks={tasks.filter(t => t.status === col.status)}
            onDragStart={handleDragStart}
            draggingId={draggingId}
          />
        ))}
      </div>
    </div>
  );
};
