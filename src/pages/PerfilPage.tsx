import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/ui/Layout';
import { atualizarUsuario, deletarUsuario } from '../services/usuarioService';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  background: 'var(--bg3)', border: '1px solid var(--borda)',
  borderRadius: 8, color: 'var(--txt)', fontSize: 14,
};

const card: React.CSSProperties = {
  background: 'var(--bg2)', border: '1px solid var(--borda)',
  borderRadius: 12, padding: 24, marginBottom: 16,
};

const PerfilPage = () => {
  const { usuario, updateUsuario, logout } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [email, setEmail] = useState(usuario?.email ?? '');
  const [fotoUrl, setFotoUrl] = useState(usuario?.fotoUrl ?? '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [saving, setSaving] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) { setErro('Nome e email são obrigatórios.'); return; }

    if (novaSenha) {
      if (novaSenha !== confirmarSenha) { setErro('As novas senhas não coincidem.'); return; }
      if (novaSenha.length < 6) { setErro('A nova senha deve ter pelo menos 6 caracteres.'); return; }
      if (!senhaAtual) { setErro('Informe a senha atual para alterá-la.'); return; }
    }

    setSaving(true);
    setErro('');
    setSucesso('');

    try {
      const payload: Record<string, string> = { nome: nome.trim(), email: email.trim(), fotoUrl };
      if (novaSenha) { payload.senhaAtual = senhaAtual; payload.novaSenha = novaSenha; }

      const atualizado = await atualizarUsuario(usuario!.id!, payload as any);
      updateUsuario({ ...atualizado, senha: '' });
      setSucesso('Perfil atualizado com sucesso!');
      setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha('');
    } catch (e: any) {
      setErro(e?.response?.data ?? 'Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!usuario?.id) return;
    setExcluindo(true);
    try {
      await deletarUsuario(usuario.id);
      logout();
      navigate('/login');
    } catch {
      setErro('Erro ao excluir conta.');
      setExcluindo(false);
      setConfirmarExclusao(false);
    }
  };

  const inicial = nome?.[0]?.toUpperCase() ?? 'U';

  return (
    <Layout>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', margin: '0 0 4px' }}>Meu Perfil</h1>
        <p style={{ color: 'var(--txt3)', fontSize: 13, margin: 0 }}>Gerencie suas informações pessoais</p>
      </div>

      {/* Avatar */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--verde-bg)', border: '2px solid var(--verde-borda)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden',
        }}>
          {fotoUrl ? (
            <img src={fotoUrl} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--verde)' }}>{inicial}</span>
          )}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--txt)' }}>{nome || 'Usuário'}</div>
          <div style={{ fontSize: 13, color: 'var(--txt3)', marginTop: 2 }}>{email}</div>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSave}>
        {/* Dados pessoais */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 16 }}>Dados pessoais</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 5 }}>Nome completo</label>
              <input value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} placeholder="Seu nome" />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 5 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="seu@email.com" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 5 }}>URL da foto de perfil (opcional)</label>
              <input value={fotoUrl} onChange={e => setFotoUrl(e.target.value)} style={inputStyle} placeholder="https://exemplo.com/sua-foto.jpg" />
            </div>
          </div>
        </div>

        {/* Alterar senha */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 4 }}>Alterar senha</div>
          <div style={{ fontSize: 12, color: 'var(--txt3)', marginBottom: 16 }}>Deixe em branco se não quiser alterar</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 5 }}>Senha atual</label>
              <input type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} style={inputStyle} placeholder="••••••••" />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 5 }}>Nova senha</label>
              <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} style={inputStyle} placeholder="Mínimo 6 caracteres" />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--txt3)', display: 'block', marginBottom: 5 }}>Confirmar nova senha</label>
              <input type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} style={inputStyle} placeholder="••••••••" />
            </div>
          </div>
        </div>

        {erro && (
          <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, color: 'var(--vermelho)', fontSize: 13 }}>
            {erro}
          </div>
        )}
        {sucesso && (
          <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 8, color: 'var(--verde)', fontSize: 13 }}>
            {sucesso}
          </div>
        )}

        <button type="submit" disabled={saving} style={{
          padding: '11px 28px', background: 'var(--verde)', color: '#0f1117',
          border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700,
          cursor: saving ? 'not-allowed' : 'pointer',
        }}>
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>

      {/* Zona de perigo */}
      <div style={{ ...card, marginTop: 16, border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.04)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--vermelho)', marginBottom: 6 }}>Zona de perigo</div>
        <p style={{ fontSize: 13, color: 'var(--txt3)', margin: '0 0 16px' }}>
          Excluir sua conta é uma ação permanente. Todos os seus dados (receitas, despesas e objetivos) serão removidos e não poderão ser recuperados.
        </p>

        {!confirmarExclusao ? (
          <button
            onClick={() => setConfirmarExclusao(true)}
            style={{ padding: '9px 20px', background: 'transparent', border: '1px solid var(--vermelho)', color: 'var(--vermelho)', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Excluir minha conta
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--txt2)' }}>Tem certeza? Esta ação não pode ser desfeita.</span>
            <button
              onClick={handleDelete}
              disabled={excluindo}
              style={{ padding: '9px 20px', background: 'var(--vermelho)', border: 'none', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: excluindo ? 'not-allowed' : 'pointer' }}
            >
              {excluindo ? 'Excluindo...' : 'Sim, excluir'}
            </button>
            <button
              onClick={() => setConfirmarExclusao(false)}
              style={{ padding: '9px 20px', background: 'transparent', border: '1px solid var(--borda)', color: 'var(--txt3)', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PerfilPage;
