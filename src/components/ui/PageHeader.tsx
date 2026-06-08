import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional element rendered on the right side (e.g. an action button) */
  action?: ReactNode;
}

const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <div style={{
    marginBottom: 20,
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 10,
  }}>
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', margin: '0 0 4px' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ color: 'var(--txt3)', fontSize: 13, margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
    {action && <div style={{ flexShrink: 0 }}>{action}</div>}
  </div>
);

export default PageHeader;
