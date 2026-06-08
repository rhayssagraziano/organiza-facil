import { useEffect, useState } from 'react';

export function ScoreSection() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <section style={{
            padding: isMobile ? '60px 20px' : '80px 40px',
            background: '#0A0E15',
        }}>
            <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 48, alignItems: 'center' }}>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <svg width={180} height={180} viewBox="0 0 120 120">
                        <circle cx={60} cy={60} r={50} fill="none" stroke="#1E2533" strokeWidth={10} />
                        <circle cx={60} cy={60} r={50} fill="none" stroke="#22C55E" strokeWidth={10}
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 50 * 0.74} ${2 * Math.PI * 50}`}
                            transform="rotate(-90 60 60)" />
                        <text x={60} y={55} textAnchor="middle" fill="#F1F5F9" fontSize={22} fontWeight={800}>714</text>
                        <text x={60} y={72} textAnchor="middle" fill="#22C55E" fontSize={10} fontWeight={700}>BOM</text>
                    </svg>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>Score financeiro exemplo</div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'var(--green-glow)', border: '1px solid rgba(34,197,94,0.3)',
                        borderRadius: 20, padding: '4px 12px', fontSize: 12, color: 'var(--green-neon)',
                        fontWeight: 700, marginBottom: 16,
                    }}>
                        📊 Score financeiro
                    </div>
                    <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, margin: '0 0 12px', color: '#F1F5F9' }}>
                        Saiba exatamente onde você está
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 20px' }}>
                        O OrganizaFácil calcula seu score financeiro semanalmente com base em suas receitas, despesas, economia e cumprimento de metas. Acompanhe sua evolução e receba dicas personalizadas.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            ['🟢', 'Acima de 700', 'Saúde financeira excelente'],
                            ['🟡', 'Entre 500–699', 'Boa, com espaço para melhorar'],
                            ['🔴', 'Abaixo de 500', 'Atenção: hora de agir'],
                        ].map(([dot, range, label]) => (
                            <div key={range as string} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                                <span>{dot}</span>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{range}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>— {label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
