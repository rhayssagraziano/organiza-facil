import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  color?: string;
  sublabel?: string;
  action?: ReactNode;
}

const StatCard = ({
  label,
  value,
  color = 'var(--txt)',
  sublabel,
  action,
}: StatCardProps) => (
  <div style={{
    background: 'var(--bg2)', border: '1px solid var(--borda)',
    borderRadius: 12, padding: 14,
    display: 'flex', flexDirection: 'column', gap: 4,
  }}>
    <div style={{
      fontSize: 11, color: 'var(--txt3)',
      textTransform: 'uppercase', letterSpacing: '.5px',
    }}>
      {label}
    </div>
    <div style={{ fontSize: 20, fontWeight: 500, color }}>
      {value}
    </div>
    {sublabel && (
      <div style={{ fontSize: 11, color: 'var(--txt3)' }}>{sublabel}</div>
    )}
    {action && <div style={{ marginTop: 4 }}>{action}</div>}
  </div>
);

export default StatCard;
