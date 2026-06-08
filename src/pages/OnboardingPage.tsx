import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';
import api from '../services/api';
import { gerarDashboard } from '../services/dashboardService';
import { computePlanoItems } from '../hooks/usePlanoAcao';
import { downloadICS } from '../utils/ics';
import { setOnboardingDone } from '../utils/storage';
import { PiggyAvatar } from '../components/gamification/PiggyAvatar';
import type { PlanoItem } from '../hooks/usePlanoAcao';
import type { Despesa } from '../types';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: 'var(--bg3)', border: '1px solid var(--borda)',
  borderRadius: 8, color: 'var(--txt)', fontSize: 13,
};

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: 'var(--bg3)', border: '1px solid var(--borda)',
  borderRadius: 8, color: 'var(--txt)', fontSize: 13,
};

const primaryBtn: React.CSSProperties = {
  padding: '12px 24px', background: 'var(--verde)', color: '#0f1117',
  border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
  cursor: 'pointer', width: '100%', marginTop: 16,
};

const skipBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--txt3)',
  fontSize: 12, cursor: 'pointer', marginTop: 8,
  display: 'block', textAlign: 'center', width: '100%',
};

interface ReceitaRow { descricao: string; valor: string; tipo: string; outrosLabel: string; }
interface DespesaRow { descricao: string; valor: string; tipo: string; diaVencimento: string; totalParcelas: string; }
interface ObjetivoRow { nome: string; valorMeta: string; prazoMeses: string; prioridade: string; }

const today = new Date().toISOString().split('T')[0];

const OnboardingPage = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [receitas, setReceitas] = useState<ReceitaRow[]>([{ descricao: '', valor: '', tipo: 'SALARIO', outrosLabel: '' }]);
  const [despesas, setDespesas] = useState<DespesaRow[]>([{ descricao: '', valor: '', tipo: 'FIXA', diaVencimento: '5', totalParcelas: '' }]);
  const [objetivos, setObjetivos] = useState<ObjetivoRow[]>([{ nome: '', valorMeta: '', prazoMeses: '12', prioridade: 'MEDIA' }]);

  const [planoItems, setPlanoItems] = useState<PlanoItem[]>([]);
  const [planoLoading, setPlanoLoading] = useState(false);
  const step4FetchedRef = useRef(false);

  // Tela intermediária entre passo 3 e 4
  const [showPiggyIntro, setShowPiggyIntro] = useState(false);

  const [userDespesas, setUserDespesas] = useState<Despesa[]>([]);
  const [calendarMsg, setCalendarMsg] = useState('');

  // só carrega uma vez ao entrar no passo 4 (ref evita duplo fetch)
  useEffect(() => {
    if (step !== 4 || !usuario?.id || step4FetchedRef.current) return;
    step4FetchedRef.current = true;
    setPlanoLoading(true);
    Promise.all([
      gerarDashboard(usuario.id),
      api.get(`/api/objetivos/usuario/${usuario.id}`).then(r => r.data),
      api.get(`/api/despesas/usuario/${usuario.id}`).then(r => r.data),
    ])
      .then(([dash, objs, desps]) => {
        setPlanoItems(computePlanoItems(dash, objs));
        setUserDespesas(desps);
      })
      .catch(() => {})
      .finally(() => setPlanoLoading(false));
  }, [step, usuario]);

  const handleDownloadICS = () => {
    const ok = downloadICS(userDespesas);
    if (ok) {
      setCalendarMsg('✓ Arquivo baixado! Abra-o para importar os lembretes no Google Agenda, Outlook ou qualquer calendário.');
    } else {
      setCalendarMsg('Nenhuma despesa com data de vencimento cadastrada.');
    }
  };

  const updateReceita = (i: number, field: keyof ReceitaRow, val: string) => {
    setReceitas(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };
  const updateDespesa = (i: number, field: keyof DespesaRow, val: string) => {
    setDespesas(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: val } : d));
  };
  const updateObjetivo = (i: number, field: keyof ObjetivoRow, val: string) => {
    setObjetivos(prev => prev.map((o, idx) => idx === i ? { ...o, [field]: val } : o));
  };

  const clearExisting = async (endpoint: string) => {
    try {
      const res = await api.get(`${endpoint}/usuario/${usuario?.id}`);
      await Promise.all(res.data.map((item: { id: number }) =>
        api.delete(`${endpoint}/${item.id}`).catch(() => {})
      ));
    } catch {}
  };

  const saveAndAdvance = async () => {
    setError('');

    // passos 4 e 5 não fazem chamada à API
    if (step === 4) { setStep(5); return; }
    if (step === 5) {
      setOnboardingDone(usuario!.id!);
      navigate('/dashboard');
      return;
    }

    setLoading(true);
    try {
      if (step === 1) {
        const filled = receitas.filter(r => r.descricao.trim() && r.valor.trim());
        if (filled.length === 0) { setError('Preencha pelo menos uma receita com descrição e valor.'); setLoading(false); return; }
        if (filled.some(r => r.tipo === 'OUTROS' && !r.outrosLabel.trim())) { setError('Descreva o tipo de renda para os itens "Outros".'); setLoading(false); return; }
        await clearExisting('/api/receitas');
        for (const r of filled) {
          await api.post('/api/receitas', {
            descricao: r.descricao.trim(),
            valor: parseFloat(r.valor),
            data: today,
            tipo: r.tipo === 'OUTROS' ? r.outrosLabel.trim() : r.tipo,
            usuario: { id: usuario?.id },
          }).catch(() => {});
        }
        setStep(2);
      } else if (step === 2) {
        const filled = despesas.filter(d => d.descricao.trim() && d.valor.trim());
        if (filled.length === 0) { setError('Preencha pelo menos uma despesa com descrição e valor.'); setLoading(false); return; }
        await clearExisting('/api/despesas');
        for (const d of filled) {
          await api.post('/api/despesas', {
            descricao: d.descricao.trim(),
            valor: parseFloat(d.valor),
            data: today,
            tipo: d.tipo,
            diaVencimento: parseInt(d.diaVencimento) || 5,
            ...(d.tipo === 'DIVIDA' && d.totalParcelas ? { totalParcelas: parseInt(d.totalParcelas) } : {}),
            usuario: { id: usuario?.id },
          }).catch(() => {});
        }
        setStep(3);
      } else if (step === 3) {
        const filled = objetivos.filter(o => o.nome.trim() && o.valorMeta.trim());
        if (filled.length === 0) { setError('Preencha pelo menos um objetivo com nome e valor meta.'); setLoading(false); return; }
        await clearExisting('/api/objetivos');
        for (const o of filled) {
          await api.post('/api/objetivos', {
            nome: o.nome.trim(),
            valorMeta: parseFloat(o.valorMeta),
            valorAtual: 0,
            prazoMeses: parseInt(o.prazoMeses) || 12,
            prioridade: o.prioridade,
            tipo: 'NORMAL',
            usuario: { id: usuario?.id },
          }).catch(() => {});
        }
        setShowPiggyIntro(true);
      }
    } catch {
      setError('Ocorreu um erro, mas você pode continuar.');
      setStep(s => s + 1);
    } finally {
      setLoading(false);
    }
  };

  const skip = () => {
    setError('');
    if (step === 5) {
      setOnboardingDone(usuario!.id!);
      navigate('/dashboard');
    } else {
      setStep(s => s + 1);
    }
  };

  if (step === 0) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', padding: 24, textAlign: 'center', gap: 20,
      }}>
        <Logo size={80} />
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--txt)', margin: 0, maxWidth: 480 }}>
          Sua organização financeira inteligente começa aqui
        </h1>
        <p style={{ color: 'var(--txt3)', fontSize: 15, margin: 0 }}>
          Vamos configurar seu perfil em 5 passos rápidos
        </p>
        <button style={{ ...primaryBtn, width: 'auto', marginTop: 8 }} onClick={() => setStep(1)}>
          Começar →
        </button>
      </div>
    );
  }

  if (showPiggyIntro) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        background: '#0D1117', padding: 24, paddingTop: 40, paddingBottom: 40,
      }}>
        <div style={{
          width: '100%', maxWidth: 560,
          background: '#161B24', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '32px 28px',
        }}>
          {/* Título */}
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#F1F5F9', margin: '0 0 6px', textAlign: 'center' }}>
            Guardar dinheiro ficou mais divertido
          </h2>
          <p style={{ fontSize: 14, color: '#8890A6', fontWeight: 400, margin: '0 0 24px', textAlign: 'center' }}>
            Deixa o Piggy te acompanhar nessa jornada.
          </p>

          {/* Avatar animado */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{
              width: 220, height: 220, borderRadius: '50%',
              background: 'rgba(34,197,94,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                animation: 'piggyEntrada 600ms ease-out both, piggyFlutua 900ms 600ms ease-in-out infinite alternate',
              }}>
                <PiggyAvatar size={160}/>
              </div>
            </div>
          </div>

          {/* 3 blocos explicativos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {[
              {
                icon: '⭐', iconColor: '#F59E0B',
                title: 'Guarde dinheiro, ganhe XP',
                text: 'A cada depósito registrado nos seus objetivos, o Piggy te recompensa com pontos de experiência.',
              },
              {
                icon: '🪙', iconColor: undefined,
                title: 'Resgate seus pontos jogando',
                text: 'Ao atualizar um depósito, jogue o mini-game do Piggy e multiplique seus pontos.',
              },
              {
                icon: '👑', iconColor: undefined,
                title: 'Personalize o Piggy com seus pontos',
                text: 'Suba de nível e desbloqueie chapéus, óculos e acessórios exclusivos para o seu porquinho.',
              },
            ].map(b => (
              <div key={b.title} style={{
                background: '#1E2533', borderRadius: 12, padding: 14,
                display: 'flex', alignItems: 'flex-start', gap: 14,
              }}>
                <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, color: b.iconColor }}>{b.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#F1F5F9', marginBottom: 4 }}>{b.title}</div>
                  <div style={{ fontSize: 13, color: '#8890A6', lineHeight: 1.5 }}>{b.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#1E2533', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 14, padding: '14px 16px', marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#F1F5F9', marginBottom: 10 }}>
              🎮 PlayStation 5
            </div>
            {/* Barra de progresso */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1, background: '#0D1117', borderRadius: 10, height: 8, overflow: 'hidden' }}>
                <div style={{ width: '63%', height: '100%', background: '#22C55E', borderRadius: 10 }}/>
              </div>
              <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 700 }}>63%</span>
            </div>
            {/* Bolinhas de marcos */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {[
                { pct: '25%', filled: true },
                { pct: '50%', filled: true },
                { pct: '75%', filled: false },
                { pct: '100%', filled: false },
              ].map(m => (
                <div key={m.pct} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: m.filled ? '#F59E0B' : 'transparent',
                    border: `2px solid ${m.filled ? '#F59E0B' : '#4B5568'}`,
                  }}/>
                  <span style={{ fontSize: 10, color: '#8890A6' }}>{m.pct}</span>
                </div>
              ))}
            </div>
            <div style={{
              display: 'inline-block', marginTop: 10,
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 20, padding: '5px 12px',
              fontSize: 12, fontWeight: 800, color: '#F59E0B',
            }}>
              ⭐ +180 XP ao atingir 75%
            </div>
          </div>

          <button
            onClick={() => { setShowPiggyIntro(false); setStep(4); }}
            style={{
              width: '100%', padding: 15, background: '#22C55E', color: '#000',
              border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            Começar a poupar com o Piggy →
          </button>
          <p style={{ fontSize: 12, color: '#4B5568', textAlign: 'center', margin: '10px 0 0' }}>
            Você pode personalizar o Piggy a qualquer momento nos seus objetivos.
          </p>
        </div>
      </div>
    );
  }

  const stepInfo = [
    null,
    { title: 'Quais são suas fontes de renda?', subtitle: 'Adicione todas as suas entradas mensais' },
    { title: 'Quais são seus gastos mensais?', subtitle: 'Registre suas despesas fixas e variáveis' },
    { title: 'Quais são seus objetivos?', subtitle: 'Defina suas metas financeiras' },
    { title: 'Seu Plano de Ação personalizado', subtitle: 'Gerado com base nos seus dados financeiros' },
    { title: 'Ativar lembretes de vencimento', subtitle: 'Receba notificações no Google Agenda antes dos vencimentos' },
  ];

  const info = stepInfo[step]!;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 560,
        background: 'var(--bg2)', border: '1px solid var(--borda)',
        borderRadius: 16, padding: 32,
      }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <button
              onClick={() => setStep(s => Math.max(s - 1, 1))}
              style={{ background: 'none', border: 'none', color: 'var(--txt3)', fontSize: 12, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              ← Voltar
            </button>
            <span style={{ fontSize: 12, color: 'var(--txt3)', fontWeight: 600 }}>
              Passo {step} de 5
              {step >= 4 && <span style={{ color: 'var(--txt3)', fontSize: 10, marginLeft: 4 }}>(opcional)</span>}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 4,
                background: s <= step ? (s >= 4 ? 'rgba(74,222,128,0.5)' : 'var(--verde)') : 'var(--bg3)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--txt)', margin: 0 }}>{info.title}</h2>
        </div>
        <p style={{ fontSize: 13, color: 'var(--txt3)', margin: '0 0 20px' }}>{info.subtitle}</p>

        {step === 1 && (
          <div>
            {receitas.map((r, i) => (
              <div key={i} style={{
                background: 'var(--bg3)', border: '1px solid var(--borda)',
                borderRadius: 10, padding: 12, marginBottom: 10, position: 'relative',
              }}>
                {receitas.length > 1 && (
                  <button
                    onClick={() => setReceitas(prev => prev.filter((_, idx) => idx !== i))}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: 'var(--vermelho)', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1 }}
                  >×</button>
                )}
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Descrição</label>
                    <input placeholder="Ex: Salário mensal" value={r.descricao}
                      onChange={e => updateReceita(i, 'descricao', e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Valor R$</label>
                    <input placeholder="0,00" type="number" value={r.valor}
                      onChange={e => updateReceita(i, 'valor', e.target.value)} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Tipo de renda</label>
                  <select value={r.tipo}
                    onChange={e => setReceitas(prev => prev.map((x, idx) =>
                      idx === i ? { ...x, tipo: e.target.value, outrosLabel: '' } : x
                    ))}
                    style={selectStyle}
                  >
                    <option value="SALARIO">Salário CLT</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="INVESTIMENTO">Investimento</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>
                {r.tipo === 'OUTROS' && (
                  <div style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Qual tipo de renda?</label>
                    <input placeholder="Ex: Aluguel, Pensão, Bônus..."
                      value={r.outrosLabel} onChange={e => updateReceita(i, 'outrosLabel', e.target.value)}
                      style={{ ...inputStyle, maxWidth: 280 }} />
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => setReceitas(prev => [...prev, { descricao: '', valor: '', tipo: 'SALARIO', outrosLabel: '' }])}
              style={{ background: 'none', border: 'none', color: 'var(--verde)', fontSize: 13, cursor: 'pointer', padding: '4px 0' }}
            >+ Adicionar</button>
          </div>
        )}

        {step === 2 && (
          <div>
            {despesas.map((d, i) => (
              <div key={i} style={{
                background: 'var(--bg3)', border: '1px solid var(--borda)',
                borderRadius: 10, padding: 12, marginBottom: 10, position: 'relative',
              }}>
                {despesas.length > 1 && (
                  <button
                    onClick={() => setDespesas(prev => prev.filter((_, idx) => idx !== i))}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: 'var(--vermelho)', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1 }}
                  >×</button>
                )}
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Descrição</label>
                    <input placeholder="Ex: Aluguel" value={d.descricao}
                      onChange={e => updateDespesa(i, 'descricao', e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Valor R$</label>
                    <input placeholder="0,00" type="number" value={d.valor}
                      onChange={e => updateDespesa(i, 'valor', e.target.value)} style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Tipo de despesa</label>
                    <select value={d.tipo}
                      onChange={e => setDespesas(prev => prev.map((x, idx) =>
                        idx === i ? { ...x, tipo: e.target.value, totalParcelas: e.target.value !== 'DIVIDA' ? '' : x.totalParcelas } : x
                      ))}
                      style={selectStyle}
                    >
                      <option value="FIXA">Despesa Fixa</option>
                      <option value="VARIAVEL">Variável</option>
                      <option value="DIVIDA">Dívida / Parcela</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Dia de vencimento</label>
                    <input placeholder="Ex: 10" type="number" min={1} max={31}
                      value={d.diaVencimento} onChange={e => updateDespesa(i, 'diaVencimento', e.target.value)}
                      style={inputStyle} />
                  </div>
                </div>
                {d.tipo === 'DIVIDA' && (
                  <div style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Parcelas restantes</label>
                    <input placeholder="Ex: 12" type="number" min={1}
                      value={d.totalParcelas} onChange={e => updateDespesa(i, 'totalParcelas', e.target.value)}
                      style={{ ...inputStyle, maxWidth: 160 }} />
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => setDespesas(prev => [...prev, { descricao: '', valor: '', tipo: 'FIXA', diaVencimento: '5', totalParcelas: '' }])}
              style={{ background: 'none', border: 'none', color: 'var(--verde)', fontSize: 13, cursor: 'pointer', padding: '4px 0' }}
            >+ Adicionar</button>
          </div>
        )}

        {step === 3 && (
          <div>
            {objetivos.map((o, i) => (
              <div key={i} style={{
                background: 'var(--bg3)', border: '1px solid var(--borda)',
                borderRadius: 10, padding: 12, marginBottom: 10, position: 'relative',
              }}>
                {objetivos.length > 1 && (
                  <button
                    onClick={() => setObjetivos(prev => prev.filter((_, idx) => idx !== i))}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: 'var(--vermelho)', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1 }}
                  >×</button>
                )}
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Nome do objetivo</label>
                    <input placeholder="Ex: Reserva de emergência" value={o.nome}
                      onChange={e => updateObjetivo(i, 'nome', e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Valor meta R$</label>
                    <input placeholder="0,00" type="number" value={o.valorMeta}
                      onChange={e => updateObjetivo(i, 'valorMeta', e.target.value)} style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Prazo (meses)</label>
                    <input placeholder="Ex: 12" type="number" value={o.prazoMeses}
                      onChange={e => updateObjetivo(i, 'prazoMeses', e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 4 }}>Prioridade</label>
                    <select value={o.prioridade} onChange={e => updateObjetivo(i, 'prioridade', e.target.value)} style={selectStyle}>
                      <option value="ALTA">Alta</option>
                      <option value="MEDIA">Média</option>
                      <option value="BAIXA">Baixa</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setObjetivos(prev => [...prev, { nome: '', valorMeta: '', prazoMeses: '12', prioridade: 'MEDIA' }])}
              style={{ background: 'none', border: 'none', color: 'var(--verde)', fontSize: 13, cursor: 'pointer', padding: '4px 0' }}
            >+ Adicionar</button>
          </div>
        )}

        {step === 4 && (
          <div>
            {planoLoading ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--txt3)', fontSize: 13 }}>
                Gerando seu plano personalizado...
              </div>
            ) : planoItems.length === 0 ? (
              <div style={{ padding: '16px', background: 'var(--bg3)', borderRadius: 10, color: 'var(--txt3)', fontSize: 13 }}>
                Nenhum dado suficiente para gerar um plano. Continue cadastrando suas finanças e volte aqui!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {planoItems.map(item => (
                  <div key={item.id} style={{
                    borderLeft: `3px solid ${item.color}`,
                    padding: '10px 12px',
                    background: 'var(--bg3)',
                    borderRadius: '0 10px 10px 0',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', marginBottom: 3 }}>
                      {item.titulo}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--txt3)', lineHeight: 1.4 }}>
                      {item.descricao}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--txt3)', textAlign: 'center' }}>
              Acesse o Plano de Ação completo a qualquer momento no menu lateral.
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--verde)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div style={{ fontSize: 13, color: 'var(--txt2)', lineHeight: 1.5 }}>
                Conecte sua conta Google para receber lembretes automáticos
                antes de cada data de vencimento das suas contas.
              </div>
            </div>

            {userDespesas.filter(d => d.diaVencimento).length > 0 && (
              <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--txt3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 8 }}>
                  Contas que receberão lembretes
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {userDespesas.filter(d => d.diaVencimento).slice(0, 5).map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--txt2)' }}>
                      <span>{d.descricao}</span>
                      <span style={{ color: 'var(--txt3)' }}>dia {d.diaVencimento}</span>
                    </div>
                  ))}
                  {userDespesas.filter(d => d.diaVencimento).length > 5 && (
                    <div style={{ fontSize: 11, color: 'var(--txt3)' }}>
                      + {userDespesas.filter(d => d.diaVencimento).length - 5} mais...
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleDownloadICS}
              style={{
                width: '100%', padding: '12px 24px',
                background: 'rgba(74,222,128,0.12)',
                border: '1px solid rgba(74,222,128,0.3)',
                borderRadius: 10, fontSize: 14, fontWeight: 700,
                color: 'var(--verde)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Baixar lembretes (.ics)
            </button>

            {calendarMsg && (
              <div style={{
                marginTop: 10, padding: '10px 14px', borderRadius: 8, fontSize: 12,
                background: calendarMsg.startsWith('✓') ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
                border: `1px solid ${calendarMsg.startsWith('✓') ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
                color: calendarMsg.startsWith('✓') ? 'var(--verde)' : 'var(--vermelho)',
              }}>
                {calendarMsg}
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, color: 'var(--vermelho)', fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button
            onClick={() => setStep(s => Math.max(s - 1, 1))}
            style={{
              padding: '12px 20px', background: 'none',
              border: '1px solid var(--borda)', borderRadius: 10,
              color: 'var(--txt2)', fontSize: 14, cursor: 'pointer',
              fontWeight: 600, flexShrink: 0,
            }}
          >
            ← Voltar
          </button>
          <button
            style={{ ...primaryBtn, marginTop: 0, flex: 1 }}
            onClick={saveAndAdvance}
            disabled={loading}
          >
            {loading
              ? 'Salvando...'
              : step === 5
                ? 'Ir para o Dashboard →'
                : 'Continuar →'
            }
          </button>
        </div>
        {step !== 5 && (
          <button style={skipBtn} onClick={skip}>
            Pular esta etapa →
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
