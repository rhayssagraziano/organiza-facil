import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#0f1117',
            color: '#f1f5f9',
            gap: '16px'
        }}>
            <div style={{ fontSize: '80px' }}>🐷</div>
            <h1 style={{ fontSize: '48px', color: '#4ade80' }}>404</h1>
            <p style={{ fontSize: '18px', color: '#94a3b8' }}>
                Oops! Página não encontrada
            </p>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
                Parece que você se perdeu no controle financeiro...
            </p>
            <button
                onClick={() => navigate('/')}
                style={{
                    marginTop: '16px',
                    padding: '12px 24px',
                    background: '#4ade80',
                    color: '#0f1117',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}
            >
                Voltar ao início
            </button>
        </div>
    );
};

export default NotFoundPage;