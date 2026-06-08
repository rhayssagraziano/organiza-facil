import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyAvatar } from '../gamification/PiggyAvatar';
import { defaultAvatar } from '../../services/avatarService';

export function Footer() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <footer style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '24px 40px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row', gap: 12,
            maxWidth: 1100, margin: '0 auto',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PiggyAvatar size={24} config={defaultAvatar} />
                <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 600 }}>OrganizaFácil</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                © 2026 OrganizaFácil. Todos os direitos reservados.
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
                <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 12, cursor: 'pointer' }}>Entrar</button>
                <button onClick={() => navigate('/cadastro')} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 12, cursor: 'pointer' }}>Cadastro</button>
            </div>
        </footer>
    );
}
