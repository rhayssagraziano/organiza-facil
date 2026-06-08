interface ProgressBarProps {
  /** Percentage value 0–100 */
  value: number;
  color?: string;
  height?: number;
  animated?: boolean;
}

const ProgressBar = ({
  value,
  color = 'var(--verde)',
  height = 6,
  animated = true,
}: ProgressBarProps) => {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div style={{
      background: 'var(--bg3)',
      borderRadius: height,
      height,
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${clamped}%`,
        height: '100%',
        background: color,
        borderRadius: height,
        transition: animated ? 'width .8s ease' : 'none',
      }} />
    </div>
  );
};

export default ProgressBar;
