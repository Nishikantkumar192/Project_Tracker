import React from 'react';
import { useStore } from '../../store/useStore';
import { Avatar } from '../ui/Avatar';

export const CollaborationBar: React.FC = () => {
  const collaborators = useStore(s => s.collaborators);
  const active = collaborators.filter(c => c.taskId !== null);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#12101f', border: '1px solid #2a2540', borderRadius: 10, padding: '5px 12px', flexShrink: 0 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 5px #22c55e', flexShrink: 0 }} />
      <div style={{ display: 'flex' }}>
        {active.map((c, i) => <Avatar key={c.user.id} user={c.user} size={24} style={{ marginLeft: i > 0 ? -7 : 0, zIndex: active.length - i }} />)}
      </div>
      <span style={{ color: '#8b7fb8', fontSize: 11, whiteSpace: 'nowrap' }}>
        {active.length} viewing
      </span>
    </div>
  );
};
