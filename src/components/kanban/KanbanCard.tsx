import React from 'react';
import { Task } from '../../types';
import { USERS } from '../../store/useStore';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge } from '../ui/PriorityBadge';
import { formatDueDate } from '../../utils';
import { CollaboratorAvatars } from '../collaboration/CollaboratorAvatars';
import { useStore } from '../../store/useStore';

interface Props { task: Task; onDragStart: (e: React.DragEvent, id: string) => void; }

export const KanbanCard: React.FC<Props> = ({ task, onDragStart }) => {
  const user = USERS.find(u => u.id === task.assigneeId)!;
  const { label, isOverdue } = formatDueDate(task.dueDate);
  const collaborators = useStore(s => s.collaborators);

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, task.id)}
      style={{ background: '#1a1730', border: '1px solid #2a2540', borderRadius: 10, padding: '11px 12px', cursor: 'grab', userSelect: 'none', transition: 'box-shadow 0.15s, border-color 0.15s' }}
      onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = '#7c3aed66'; d.style.boxShadow = '0 4px 16px rgba(124,58,237,0.15)'; }}
      onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = '#2a2540'; d.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 6 }}>
        <p style={{ color: '#e2e0f0', fontSize: 12, fontWeight: 500, lineHeight: 1.45, flex: 1, margin: 0 }}>{task.title}</p>
        <CollaboratorAvatars taskId={task.id} collaborators={collaborators} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
        <PriorityBadge priority={task.priority} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: isOverdue ? '#f87171' : '#8b7fb8' }}>{label}</span>
          <Avatar user={user} size={20} />
        </div>
      </div>
    </div>
  );
};
