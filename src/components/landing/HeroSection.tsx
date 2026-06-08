import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';

export function HeroSection() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <section style={{
            minHeight: '100vh', paddingTop: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '100px 20px 60px' : '120px 40px 80px',
            maxWidth: 1100, margin: '0 auto',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 40 : 60,
        }}>
            {/* Coluna esquerda */}
            <div style={{ flex: 1, maxWidth: 520 }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: 20, padding: '4px 12px', fontSize: 12, color: 'var(--green-neon)',
                    fontWeight: 700, marginBottom: 20,
                }}>
                    🚀 100% gratuito · Sem cartão de crédito
                </div>
                <h1 style={{
                    fontSize: isMobile ? 34 : 48, fontWeight: 900, lineHeight: 1.15,
                    margin: '0 0 20px', color: 'var(--text-primary)',
                }}>
                    Organize suas finanças{' '}
                    <span style={{ color: 'var(--green-neon)' }}>de forma inteligente</span>
                </h1>
                <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 32px', maxWidth: 440 }}>
                    Controle receitas, despesas e objetivos de poupança enquanto se diverte com gamificação. Seu porquinho de poupança vai agradecer.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/cadastro')} style={{
                        padding: '13px 28px', background: 'var(--green-neon)', border: 'none',
                        borderRadius: 10, color: '#000', fontSize: 15, fontWeight: 900,
                        cursor: 'pointer', letterSpacing: '-0.3px',
                    }}>
                        Começar agora →
                    </button>
                    <button onClick={() => navigate('/login')} style={{
                        padding: '13px 24px', background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10,
                        color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    }}>
                        Já tenho conta
                    </button>
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 28 }}>
                    {[['✅', 'Grátis para sempre'], ['🔒', 'Dados seguros'], ['📱', 'Funciona no celular']].map(([icon, text]) => (
                        <div key={text as string} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
                            <span>{icon}</span><span>{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coluna direita — Logo piggy + floating cards */}
            {!isMobile && (
                <div style={{ flex: 1, maxWidth: 400, position: 'relative', height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ animation: 'float 3s ease-in-out infinite alternate' }}>
                        <Logo size={220} />
                    </div>
                    {/* Floating card 1 */}
                    <div style={{
                        position: 'absolute', top: 30, left: 0,
                        background: 'var(--bg-card)', border: '1px solid var(--border-green)',
                        borderRadius: 12, padding: '10px 14px', fontSize: 12, minWidth: 140,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                        animation: 'float 3.4s ease-in-out infinite alternate',
                    }}>
                        <div style={{ color: 'var(--green-neon)', fontWeight: 700, marginBottom: 2 }}>⭐ +180 XP</div>
                        <div style={{ color: 'var(--text-secondary)' }}>Marco 50% atingido!</div>
                    </div>
                    {/* Floating card 2 */}
                    <div style={{
                        position: 'absolute', bottom: 50, right: 0,
                        background: 'var(--bg-card)', border: '1px solid rgba(245,158,11,0.25)',
                        borderRadius: 12, padding: '10px 14px', fontSize: 12, minWidth: 140,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                        animation: 'float 2.8s ease-in-out infinite alternate',
                    }}>
                        <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 2 }}>🎯 Viagem Europa</div>
                        <div style={{ color: 'var(--text-secondary)' }}>R$ 4.200 / R$ 8.000</div>
                    </div>
                    {/* Floating card 3 */}
                    <div style={{
                        position: 'absolute', top: 120, right: -10,
                        background: 'var(--bg-card)', border: '1px solid rgba(129,140,248,0.25)',
                        borderRadius: 12, padding: '10px 14px', fontSize: 12, minWidth: 120,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                        animation: 'float 3.8s ease-in-out infinite alternate',
                    }}>
                        <div style={{ color: '#818CF8', fontWeight: 700, marginBottom: 2 }}>🔥 7 dias</div>
                        <div style={{ color: 'var(--text-secondary)' }}>Sequência ativa!</div>
                    </div>
                </div>
            )}
        </section>
    );
}
