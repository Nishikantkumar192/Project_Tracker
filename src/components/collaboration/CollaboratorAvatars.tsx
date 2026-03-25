import React from 'react';
import { CollaboratorPresence } from '../../types';
import { Avatar } from '../ui/Avatar';

export const CollaboratorAvatars: React.FC<{ taskId: string; collaborators: CollaboratorPresence[] }> = ({ taskId, collaborators }) => {
  const on = collaborators.filter(c => c.taskId === taskId);
  if (!on.length) return null;
  const vis = on.slice(0, 2);
  const over = on.length - vis.length;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {vis.map((c, i) => <Avatar key={c.user.id} user={c.user} size={18} style={{ marginLeft: i > 0 ? -5 : 0, zIndex: vis.length - i, border: '1.5px solid #1a1730' }} />)}
      {over > 0 && <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#2a2540', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#8b7fb8', marginLeft: -5, border: '1.5px solid #1a1730' }}>+{over}</div>}
    </div>
  );
};
