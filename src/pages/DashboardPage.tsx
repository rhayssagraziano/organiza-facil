import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/ui/Layout';
import { gerarDashboard } from '../services/dashboardService';
import usePlanoAcao from '../hooks/usePlanoAcao';
import { listarObjetivosPorUsuario } from '../services/objetivoService';
import { listarDespesasPorUsuario } from '../services/despesaService';
import { downloadICS } from '../utils/ics';
import type { DashboardDTO, Objetivo, Despesa } from '../types';
import { fmt } from '../utils/format';
import { scoreColor, scoreBg } from '../utils/score';

const card: React.CSSProperties = {
    background: 'var(--bg2)', border: '1px solid var(--borda)',
    borderRadius: 12, padding: 14,
};

const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const DashboardPage = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
    const [dashDespesas, setDashDespesas] = useState<Despesa[]>([]);

    useEffect(() => {
        if (!usuario?.id) { setLoading(false); setErro('ID de usuário não encontrado.'); return; }
        gerarDashboard(usuario.id)
            .then(setData)
            .catch(() => setErro('Não foi possível carregar os dados. Verifique o servidor.'))
            .finally(() => setLoading(false));
        listarObjetivosPorUsuario(usuario.id).then(setObjetivos).catch(() => { });
        listarDespesasPorUsuario(usuario.id).then(setDashDespesas).catch(() => { });
    }, [usuario]);

    const planoItems = usePlanoAcao(data, objetivos);
    const [icsMsg, setIcsMsg] = useState('');

    const handleDownloadICS = () => {
        const ok = downloadICS(dashDespesas);
        setIcsMsg(ok
            ? '✓ Arquivo baixado! Abra-o para importar no Google Agenda, Outlook ou Apple Calendar.'
            : 'Nenhuma despesa com data de vencimento cadastrada.'
        );
    };

    return (
        <Layout>
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', margin: '0 0 4px' }}>Dashboard</h1>
                <p style={{ color: 'var(--txt3)', fontSize: 13, margin: 0, textTransform: 'capitalize' }}>{today}</p>
            </div>

            {loading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
                    <span style={{ color: 'var(--txt3)', fontSize: 14 }}>Carregando dados financeiros...</span>
                </div>
            )}

            {erro && !loading && (
                <div style={{ padding: '16px 20px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 12, color: 'var(--vermelho)', fontSize: 14 }}>
                    {erro}
                </div>
            )}

            {data && !loading && (
                <>
                    {/* Saldo */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, color: 'var(--txt3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 6 }}>
                            SALDO DISPONÍVEL
                        </div>
                        <div style={{ fontSize: 38, fontWeight: 700, color: 'var(--txt)', lineHeight: 1, marginBottom: 8 }}>
                            {fmt(data.saldoDisponivel)}
                        </div>
                        <span style={{
                            fontSize: 12, fontWeight: 700,
                            color: scoreColor(data.score),
                            background: scoreBg(data.score),
                            borderRadius: 20, padding: '3px 10px',
                            display: 'inline-block',
                        }}>
                            {data.score} {data.classificacaoScore}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 12 }}>
                        {[
                            { label: 'Receitas', value: fmt(data.totalReceitas), color: 'var(--verde)' },
                            { label: 'Despesas', value: fmt(data.totalDespesasFixas + data.totalDespesasVariaveis), color: 'var(--vermelho)' },
                            { label: 'Dívidas', value: fmt(data.totalDividas), color: 'var(--amarelo)' },
                        ].map(sc => (
                            <div key={sc.label} style={card}>
                                <div style={{ fontSize: 11, color: 'var(--txt3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>{sc.label}</div>
                                <div style={{ fontSize: 20, fontWeight: 500, color: sc.color }}>{sc.value}</div>
                            </div>
                        ))}
                    </div>

                    {(() => {
                        const rec = data.totalReceitas;
                        const necVal = (data.atualNecessidades ?? 0) + (data.totalDividas ?? 0);
                        const desVal = data.atualDesejos ?? 0;
                        const invVal = data.atualInvestimentos ?? 0;
                        const pctNec = rec > 0 ? Math.round((necVal / rec) * 100) : 0;
                        const pctDes = rec > 0 ? Math.round((desVal / rec) * 100) : 0;
                        const pctInv = rec > 0 ? Math.round((invVal / rec) * 100) : 0;
                        const cats = [
                            { name: 'Necessidades', pctIdeal: 50, pctAtual: pctNec, ideal: data.idealNecessidades, atual: necVal, color: '#60a5fa', isInvestment: false },
                            { name: 'Desejos', pctIdeal: 30, pctAtual: pctDes, ideal: data.idealDesejos, atual: desVal, color: 'var(--roxo)', isInvestment: false },
                            { name: 'Investimentos', pctIdeal: 20, pctAtual: pctInv, ideal: data.idealInvestimentos, atual: invVal, color: 'var(--verde)', isInvestment: true },
                        ];
                        return (
                            <div style={{ ...card, marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>Regra 50/30/20</div>
                                        <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 2 }}>Comparando sua renda ({fmt(rec)}) com o ideal</div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                                    {cats.map(c => {
                                        const diff = c.atual - c.ideal;
                                        const over = c.isInvestment ? diff < 0 : diff > 0;
                                        const diffColor = over ? 'var(--vermelho)' : 'var(--verde)';
                                        const barPct = Math.min(c.pctAtual, 100);
                                        return (
                                            <div key={c.name} style={{ background: 'var(--bg3)', borderRadius: 10, padding: 12 }}>
                                                <div style={{ fontSize: 11, color: 'var(--txt3)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                                                    {c.name} ({c.pctIdeal}%)
                                                </div>
                                                <div style={{ fontSize: 13, color: 'var(--txt2)', marginBottom: 2 }}>
                                                    <span style={{ color: 'var(--txt3)' }}>Ideal: </span>{fmt(c.ideal)}
                                                </div>
                                                <div style={{ fontSize: 15, fontWeight: 700, color: c.color, marginBottom: 8 }}>
                                                    Atual: {fmt(c.atual)}
                                                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--txt3)', marginLeft: 4 }}>{c.pctAtual}%</span>
                                                </div>
                                                <div style={{ background: 'var(--bg4, var(--bg2))', borderRadius: 4, height: 5, overflow: 'hidden', marginBottom: 6 }}>
                                                    <div style={{ width: `${barPct}%`, height: '100%', background: c.color, borderRadius: 4, transition: 'width .8s' }} />
                                                </div>
                                                <div style={{ fontSize: 11, color: over ? 'var(--vermelho)' : diffColor }}>
                                                    {Math.abs(diff) < 1
                                                        ? '✓ No ideal'
                                                        : diff > 0
                                                            ? `+${fmt(diff)} acima do ideal`
                                                            : `${fmt(Math.abs(diff))} abaixo do ideal`}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 14 }}>Distribuição da renda</div>
                            {(() => {
                                const rec = data.totalReceitas;
                                if (rec <= 0) return <div style={{ color: 'var(--txt3)', fontSize: 13 }}>Cadastre receitas para ver a distribuição.</div>;
                                const necPct = Math.min((data.atualNecessidades / rec) * 100, 100);
                                const divPct = Math.min((data.totalDividas / rec) * 100, 100 - necPct);
                                const desPct = Math.min((data.atualDesejos / rec) * 100, 100 - necPct - divPct);
                                const invPct = Math.max(0, Math.min((data.atualInvestimentos / rec) * 100, 100 - necPct - divPct - desPct));
                                const r = 34; const cx = 55; const cy = 55;
                                const circ = 2 * Math.PI * r;
                                const seg = (pct: number) => (pct / 100) * circ;
                                const necL = seg(necPct); const divL = seg(divPct);
                                const desL = seg(desPct); const invL = seg(invPct);
                                const off = (prev: number) => -(prev);
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                        <svg width="110" height="110" viewBox="0 0 110 110" style={{ flexShrink: 0 }}>
                                            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg3)" strokeWidth="11" />
                                            {necPct > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#60a5fa" strokeWidth="11"
                                                strokeDasharray={`${necL} ${circ}`} strokeDashoffset={off(0)} transform={`rotate(-90 ${cx} ${cy})`} />}
                                            {divPct > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--amarelo)" strokeWidth="11"
                                                strokeDasharray={`${divL} ${circ}`} strokeDashoffset={off(necL)} transform={`rotate(-90 ${cx} ${cy})`} />}
                                            {desPct > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--roxo)" strokeWidth="11"
                                                strokeDasharray={`${desL} ${circ}`} strokeDashoffset={off(necL + divL)} transform={`rotate(-90 ${cx} ${cy})`} />}
                                            {invPct > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--verde)" strokeWidth="11"
                                                strokeDasharray={`${invL} ${circ}`} strokeDashoffset={off(necL + divL + desL)} transform={`rotate(-90 ${cx} ${cy})`} />}
                                            <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--txt)" fontSize="10" fontWeight="600">Saldo</text>
                                            <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--verde)" fontSize="11" fontWeight="700">
                                                {Math.round(invPct)}%
                                            </text>
                                        </svg>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                                            {[
                                                { label: 'Fixas', color: '#60a5fa', val: data.atualNecessidades, pct: necPct },
                                                { label: 'Dívidas', color: 'var(--amarelo)', val: data.totalDividas, pct: divPct },
                                                { label: 'Variáveis', color: 'var(--roxo)', val: data.atualDesejos, pct: desPct },
                                                { label: 'Saldo livre', color: 'var(--verde)', val: data.atualInvestimentos, pct: invPct },
                                            ].map(l => (
                                                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                                                    <span style={{ fontSize: 11, color: 'var(--txt3)', flex: 1 }}>{l.label}</span>
                                                    <span style={{ fontSize: 11, color: 'var(--txt2)', fontWeight: 600 }}>{Math.round(l.pct)}%</span>
                                                    <span style={{ fontSize: 10, color: 'var(--txt3)' }}>{fmt(l.val)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 16, width: '100%' }}>Score financeiro</div>
                            {(() => {
                                const r = 40;
                                const circ = 2 * Math.PI * r;
                                const pct = Math.min(data.score / 1000, 1);
                                const filled = pct * circ;
                                const color = scoreColor(data.score);
                                return (
                                    <svg width="100" height="100" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg3)" strokeWidth="8" />
                                        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
                                            strokeDasharray={`${filled} ${circ - filled}`}
                                            strokeDashoffset={0}
                                            transform="rotate(-90 50 50)"
                                            strokeLinecap="round"
                                        />
                                        <text x="50" y="54" textAnchor="middle" fill={color} fontSize="18" fontWeight="700">{data.score}</text>
                                    </svg>
                                );
                            })()}
                            <div style={{ fontSize: 14, fontWeight: 700, color: scoreColor(data.score), marginTop: 8 }}>
                                {data.classificacaoScore}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div style={card}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>Plano de Ação</div>
                            </div>
                            {planoItems.length === 0 ? (
                                <div style={{ color: 'var(--txt3)', fontSize: 13 }}>
                                    Continue cadastrando suas finanças para gerar um plano personalizado.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                    {planoItems.slice(0, 4).map(item => (
                                        <div key={item.id} style={{
                                            borderLeft: `3px solid ${item.color}`,
                                            padding: '8px 10px',
                                            background: 'var(--bg3)',
                                            borderRadius: '0 8px 8px 0',
                                        }}>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt)' }}>{item.titulo}</div>
                                            <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 2, lineHeight: 1.3 }}>{item.descricao}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={() => navigate('/plano-acao')}
                                style={{
                                    marginTop: 12, background: 'none', border: 'none',
                                    color: 'var(--verde)', fontSize: 12, cursor: 'pointer',
                                    padding: 0, fontWeight: 600,
                                }}
                            >
                                Ver plano completo →
                            </button>
                        </div>

                        {/* Lembretes */}
                        <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 6 }}>Lembretes de Vencimento</div>
                            <div style={{ fontSize: 12, color: 'var(--txt3)', flex: 1, lineHeight: 1.5, marginBottom: 12 }}>
                                Baixe um arquivo .ics com todos os vencimentos e importe no Google Agenda, Outlook ou Apple Calendar.
                            </div>
                            <button
                                onClick={handleDownloadICS}
                                style={{
                                    padding: '9px 14px',
                                    background: 'rgba(74,222,128,0.1)',
                                    border: '1px solid rgba(74,222,128,0.25)',
                                    borderRadius: 8, color: 'var(--verde)',
                                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                Baixar lembretes (.ics)
                            </button>
                            {icsMsg && (
                                <div style={{ marginTop: 8, fontSize: 11, color: icsMsg.startsWith('✓') ? 'var(--verde)' : 'var(--vermelho)' }}>
                                    {icsMsg}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sugestões — largura total */}
                    <div style={{ ...card, marginTop: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 12 }}>Sugestões</div>
                        {data.sugestoes.length === 0 ? (
                            <div style={{ color: 'var(--txt3)', fontSize: 13 }}>Nenhuma sugestão no momento. Continue assim!</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {data.sugestoes.map((s, i) => (
                                    <div key={i} style={{
                                        borderLeft: '2px solid var(--verde)',
                                        padding: '8px 12px',
                                        background: 'var(--bg3)',
                                        borderRadius: 8,
                                        fontSize: 13, color: 'var(--txt2)', lineHeight: 1.5,
                                    }}>
                                        {s}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </Layout>
    );
};

export default DashboardPage;
