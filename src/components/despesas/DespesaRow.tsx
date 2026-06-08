import type { Despesa } from '../../types';
import { fmt } from '../../utils/format';

const tipoColor: Record<string, string> = {
    FIXA: 'var(--danger)',
    VARIAVEL: 'var(--gold)',
    DIVIDA: '#A78BFA',
    PARCELA: '#A78BFA',
};

const tipoLabel: Record<string, string> = {
    FIXA: 'Fixa',
    VARIAVEL: 'Variável',
    DIVIDA: 'Dívida',
    PARCELA: 'Parcela',
};

interface Props {
    d: Despesa;
    onDelete: (id: number | undefined) => void;
}

export function DespesaRow({ d, onDelete }: Props) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', background: 'var(--bg-element)',
            borderRadius: 10, border: '1px solid var(--border)',
        }}>
            <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(248,113,113,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: tipoColor[d.tipo] ?? 'var(--text-tertiary)', flexShrink: 0,
            }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M20 2H8l-6 6v12a2 2 0 002 2h16a2 2 0 002-2V2z" />
                </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.descricao}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    <span style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: tipoColor[d.tipo] ?? 'var(--text-tertiary)',
                        borderRadius: 4, padding: '1px 6px', fontSize: 10,
                    }}>{tipoLabel[d.tipo] ?? d.tipo}</span>
                    {d.diaVencimento ? <span style={{ marginLeft: 6 }}>vence dia {d.diaVencimento}</span> : null}
                </div>
                {d.totalParcelas && (
                    <div style={{ marginTop: 6 }}>
                        <div style={{ background: 'var(--bg-hover)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                            <div style={{
                                width: `${Math.min(((d.parcelaAtual ?? 0) / d.totalParcelas) * 100, 100)}%`,
                                height: '100%', background: '#A78BFA', borderRadius: 4,
                            }} />
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
                            {d.parcelaAtual ?? 0}/{d.totalParcelas} parcelas
                        </div>
                    </div>
                )}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: tipoColor[d.tipo] ?? 'var(--text-primary)', flexShrink: 0 }}>
                {fmt(d.valor)}
            </div>
            <button
                onClick={() => onDelete(d.id)}
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 16, padding: '0 2px', flexShrink: 0 }}
                title="Excluir"
            >×</button>
        </div>
    );
}
