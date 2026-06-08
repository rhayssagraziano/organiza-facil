import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';
import { criarUsuario } from '../services/usuarioService';

const RegisterPage = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome.trim() || !email.trim() || !senha.trim() || !confirmar.trim()) {
            setErro('Preencha todos os campos.'); return;
        }
        if (senha !== confirmar) {
            setErro('As senhas não coincidem.'); return;
        }
        if (senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres.'); return;
        }
        setLoading(true);
        setErro('');
        try {
            const usuario = await criarUsuario({ nome: nome.trim(), email: email.trim(), senha });
            login(usuario);
            navigate('/onboarding');
        } catch {
            setErro('Não foi possível criar a conta. Verifique os dados ou tente outro e-mail.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0f1117', padding: '24px', position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ position: 'fixed', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: -200, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

            <div style={{
                width: '100%', maxWidth: 420, position: 'relative', zIndex: 1,
                background: '#1a1d27', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 24, padding: '40px 40px 36px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}>
                {/* Logo + título */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                        <Logo size={68} />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                        Criar conta
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
                        Comece a organizar suas finanças hoje
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                        { label: 'Nome completo', value: nome, setter: setNome, type: 'text', placeholder: 'Seu nome', auto: 'name' },
                        { label: 'Email', value: email, setter: setEmail, type: 'email', placeholder: 'seu@email.com', auto: 'email' },
                        { label: 'Senha', value: senha, setter: setSenha, type: 'password', placeholder: 'Mínimo 6 caracteres', auto: 'new-password' },
                        { label: 'Confirmar senha', value: confirmar, setter: setConfirmar, type: 'password', placeholder: '••••••••', auto: 'new-password' },
                    ].map(({ label, value, setter, type, placeholder, auto }) => (
                        <div key={label}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 7, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                {label}
                            </label>
                            <input
                                type={type} value={value} onChange={e => setter(e.target.value)}
                                placeholder={placeholder} autoComplete={auto}
                                style={{
                                    width: '100%', padding: '12px 16px', boxSizing: 'border-box',
                                    background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 12, color: '#f1f5f9', fontSize: 15,
                                }}
                            />
                        </div>
                    ))}

                    {erro && (
                        <div style={{
                            padding: '11px 16px', background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10,
                            color: '#f87171', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            {erro}
                        </div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        style={{
                            width: '100%', padding: '14px', marginTop: 4,
                            background: loading ? 'rgba(74,222,128,0.35)' : 'linear-gradient(135deg, #4ade80, #22c55e)',
                            border: 'none', borderRadius: 12,
                            color: '#14532d', fontSize: 15, fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            letterSpacing: '0.2px',
                            boxShadow: loading ? 'none' : '0 4px 20px rgba(74,222,128,0.3)',
                        }}
                    >
                        {loading ? 'Criando conta...' : 'Criar conta'}
                    </button>
                </form>

                {/* Link para login */}
                <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#475569' }}>
                    Já tem uma conta?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        style={{ background: 'none', border: 'none', color: '#4ade80', fontWeight: 600, cursor: 'pointer', fontSize: 14, padding: 0 }}
                    >
                        Entrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
