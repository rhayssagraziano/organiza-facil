import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyAvatar } from '../gamification/PiggyAvatar';

const GAMIFICATION_ITEMS = [
    { icon: '⭐', title: 'Sistema de XP', desc: 'Ganhe pontos a cada depósito e suba de nível.' },
    { icon: '🏆', title: 'Marcos de conquista', desc: 'Desbloqueie recompensas em 25%, 50%, 75% e 100%.' },
    { icon: '🔥', title: 'Streak de consistência', desc: 'Mantenha sequências diárias e multiplique seu progresso.' },
    { icon: '🎮', title: 'Mini-games', desc: 'Jogue CoinCatch e PiggyRunner após cada depósito.' },
    { icon: '🐷', title: 'Avatar personalizável', desc: 'Vista seu porquinho com chapéus, óculos e acessórios.' },
    { icon: '🎉', title: 'Celebração de metas', desc: 'Confetes e animações quando você bate seu objetivo.' },
];

export function GamificationSection() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <section style={{ padding: isMobile ? '60px 20px' : '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 20, padding: '4px 12px', fontSize: 12, color: 'var(--gold)',
                    fontWeight: 700, marginBottom: 16,
                }}>
                    🎮 Gamificação financeira
                </div>
                <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, margin: '0 0 12px', color: '#F1F5F9' }}>
                    Poupar nunca foi tão divertido
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: 0 }}>
                    Cada depósito vira uma aventura. Evolua seu avatar e desbloqueie recompensas.
                </p>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
                gap: 14,
            }}>
                {GAMIFICATION_ITEMS.map(item => (
                    <div key={item.title} style={{
                        background: 'var(--bg-card)',
                        border: '1px solid rgba(245,158,11,0.12)',
                        borderRadius: 12, padding: '16px 18px',
                    }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: 48,
                background: 'var(--bg-card)',
                border: '1px solid rgba(34,197,94,0.15)',
                borderRadius: 16, padding: '32px 24px',
                display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center', gap: 32,
            }}>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    {[
                        { skinColor: '#22C55E', hat: null, glasses: null, neck: null, chest: 'coin' as const },
                        { skinColor: '#F59E0B', hat: 'coroa' as const, glasses: 'sol' as const, neck: 'corrente' as const, chest: 'coin' as const },
                        { skinColor: '#818CF8', hat: 'magico' as const, glasses: 'estrela' as const, neck: 'flores' as const, chest: 'coin' as const },
                    ].map((cfg, i) => (
                        <div key={i} style={{ animation: `float ${2.5 + i * 0.5}s ease-in-out infinite alternate` }}>
                            <PiggyAvatar size={80} config={cfg} animated />
                        </div>
                    ))}
                </div>
                <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                        Personalize seu avatar
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 16px' }}>
                        Escolha cor de pele, chapéus, óculos, colares e acessórios especiais. Desbloqueie itens ao alcançar novos níveis.
                    </p>
                    <button onClick={() => navigate('/cadastro')} style={{
                        padding: '9px 20px', background: 'var(--green-glow)',
                        border: '1px solid rgba(34,197,94,0.3)',
                        borderRadius: 8, color: 'var(--green-neon)', fontSize: 13, fontWeight: 700,
                        cursor: 'pointer',
                    }}>
                        Criar meu porquinho →
                    </button>
                </div>
            </div>
        </section>
    );
}
