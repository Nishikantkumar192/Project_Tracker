import React from 'react';
import { User } from '../../types';

interface Props { user: User; size?: number; style?: React.CSSProperties; title?: string; }

export const Avatar: React.FC<Props> = ({ user, size = 28, style, title }) => {
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div title={title ?? user.name} style={{
      width: size, height: size, borderRadius: '50%', background: user.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, color: '#fff', flexShrink: 0,
      border: '2px solid #1a1730', userSelect: 'none', cursor: 'default', ...style,
    }}>
      {initials}
    </div>
  );
};
