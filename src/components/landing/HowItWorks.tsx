import { useEffect, useState, Fragment } from 'react';

const STEPS = [
    { num: '01', title: 'Crie sua conta', desc: 'Cadastro gratuito em menos de 1 minuto. Sem cartão de crédito.' },
    { num: '02', title: 'Configure seu perfil', desc: 'Informe sua renda e primeiras despesas no onboarding guiado.' },
    { num: '03', title: 'Defina seus objetivos', desc: 'Adicione metas de poupança e comece a depositar.' },
    { num: '04', title: 'Acompanhe e evolua', desc: 'Jogue mini-games, suba de nível e bata seus marcos.' },
];

export function HowItWorks() {
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
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, margin: '0 0 12px', color: '#F1F5F9' }}>
                        Como funciona
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: 0 }}>Em 4 passos simples você já está no controle.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {STEPS.map((step, i) => (
                        <Fragment key={step.num}>
                            <div style={{
                                display: 'flex', gap: 20, alignItems: 'flex-start',
                                padding: '20px 0',
                            }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                                    background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 13, fontWeight: 800, color: 'var(--green-neon)',
                                }}>
                                    {step.num}
                                </div>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{step.title}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</div>
                                </div>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div style={{ width: 1, height: 20, background: 'rgba(34,197,94,0.2)', marginLeft: 23 }} />
                            )}
                        </Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}
