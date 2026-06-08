import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/ui/Layout';
import { listarObjetivosPorUsuario, criarObjetivo, atualizarObjetivo, deletarObjetivo } from '../services/objetivoService';
import { loadAvatar } from '../services/avatarService';
import { useGamification } from '../hooks/useGamification';
import { calcXP, CONFETTI_COLORS, getNextGame } from '../utils/gamification';
import {
    GamificationHeader,
    GoalCard,
    DepositSheet,
    CoinCatchGame,
    CelebrationScreen,
    PiggyRunner,
} from '../components/gamification';
import type { Objetivo } from '../types';
import type { AvatarConfig } from '../types/gamification';

const ObjetivosPage = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [erro, setErro] = useState('');
    const [form, setForm] = useState({ nome: '', valorMeta: '', prazoMeses: '12', prioridade: 'MEDIA' });

    const { xpTotal, level, xpInLevel, milestonesDone, streaks, addXP, checkMilestones, updateStreak } = useGamification();

    const [avatar, setAvatar] = useState<AvatarConfig>(loadAvatar);

    const [selecionado, setSelecionado] = useState<Objetivo | null>(null);
    const [sheetAberta, setSheetAberta] = useState(false);
    const [depositSaving, setDepositSaving] = useState(false);

    const [gameAtivo, setGameAtivo] = useState(false);
    const [runnerAtivo, setRunnerAtivo] = useState(false);

    const [celebrando, setCelebrando] = useState<Objetivo | null>(null);
    const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; delay: number; size: number }[]>([]);

    // guarda o objetivo concluído para exibir celebração após o jogo
    const completedAfterGameRef = useRef<Objetivo | null>(null);

    // recarrega avatar ao voltar da tela de customização
    useEffect(() => {
        const onFocus = () => setAvatar(loadAvatar());
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, []);

    const fetchObjetivos = async () => {
        if (!usuario?.id) return;
        try {
            const data = await listarObjetivosPorUsuario(usuario.id);
            setObjetivos(data);
        } catch { setErro('Erro ao carregar objetivos.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchObjetivos(); }, [usuario]);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.nome.trim() || !form.valorMeta.trim()) { setErro('Preencha nome e valor meta.'); return; }
        setSaving(true); setErro('');
        try {
            await criarObjetivo({
                nome: form.nome.trim(), valorMeta: parseFloat(form.valorMeta),
                valorAtual: 0, prazoMeses: parseInt(form.prazoMeses) || 12,
                prioridade: form.prioridade, tipo: 'NORMAL', usuario: { id: usuario?.id as number },
            });
            setForm({ nome: '', valorMeta: '', prazoMeses: '12', prioridade: 'MEDIA' });
            await fetchObjetivos();
        } catch { setErro('Erro ao salvar objetivo.'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        try { await deletarObjetivo(id); setObjetivos(prev => prev.filter(o => o.id !== id)); }
        catch { setErro('Erro ao excluir objetivo.'); }
    };

    const abrirSheet = (obj: Objetivo) => {
        setSelecionado(obj);
        setSheetAberta(true);
    };

    const salvarDeposito = async (valor: number) => {
        if (!selecionado) return;
        setDepositSaving(true);
        const novoValor = Math.min(selecionado.valorAtual + valor, selecionado.valorMeta);
        try {
            await atualizarObjetivo(selecionado.id!, {
                ...selecionado, valorAtual: novoValor, usuario: { id: usuario?.id as number },
            });
            const xpDeposit = calcXP(valor);
            const xpMilestone = checkMilestones(selecionado, novoValor);
            addXP(xpDeposit + xpMilestone);
            updateStreak(selecionado.id!);
            await fetchObjetivos();
            if (novoValor >= selecionado.valorMeta) {
                completedAfterGameRef.current = { ...selecionado, valorAtual: novoValor };
            }
            setSheetAberta(false);
            const proximoJogo = getNextGame();
            if (proximoJogo === 'coinCatch') {
                setGameAtivo(true);
            } else {
                setRunnerAtivo(true);
            }
        } catch { setErro('Erro ao depositar.'); }
        finally { setDepositSaving(false); }
    };

    const handleConcluirJogo = (score: number) => {
        addXP(score * 18);
        setGameAtivo(false);
        if (completedAfterGameRef.current) {
            const completed = completedAfterGameRef.current;
            completedAfterGameRef.current = null;
            setCelebrando(completed);
            setConfetti(Array.from({ length: 32 }, (_, i) => ({
                id: i, x: Math.random() * 100,
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                delay: Math.random() * 1.5, size: 6 + Math.random() * 8,
            })));
        }
    };

    const handleFecharJogo = () => setGameAtivo(false);

    const concluirRunner = (score: number, victory: boolean) => {
        const xp = score * 25 + (victory ? 150 : 0);
        addXP(xp);
        setRunnerAtivo(false);
        if (completedAfterGameRef.current) {
            const completed = completedAfterGameRef.current;
            completedAfterGameRef.current = null;
            setCelebrando(completed);
            setConfetti(Array.from({ length: 32 }, (_, i) => ({
                id: i, x: Math.random() * 100,
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                delay: Math.random() * 1.5, size: 6 + Math.random() * 8,
            })));
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '9px 12px', background: '#1E2533',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
        color: '#F1F5F9', fontSize: 13, boxSizing: 'border-box',
    };

    return (
        <Layout>
            <GamificationHeader
                avatar={avatar}
                level={level}
                xpInLevel={xpInLevel}
                xpTotal={xpTotal}
                onAvatarClick={() => navigate('/avatar')}
            />

            <div style={{ marginBottom: 16 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: '#F1F5F9', margin: '0 0 4px' }}>Objetivos</h1>
                <p style={{ color: '#8890A6', fontSize: 13, margin: 0 }}>Defina e acompanhe suas metas financeiras</p>
            </div>

            {erro && (
                <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, color: '#FF6B6B', fontSize: 13 }}>
                    {erro}
                </div>
            )}

            {loading ? (
                <div style={{ color: '#8890A6', fontSize: 13, marginBottom: 20 }}>Carregando...</div>
            ) : objetivos.length === 0 ? (
                <div style={{ background: '#161B24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16, marginBottom: 20, color: '#8890A6', fontSize: 13 }}>
                    Nenhum objetivo cadastrado ainda.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14, marginBottom: 20 }}>
                    {objetivos.map(o => (
                        <GoalCard
                            key={o.id}
                            objetivo={o}
                            milestonesDone={milestonesDone[o.id!] ?? []}
                            streak={streaks[o.id!]?.count ?? 0}
                            onDeposit={abrirSheet}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <div style={{ background: '#161B24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 14 }}>Novo objetivo</div>
                <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
                    <div>
                        <label style={{ fontSize: 11, color: '#8890A6', display: 'block', marginBottom: 4 }}>Nome</label>
                        <input placeholder="Ex: Reserva de emergência" value={form.nome}
                            onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ fontSize: 11, color: '#8890A6', display: 'block', marginBottom: 4 }}>Valor meta (R$)</label>
                        <input placeholder="0,00" type="number" step="0.01" value={form.valorMeta}
                            onChange={e => setForm(f => ({ ...f, valorMeta: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ fontSize: 11, color: '#8890A6', display: 'block', marginBottom: 4 }}>Prazo (meses)</label>
                        <input placeholder="12" type="number" min={1} value={form.prazoMeses}
                            onChange={e => setForm(f => ({ ...f, prazoMeses: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ fontSize: 11, color: '#8890A6', display: 'block', marginBottom: 4 }}>Prioridade</label>
                        <select value={form.prioridade} onChange={e => setForm(f => ({ ...f, prioridade: e.target.value }))} style={inputStyle}>
                            <option value="ALTA">Alta</option>
                            <option value="MEDIA">Média</option>
                            <option value="BAIXA">Baixa</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" disabled={saving} style={{
                            width: '100%', padding: '9px 16px', background: '#22C55E', color: '#000',
                            border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 900,
                            cursor: saving ? 'not-allowed' : 'pointer',
                        }}>
                            {saving ? 'Salvando...' : 'Salvar objetivo'}
                        </button>
                    </div>
                </form>
            </div>

            {sheetAberta && selecionado && (
                <DepositSheet
                    objetivo={selecionado}
                    onSave={salvarDeposito}
                    onClose={() => setSheetAberta(false)}
                    saving={depositSaving}
                />
            )}

            {gameAtivo && (
                <CoinCatchGame
                    onConcluir={handleConcluirJogo}
                    onFechar={handleFecharJogo}
                />
            )}

            {runnerAtivo && (
                <PiggyRunner
                    onConcluir={concluirRunner}
                    onFechar={() => setRunnerAtivo(false)}
                />
            )}

            {celebrando && (
                <CelebrationScreen
                    objetivo={celebrando}
                    avatar={avatar}
                    confetti={confetti}
                    onShare={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'OrganizaFácil',
                                text: `Concluí meu objetivo "${celebrando.nome}" de ${celebrando.valorMeta}! 🐷🎉`,
                            }).catch(() => { });
                        }
                    }}
                    onFechar={() => { setCelebrando(null); setConfetti([]); }}
                />
            )}
        </Layout>
    );
};

export default ObjetivosPage;
