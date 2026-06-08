import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyAvatar } from '../gamification/PiggyAvatar';
import { defaultAvatar } from '../../services/avatarService';

export function CtaSection() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <section style={{
            padding: isMobile ? '60px 20px' : '80px 40px',
            textAlign: 'center',
            maxWidth: 700, margin: '0 auto',
        }}>
            <div style={{ marginBottom: 20 }}>
                <div style={{ animation: 'float 3s ease-in-out infinite alternate', display: 'inline-block' }}>
                    <PiggyAvatar size={100} config={defaultAvatar} animated />
                </div>
            </div>
            <h2 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 900, margin: '0 0 16px', color: 'var(--text-primary)' }}>
                Pronto para transformar suas finanças?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 32px' }}>
                Junte-se a quem já está no controle. Comece gratuitamente e veja seu porquinho crescer.
            </p>
            <button onClick={() => navigate('/cadastro')} style={{
                padding: '15px 36px', background: 'var(--green-neon)', border: 'none',
                borderRadius: 12, color: '#000', fontSize: 16, fontWeight: 900,
                cursor: 'pointer', letterSpacing: '-0.3px',
                boxShadow: '0 0 32px var(--border-green)',
            }}>
                Criar conta gratuita →
            </button>
            <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-tertiary)' }}>
                Sem cartão de crédito · Cancele quando quiser · Dados protegidos
            </div>
        </section>
    );
}
