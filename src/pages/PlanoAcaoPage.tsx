import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/ui/Layout';
import { listarObjetivosPorUsuario } from '../services/objetivoService';
import { gerarDashboard } from '../services/dashboardService';
import type { Objetivo } from '../types';
import { fmt } from '../utils/format';

const prioridadeColor: Record<string, string> = {
  ALTA: 'var(--vermelho)',
  MEDIA: 'var(--amarelo)',
  BAIXA: '#60a5fa',
};

const card: React.CSSProperties = {
  background: 'var(--bg2)', border: '1px solid var(--borda)',
  borderRadius: 12, padding: 16,
};

const PlanoAcaoPage = () => {
  const { usuario } = useAuth();
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [saldoMensal, setSaldoMensal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!usuario?.id) return;
    Promise.all([
      listarObjetivosPorUsuario(usuario.id),
      gerarDashboard(usuario.id),
    ])
      .then(([objs, dash]) => {
        setObjetivos(objs);
        setSaldoMensal(Math.max(0, dash.saldoDisponivel));
      })
      .catch(() => setErro('Não foi possível carregar os dados.'))
      .finally(() => setLoading(false));
  }, [usuario]);

  const totalNecessario = objetivos.reduce((acc, o) => {
    const faltante = Math.max(0, o.valorMeta - o.valorAtual);
    const meses = Math.max(1, o.prazoMeses);
    return acc + faltante / meses;
  }, 0);

  const viavelGlobal = totalNecessario <= saldoMensal;

  return (
    <Layout>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', margin: '0 0 4px' }}>Plano de Ação</h1>
        <p style={{ color: 'var(--txt3)', fontSize: 13, margin: 0 }}>Como atingir seus objetivos no prazo</p>
      </div>

      {loading && (
        <div style={{ color: 'var(--txt3)', fontSize: 14 }}>Carregando plano...</div>
      )}
      {erro && (
        <div style={{ padding: '12px 16px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, color: 'var(--vermelho)', fontSize: 13 }}>
          {erro}
        </div>
      )}

      {!loading && !erro && (
        <>
          {/* Resumo */}
          <div style={{ ...card, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 12 }}>Resumo mensal</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { label: 'Saldo disponível/mês', value: fmt(saldoMensal), color: 'var(--verde)' },
                { label: 'Necessário/mês (todos objetivos)', value: fmt(totalNecessario), color: totalNecessario > saldoMensal ? 'var(--vermelho)' : 'var(--verde)' },
                { label: 'Sobra após objetivos', value: fmt(saldoMensal - totalNecessario), color: saldoMensal - totalNecessario >= 0 ? 'var(--verde)' : 'var(--vermelho)' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg3)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--txt3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {!viavelGlobal && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, fontSize: 13, color: 'var(--vermelho)' }}>
                ⚠ Seu saldo mensal não é suficiente para cobrir todos os objetivos no prazo atual.
                Considere aumentar o prazo de alguns objetivos ou reduzir despesas em {fmt(totalNecessario - saldoMensal)}/mês.
              </div>
            )}
            {viavelGlobal && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, fontSize: 13, color: 'var(--verde)' }}>
                ✓ Seu saldo mensal cobre todos os objetivos no prazo definido!
              </div>
            )}
          </div>

          {/* Objetivos */}
          {objetivos.length === 0 ? (
            <div style={{ ...card, color: 'var(--txt3)', fontSize: 13 }}>
              Nenhum objetivo cadastrado. Acesse a página de Objetivos para criar seus primeiros!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {objetivos.map(o => {
                const faltante = Math.max(0, o.valorMeta - o.valorAtual);
                const progresso = o.valorMeta > 0 ? Math.min((o.valorAtual / o.valorMeta) * 100, 100) : 0;
                const meses = Math.max(1, o.prazoMeses);
                const porMes = faltante / meses;
                const viavel = porMes <= saldoMensal;
                const mesesSugerido = saldoMensal > 0 ? Math.ceil(faltante / saldoMensal) : null;

                return (
                  <div key={o.id} style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--txt)' }}>{o.nome}</div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                          color: prioridadeColor[o.prioridade] ?? 'var(--txt3)',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: 4, padding: '2px 7px', marginTop: 4, display: 'inline-block',
                        }}>
                          {o.prioridade}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: 'var(--txt3)' }}>Meta</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--txt)' }}>{fmt(o.valorMeta)}</div>
                      </div>
                    </div>

                    {/* Barra de progresso */}
                    <div style={{ background: 'var(--bg3)', borderRadius: 6, height: 8, overflow: 'hidden', marginBottom: 6 }}>
                      <div style={{
                        width: `${progresso}%`, height: '100%',
                        background: progresso >= 100 ? 'var(--verde)' : 'linear-gradient(90deg, #4ade80, #22c55e)',
                        borderRadius: 6, transition: 'width .8s',
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--txt3)', marginBottom: 12 }}>
                      <span>{fmt(o.valorAtual)} guardado</span>
                      <span>{progresso.toFixed(1)}% concluído</span>
                    </div>

                    {/* Métricas do plano */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                      <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10 }}>
                        <div style={{ fontSize: 10, color: 'var(--txt3)', marginBottom: 4, textTransform: 'uppercase' }}>Faltante</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--amarelo)' }}>{fmt(faltante)}</div>
                      </div>
                      <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10 }}>
                        <div style={{ fontSize: 10, color: 'var(--txt3)', marginBottom: 4, textTransform: 'uppercase' }}>Prazo</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>{meses} meses</div>
                      </div>
                      <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10 }}>
                        <div style={{ fontSize: 10, color: 'var(--txt3)', marginBottom: 4, textTransform: 'uppercase' }}>Poupar/mês</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: viavel ? 'var(--verde)' : 'var(--vermelho)' }}>{fmt(porMes)}</div>
                      </div>
                    </div>

                    {/* Status */}
                    {progresso >= 100 ? (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, fontSize: 12, color: 'var(--verde)' }}>
                        🎉 Objetivo concluído! Parabéns!
                      </div>
                    ) : viavel ? (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, fontSize: 12, color: 'var(--verde)' }}>
                        ✓ Viável — guardando {fmt(porMes)}/mês você atinge a meta em {meses} meses.
                      </div>
                    ) : (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, fontSize: 12, color: 'var(--vermelho)' }}>
                        ⚠ Prazo apertado — seria necessário {fmt(porMes)}/mês, mas seu saldo livre é {fmt(saldoMensal)}.
                        {mesesSugerido && ` Prazo sugerido: ${mesesSugerido} meses (${fmt(saldoMensal)}/mês).`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default PlanoAcaoPage;
