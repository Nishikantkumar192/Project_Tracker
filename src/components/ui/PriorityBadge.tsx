import React from 'react';
import { Priority } from '../../types';
import { PRIORITY_COLOR, PRIORITY_BG } from '../../utils';

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '2px 7px', borderRadius: 99,
    background: PRIORITY_BG[priority], color: PRIORITY_COLOR[priority],
    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
  }}>
    <span style={{ width: 5, height: 5, borderRadius: '50%', background: PRIORITY_COLOR[priority], display: 'inline-block', flexShrink: 0 }} />
    {priority}
  </span>
);
