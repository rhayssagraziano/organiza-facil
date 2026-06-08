interface ErrorBannerProps {
  message: string;
  variant?: 'error' | 'success' | 'warning';
}

const config = {
  error:   { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)', color: 'var(--vermelho)' },
  success: { bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.25)',  color: 'var(--verde)'    },
  warning: { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.25)',  color: 'var(--amarelo)'  },
};

const ErrorBanner = ({ message, variant = 'error' }: ErrorBannerProps) => {
  const { bg, border, color } = config[variant];
  return (
    <div style={{
      padding: '10px 14px',
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 8,
      color,
      fontSize: 13,
      marginBottom: 12,
    }}>
      {message}
    </div>
  );
};

export default ErrorBanner;
