import type { Objetivo } from '../../types';
import { getNextMilestone, getObjetivoIcon } from '../../utils/gamification';
import { fmt } from '../../utils/format';

interface Props {
    objetivo: Objetivo;
    milestonesDone: number[];
    streak: number;
    onDeposit: (objetivo: Objetivo) => void;
    onDelete: (id: number) => void;
}

export function GoalCard({ objetivo: o, milestonesDone: done, streak, onDeposit, onDelete }: Props) {
    const pct = o.valorMeta > 0 ? Math.min((o.valorAtual / o.valorMeta) * 100, 100) : 0;
    const next = getNextMilestone(o, done);
    const icon = getObjetivoIcon(o.nome);
    const isHighlight = pct >= 75 && pct < 100;

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: isHighlight ? '1px solid var(--green-neon)' : '1px solid var(--border)',
            boxShadow: isHighlight ? '0 0 16px rgba(34,197,94,0.12)' : 'none',
            borderRadius: 12, padding: 14,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: 'var(--green-glow)', border: '1px solid rgba(34,197,94,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0,
                }}>
                    {icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {o.nome}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{o.prazoMeses} meses</div>
                </div>
                <button onClick={() => o.id && onDelete(o.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 16, padding: '0 2px', flexShrink: 0 }}
                    title="Excluir">×</button>
            </div>

            {/* Barra de Progresso */}
            <div style={{ position: 'relative', marginBottom: 8 }}>
                <div style={{ background: 'var(--bg-element)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                    <div style={{
                        width: `${pct}%`, height: '100%',
                        background: pct >= 100 ? 'var(--gold)' : 'var(--green-neon)',
                        borderRadius: 6, transition: 'width 0.8s ease',
                    }} />
                </div>
                <div style={{ position: 'absolute', top: -3, left: 0, right: 0, height: 14, pointerEvents: 'none' }}>
                    {[25, 50, 75, 100].map(m => (
                        <div key={m} style={{
                            position: 'absolute', left: `${m}%`, transform: 'translateX(-50%)',
                            width: 14, height: 14, borderRadius: '50%',
                            background: done.includes(m) ? 'var(--gold)' : pct >= m ? 'var(--gold)' : 'var(--bg-element)',
                            border: `2px solid ${done.includes(m) || pct >= m ? 'var(--gold)' : 'var(--text-tertiary)'}`,
                            transition: 'background 0.4s, border-color 0.4s',
                        }} />
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {fmt(o.valorAtual)} / {fmt(o.valorMeta)}
                </span>
                <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: pct >= 100 ? 'var(--gold)' : 'var(--green-neon)',
                    background: pct >= 100 ? 'rgba(245,158,11,0.12)' : 'var(--green-glow)',
                    borderRadius: 20, padding: '2px 8px',
                }}>
                    {pct.toFixed(0)}%
                </span>
            </div>

            {next && (
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 20, padding: '3px 10px', fontSize: 11, color: 'var(--gold)',
                    marginBottom: 8,
                }}>
                    ⭐ +{next.xp} XP no próximo marco ({next.pct}%)
                </div>
            )}

            {streak > 0 && (
                <div style={{ fontSize: 11, color: 'var(--danger)', marginBottom: 8 }}>
                    🔥 {streak} dia{streak > 1 ? 's' : ''} consecutivo{streak > 1 ? 's' : ''}
                </div>
            )}

            <button
                onClick={() => onDeposit(o)}
                style={{
                    width: '100%', padding: '8px 12px',
                    background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: 8, color: 'var(--green-neon)', fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
            >
                <span>💰</span> Depositar & resgatar pontos
            </button>
        </div>
    );
}
