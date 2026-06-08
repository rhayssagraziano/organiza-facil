import { useEffect, useState } from 'react';

const FEATURES = [
    { icon: '📊', title: 'Dashboard inteligente', desc: 'Visão completa da sua saúde financeira em tempo real.' },
    { icon: '💸', title: 'Controle de despesas', desc: 'Categorize e acompanhe cada centavo que sai.' },
    { icon: '💰', title: 'Registro de receitas', desc: 'Organize todas as suas fontes de renda com facilidade.' },
    { icon: '🎯', title: 'Objetivos de poupança', desc: 'Crie metas e deposite progressivamente até conquistá-las.' },
    { icon: '🗺️', title: 'Plano de ação', desc: 'Receba sugestões personalizadas para melhorar suas finanças.' },
    { icon: '📈', title: 'Score financeiro', desc: 'Monitore sua pontuação e evolua semana a semana.' },
];

export function FeaturesSection() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <section style={{ padding: isMobile ? '60px 20px' : '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, margin: '0 0 12px', color: '#F1F5F9' }}>
                    Tudo que você precisa em um só lugar
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: 0 }}>
                    Ferramentas simples e poderosas para dominar sua vida financeira.
                </p>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: 16,
            }}>
                {FEATURES.map(f => (
                    <div key={f.title} style={{
                        background: '#161B24', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 14, padding: '20px 22px',
                        transition: 'border-color 0.2s',
                    }}>
                        <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{f.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
