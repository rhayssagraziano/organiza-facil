import { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/ui/Layout';
import { listarDespesasPorUsuario, criarDespesa, deletarDespesa } from '../services/despesaService';
import { DespesaRow } from '../components/despesas/DespesaRow';
import type { Despesa } from '../types';
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

const DespesasPage = () => {
  const { usuario } = useAuth();
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [calendarMsg, setCalendarMsg] = useState('');
  const [calendarSyncing, setCalendarSyncing] = useState(false);
  const [form, setForm] = useState({ descricao: '', valor: '', tipo: 'FIXA', diaVencimento: '5', totalParcelas: '' });

  const syncCalendar = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.events',
    onSuccess: async (token) => {
      setCalendarSyncing(true);
      setCalendarMsg('');
      try {
        const contas = despesas.filter(d => d.diaVencimento);
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        let criados = 0;
        for (const d of contas) {
          const day = String(d.diaVencimento).padStart(2, '0');
          const date = `${year}-${month}-${day}`;
          const body = {
            summary: `Vencimento: ${d.descricao}`,
            description: `Valor: ${d.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nTipo: ${d.tipo}`,
            start: { date },
            end: { date },
            recurrence: [`RRULE:FREQ=MONTHLY;BYMONTHDAY=${d.diaVencimento}`],
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'email', minutes: 1440 },
                { method: 'popup', minutes: 60 },
              ],
            },
          };
          await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          criados++;
        }
        setCalendarMsg(`✓ ${criados} lembrete(s) adicionado(s) ao Google Agenda com recorrência mensal.`);
      } catch {
        setCalendarMsg('Erro ao criar eventos no Google Agenda. Tente novamente.');
      } finally {
        setCalendarSyncing(false);
      }
    },
    onError: () => setCalendarMsg('Não foi possível conectar ao Google Agenda.'),
  });

  const fetchDespesas = async () => {
    if (!usuario?.id) return;
    try {
      const data = await listarDespesasPorUsuario(usuario.id);
      setDespesas(data);
    } catch {
      setErro('Erro ao carregar despesas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDespesas(); }, [usuario]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.descricao.trim() || !form.valor.trim()) { setErro('Preencha descrição e valor.'); return; }
    setSaving(true);
    setErro('');
    try {
      await criarDespesa({
        descricao: form.descricao.trim(),
        valor: parseFloat(form.valor),
        data: today(),
        tipo: form.tipo,
        diaVencimento: parseInt(form.diaVencimento) || 5,
        ...(form.tipo === 'DIVIDA' && form.totalParcelas ? { totalParcelas: parseInt(form.totalParcelas) } : {}),
        usuario: { id: usuario?.id as number },
      });
      setForm({ descricao: '', valor: '', tipo: 'FIXA', diaVencimento: '5', totalParcelas: '' });
      await fetchDespesas();
    } catch {
      setErro('Erro ao salvar despesa.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    try {
      await deletarDespesa(id);
      setDespesas(prev => prev.filter(d => d.id !== id));
    } catch {
      setErro('Erro ao excluir despesa.');
    }
  };

  const fixas = despesas.filter(d => d.tipo === 'FIXA');
  const variaveis = despesas.filter(d => d.tipo === 'VARIAVEL');
  const dividas = despesas.filter(d => d.tipo === 'DIVIDA' || d.tipo === 'PARCELA');

  const totalFixas = fixas.reduce((a, d) => a + d.valor, 0);
  const totalVariaveis = variaveis.reduce((a, d) => a + d.valor, 0);
  const totalDividas = dividas.reduce((a, d) => a + d.valor, 0);

  return (
    <Layout>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', margin: '0 0 4px' }}>Despesas</h1>
          <p style={{ color: 'var(--txt3)', fontSize: 13, margin: 0 }}>Controle seus gastos mensais</p>
        </div>
        <button
          onClick={() => syncCalendar()}
          disabled={calendarSyncing || despesas.length === 0}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--borda)',
            color: 'var(--txt2)', cursor: calendarSyncing || despesas.length === 0 ? 'not-allowed' : 'pointer',
          }}
          title="Adiciona um lembrete mensal no Google Agenda para cada vencimento"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {calendarSyncing ? 'Sincronizando...' : 'Sincronizar Google Agenda'}
        </button>
      </div>

      {calendarMsg && (
        <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 8, fontSize: 13,
          background: calendarMsg.startsWith('✓') ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
          border: `1px solid ${calendarMsg.startsWith('✓') ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
          color: calendarMsg.startsWith('✓') ? 'var(--verde)' : 'var(--vermelho)',
        }}>
          {calendarMsg}
        </div>
      )}

      {erro && (
        <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, color: 'var(--vermelho)', fontSize: 13 }}>
          {erro}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Fixas', value: fmt(totalFixas), color: 'var(--vermelho)' },
          { label: 'Variáveis', value: fmt(totalVariaveis), color: 'var(--amarelo)' },
          { label: 'Dívidas', value: fmt(totalDividas), color: 'var(--roxo)' },
        ].map(sc => (
          <div key={sc.label} style={card}>
            <div style={{ fontSize: 11, color: 'var(--txt3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>{sc.label}</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: sc.color }}>{sc.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 14 }}>Despesas fixas</div>
          {loading ? (
            <div style={{ color: 'var(--txt3)', fontSize: 13 }}>Carregando...</div>
          ) : fixas.length === 0 ? (
            <div style={{ color: 'var(--txt3)', fontSize: 13 }}>Nenhuma despesa fixa.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {fixas.map(d => <DespesaRow key={d.id} d={d} onDelete={handleDelete} />)}
            </div>
          )}
        </div>

        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 14 }}>Dívidas e parcelas</div>
          {loading ? (
            <div style={{ color: 'var(--txt3)', fontSize: 13 }}>Carregando...</div>
          ) : dividas.length === 0 ? (
            <div style={{ color: 'var(--txt3)', fontSize: 13 }}>Nenhuma dívida ou parcela.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dividas.map(d => <DespesaRow key={d.id} d={d} onDelete={handleDelete} />)}
            </div>
          )}
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 14 }}>Nova despesa</div>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt2)', display: 'block', marginBottom: 5 }}>Descrição</label>
              <input
                placeholder="Ex: Aluguel"
                value={form.descricao}
                onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt2)', display: 'block', marginBottom: 5 }}>Valor (R$)</label>
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
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt2)', display: 'block', marginBottom: 5 }}>Tipo</label>
              <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value, totalParcelas: '' }))} style={inputStyle}>
                <option value="FIXA">Despesa Fixa</option>
                <option value="VARIAVEL">Variável</option>
                <option value="DIVIDA">Dívida/Parcela</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt2)', display: 'block', marginBottom: 5 }}>Dia de vencimento</label>
              <input
                placeholder="Ex: 5"
                type="number"
                min={1} max={31}
                value={form.diaVencimento}
                onChange={e => setForm(f => ({ ...f, diaVencimento: e.target.value }))}
                style={inputStyle}
              />
            </div>
            {form.tipo === 'DIVIDA' && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt2)', display: 'block', marginBottom: 5 }}>Parcelas restantes</label>
                <input
                  placeholder="Ex: 12"
                  type="number"
                  min={1}
                  value={form.totalParcelas}
                  onChange={e => setForm(f => ({ ...f, totalParcelas: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '9px 24px',
              background: 'var(--verde)', color: '#0f1117',
              border: 'none', borderRadius: 8, fontSize: 13,
              fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Salvando...' : 'Salvar despesa'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default DespesasPage;
