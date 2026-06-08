interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  border?: string;
  size?: 'sm' | 'md';
}

const Badge = ({
  label,
  color = 'var(--text-secondary)',
  bg = 'rgba(255,255,255,0.05)',
  border = 'transparent',
  size = 'sm',
}: BadgeProps) => (
  <span style={{
    fontSize:        size === 'sm' ? 10 : 12,
    fontWeight:      700,
    textTransform:   'uppercase',
    letterSpacing:   '.4px',
    color,
    background:      bg,
    border:          `1px solid ${border}`,
    borderRadius:    9999,
    padding:         size === 'sm' ? '2px 8px' : '3px 10px',
    display:         'inline-block',
    whiteSpace:      'nowrap',
  }}>
    {label}
  </span>
);

export default Badge;
