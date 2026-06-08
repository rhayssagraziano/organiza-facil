import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/ui/Layout';
import { listarReceitasPorUsuario, criarReceita, deletarReceita } from '../services/receitaService';
import type { Receita } from '../types';
import { fmt, todayISO as today } from '../utils/format';

const card: React.CSSProperties = {
    background: 'var(--bg2)', border: '1px solid var(--borda)',
    borderRadius: 12, padding: 16,
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    background: 'var(--bg3)', border: '1px solid var(--borda)',
    borderRadius: 8, color: 'var(--txt)', fontSize: 13,
};

const tipoLabel: Record<string, string> = {
    SALARIO: 'Salário',
    FREELANCE: 'Freelance',
    INVESTIMENTO: 'Investimento',
};

const ReceitasPage = () => {
    const { usuario } = useAuth();
    const [receitas, setReceitas] = useState<Receita[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [erro, setErro] = useState('');
    const [form, setForm] = useState({ descricao: '', valor: '', tipo: 'SALARIO', outrosLabel: '' });

    const fetchReceitas = async () => {
        if (!usuario?.id) return;
        try {
            const data = await listarReceitasPorUsuario(usuario.id);
            setReceitas(data);
        } catch {
            setErro('Erro ao carregar receitas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReceitas(); }, [usuario]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.descricao.trim() || !form.valor.trim()) { setErro('Preencha descrição e valor.'); return; }
        if (form.tipo === 'OUTROS' && !form.outrosLabel.trim()) { setErro('Descreva o tipo de receita em "Outros".'); return; }
        setSaving(true);
        setErro('');
        try {
            await criarReceita({
                descricao: form.descricao.trim(),
                valor: parseFloat(form.valor),
                data: today(),
                tipo: form.tipo === 'OUTROS' ? form.outrosLabel.trim() : form.tipo,
                usuario: { id: usuario?.id as number },
            });
            setForm({ descricao: '', valor: '', tipo: 'SALARIO', outrosLabel: '' });
            await fetchReceitas();
        } catch {
            setErro('Erro ao salvar receita.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number | undefined) => {
        if (!id) return;
        try {
            await deletarReceita(id);
            setReceitas(prev => prev.filter(r => r.id !== id));
        } catch {
            setErro('Erro ao excluir receita.');
        }
    };

    const total = receitas.reduce((acc, r) => acc + r.valor, 0);
    const maior = receitas.length > 0 ? Math.max(...receitas.map(r => r.valor)) : 0;

    return (
        <Layout>
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', margin: '0 0 4px' }}>Receitas</h1>
                <p style={{ color: 'var(--txt3)', fontSize: 13, margin: 0 }}>Gerencie suas fontes de renda</p>
            </div>

            {erro && (
                <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, color: 'var(--vermelho)', fontSize: 13 }}>
                    {erro}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
                {[
                    { label: 'Total receitas', value: fmt(total), color: 'var(--verde)' },
                    { label: 'Fontes ativas', value: receitas.length.toString(), color: 'var(--txt)' },
                    { label: 'Maior fonte', value: maior > 0 ? fmt(maior) : '—', color: 'var(--amarelo)' },
                ].map(sc => (
                    <div key={sc.label} style={card}>
                        <div style={{ fontSize: 11, color: 'var(--txt3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>{sc.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 500, color: sc.color }}>{sc.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={card}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 14 }}>Fontes de renda</div>
                    {loading ? (
                        <div style={{ color: 'var(--txt3)', fontSize: 13 }}>Carregando...</div>
                    ) : receitas.length === 0 ? (
                        <div style={{ color: 'var(--txt3)', fontSize: 13 }}>Nenhuma receita cadastrada.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {receitas.map(r => (
                                <div key={r.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '10px 12px', background: 'var(--bg3)',
                                    borderRadius: 10, border: '1px solid var(--borda)',
                                }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: 'var(--verde-bg)', border: '1px solid var(--verde-borda)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--verde)', flexShrink: 0,
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                                        </svg>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {r.descricao}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 2 }}>
                                            <span style={{
                                                background: 'var(--verde-bg)', color: 'var(--verde)',
                                                borderRadius: 4, padding: '1px 6px', fontSize: 10,
                                            }}>{tipoLabel[r.tipo] ?? r.tipo}</span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--verde)', flexShrink: 0 }}>
                                        {fmt(r.valor)}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(r.id)}
                                        style={{ background: 'none', border: 'none', color: 'var(--txt3)', cursor: 'pointer', fontSize: 16, padding: '0 2px', flexShrink: 0 }}
                                        title="Excluir"
                                    >×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={card}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 14 }}>Nova receita</div>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div>
                            <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Descrição</label>
                            <input
                                placeholder="Ex: Salário mensal"
                                value={form.descricao}
                                onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Valor (R$)</label>
                            <input
                                placeholder="0,00"
                                type="number"
                                step="0.01"
                                value={form.valor}
                                onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Tipo</label>
                            <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value, outrosLabel: '' }))} style={inputStyle}>
                                <option value="SALARIO">Salário CLT</option>
                                <option value="FREELANCE">Freelance</option>
                                <option value="INVESTIMENTO">Investimento</option>
                                <option value="OUTROS">Outros</option>
                            </select>
                        </div>
                        {form.tipo === 'OUTROS' && (
                            <div>
                                <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Qual tipo de receita?</label>
                                <input
                                    placeholder="Ex: Aluguel, Pensão, Bônus..."
                                    value={form.outrosLabel}
                                    onChange={e => setForm(f => ({ ...f, outrosLabel: e.target.value }))}
                                    style={inputStyle}
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                marginTop: 4, padding: '10px 16px',
                                background: 'var(--verde)', color: '#0f1117',
                                border: 'none', borderRadius: 8, fontSize: 13,
                                fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {saving ? 'Salvando...' : 'Salvar receita'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ReceitasPage;
