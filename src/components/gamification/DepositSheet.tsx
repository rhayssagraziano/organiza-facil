import { useState } from 'react';
import type { Objetivo } from '../../types';
import { calcXP, PRESETS } from '../../utils/gamification';
import { fmt } from '../../utils/format';

interface Props {
    objetivo: Objetivo;
    onSave: (valor: number) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export function DepositSheet({ objetivo, onSave, onClose, saving }: Props) {
    const [depositVal, setDepositVal] = useState('');
    const [presetAtivo, setPresetAtivo] = useState<number | null>(null);

    const xpPreview = depositVal && parseFloat(depositVal) > 0 ? calcXP(parseFloat(depositVal)) : 0;
    const valorNum = parseFloat(depositVal);
    const valid = depositVal && valorNum > 0;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'flex-end', zIndex: 1000,
            animation: 'fadeIn 0.2s ease',
        }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{
                width: '100%', maxWidth: 540, margin: '0 auto',
                background: 'var(--bg-card)', borderRadius: '20px 20px 0 0',
                padding: '12px 20px 32px', animation: 'sheetUp 0.3s ease',
            }}>
                <div style={{ width: 36, height: 4, background: 'var(--bg-element)', borderRadius: 4, margin: '0 auto 16px' }} />

                <div style={{
                    background: 'var(--bg-element)', borderLeft: '3px solid var(--green-neon)',
                    borderRadius: '0 10px 10px 0', padding: '10px 14px', marginBottom: 16,
                }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{objetivo.nome}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {fmt(objetivo.valorAtual)} de {fmt(objetivo.valorMeta)} ·{' '}
                        {objetivo.valorMeta > 0 ? ((objetivo.valorAtual / objetivo.valorMeta) * 100).toFixed(0) : 0}% concluído
                    </div>
                </div>

                <label style={{ fontSize: 11, color: '#8890A6', display: 'block', marginBottom: 6 }}>Valor do depósito (R$)</label>
                <input
                    type="number" step="0.01" placeholder="0,00"
                    value={depositVal}
                    onChange={e => { setDepositVal(e.target.value); setPresetAtivo(null); }}
                    style={{
                        width: '100%', padding: '12px 14px', fontSize: 22, fontWeight: 700,
                        background: 'var(--bg-element)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10, color: 'var(--text-primary)', textAlign: 'center',
                        boxSizing: 'border-box', marginBottom: 12,
                    }}
                    autoFocus
                />

                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    {PRESETS.map(p => (
                        <button key={p} onClick={() => { setDepositVal(String(p)); setPresetAtivo(p); }}
                            style={{
                                flex: 1, padding: '7px 4px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.15s',
                                background: presetAtivo === p ? 'rgba(34,197,94,0.12)' : 'var(--bg-element)',
                                border: presetAtivo === p ? '1px solid var(--green-neon)' : '1px solid rgba(255,255,255,0.08)',
                                color: presetAtivo === p ? 'var(--green-neon)' : 'var(--text-secondary)',
                            }}>
                            R${p}
                        </button>
                    ))}
                </div>

                {xpPreview > 0 && (
                    <div style={{
                        background: 'var(--gold-glow)', border: '1px solid var(--border-gold)',
                        borderRadius: 10, padding: '10px 14px', marginBottom: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <span style={{ fontSize: 12, color: 'var(--gold)' }}>⭐ XP estimado neste depósito</span>
                        <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--gold-light)' }}>+{xpPreview} XP</span>
                    </div>
                )}

                <button
                    onClick={() => valid && onSave(valorNum)}
                    disabled={saving || !valid}
                    style={{
                        width: '100%', padding: '13px', background: 'var(--green-neon)', color: '#000',
                        border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 900,
                        cursor: saving || !valid ? 'not-allowed' : 'pointer',
                        opacity: !valid ? 0.5 : 1,
                    }}>
                    {saving ? 'Salvando...' : '💰 Depositar & jogar agora!'}
                </button>
            </div>
        </div>
    );
}
