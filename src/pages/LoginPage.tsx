import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';
import { loginUsuario, loginComGoogle } from '../services/authService';

const chartBars = [55, 48, 70, 58, 80, 63, 75, 60, 90, 68, 100, 72];
const chartMonths = ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai'];

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            setErro('');
            try {
                const usuario = await loginComGoogle(tokenResponse.access_token);
                login(usuario);
                const done = localStorage.getItem('onboarding_' + usuario.id);
                navigate(done ? '/' : '/onboarding');
            } catch {
                setErro('Não foi possível fazer login com Google. Tente novamente.');
            } finally {
                setLoading(false);
            }
        },
        onError: () => setErro('Erro ao conectar com o Google. Tente novamente.'),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !senha.trim()) { setErro('Preencha todos os campos.'); return; }
        setLoading(true);
        setErro('');
        try {
            const usuario = await loginUsuario(email.trim(), senha);
            login(usuario);
            const done = localStorage.getItem('onboarding_' + usuario.id);
            navigate(done ? '/' : '/onboarding');
        } catch {
            setErro('Email ou senha incorretos. Verifique e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#0f1117' }}>

            {/* ── PAINEL ESQUERDO ── */}
            <div style={{
                flex: '0 0 55%', display: 'flex', flexDirection: 'column',
                padding: '40px 52px', position: 'relative', overflow: 'hidden',
            }}>
                {/* Glows decorativos */}
                <div style={{ position: 'absolute', top: -220, right: -80, width: 580, height: 580, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -120, left: -80, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

                {/* Marca no topo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64, zIndex: 1 }}>
                    <Logo size={80} />
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px' }}>OrganizaFácil</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Finanças inteligentes</div>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
                    <h1 style={{ fontSize: 50, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.08, margin: '0 0 20px', letterSpacing: '-2px' }}>
                        Seu dinheiro,
                        <br />
                        <span style={{
                            background: 'linear-gradient(90deg, #4ade80, #86efac, #ffffff, #bbf7d0, #4ade80, #22c55e)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'gradientFlow 4s linear infinite',
                        }}>totalmente</span>
                        <br />
                        organizado.
                    </h1>
                    <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.8, margin: '0 0 44px', maxWidth: 380 }}>
                        Controle financeiro inteligente,<br />
                        planejamento real e objetivos claros<br />
                        para quem quer mais da vida.
                    </p>

                    <div style={{
                        background: '#161b24', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 14, padding: '14px 18px', maxWidth: 440,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>Atividade — últimos 6 meses</span>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {[
                                    { label: 'Receita', bg: 'rgba(74,222,128,0.1)', color: '#4ade80' },
                                    { label: 'Despesa', bg: 'rgba(248,113,113,0.1)', color: '#f87171' },
                                ].map(t => (
                                    <span key={t.label} style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: t.bg, color: t.color }}>{t.label}</span>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 52 }}>
                            {chartBars.map((h, i) => (
                                <div key={i} style={{
                                    flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0',
                                    background: i % 2 === 0
                                        ? (i === 10 ? 'rgba(74,222,128,0.7)' : 'rgba(74,222,128,0.28)')
                                        : 'rgba(248,113,113,0.22)',
                                    border: i === 10 ? '1px solid rgba(74,222,128,0.5)' : 'none',
                                    animation: i === 10 ? 'barPulse 2s ease-in-out infinite' : 'none',
                                }} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', marginTop: 6 }}>
                            {chartMonths.map(m => (
                                <span key={m} style={{ flex: 2, fontSize: 10, color: '#64748b', textAlign: 'center' }}>{m}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── PAINEL DIREITO ── */}
            <div style={{
                flex: '0 0 45%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#161b24', borderLeft: '1px solid rgba(255,255,255,0.07)',
                padding: '48px 52px',
            }}>
                <div style={{ width: '100%', maxWidth: 360 }}>
                    <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                        Bem-vindo de volta
                    </h2>
                    <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 32px' }}>
                        Entre na sua conta para continuar
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 7, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Email
                            </label>
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="seu@email.com" autoComplete="email"
                                style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 14 }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 7, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Senha
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={mostrarSenha ? 'text' : 'password'}
                                    value={senha} onChange={e => setSenha(e.target.value)}
                                    placeholder="••••••••" autoComplete="current-password"
                                    style={{ width: '100%', padding: '12px 44px 12px 16px', boxSizing: 'border-box', background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 14 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha(v => !v)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                                >
                                    {mostrarSenha ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {erro && (
                            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, color: '#f87171', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                {erro}
                            </div>
                        )}

                        <button
                            type="submit" disabled={loading}
                            style={{ width: '100%', padding: '13px', marginTop: 4, background: loading ? 'rgba(74,222,128,0.35)' : 'linear-gradient(135deg, #4ade80, #22c55e)', border: 'none', borderRadius: 10, color: '#14532d', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 20px rgba(74,222,128,0.3)', letterSpacing: '0.1px' }}
                        >
                            {loading ? 'Entrando...' : 'Entrar no Dashboard'}
                        </button>
                    </form>

                    {/* Divisor */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                        <span style={{ fontSize: 12, color: '#475569' }}>ou</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                    </div>

                    <button
                        type="button"
                        onClick={() => googleLogin()}
                        disabled={loading}
                        style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'border-color 0.15s' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continuar com Google
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20 }}>
                        {['🔒 SSL Seguro', '✓ Dados protegidos', '⚡ 99.9% uptime'].map(b => (
                            <span key={b} style={{ fontSize: 10, color: '#475569' }}>{b}</span>
                        ))}
                    </div>

                    {/* Link cadastro */}
                    <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#475569' }}>
                        Não tem uma conta?{' '}
                        <button
                            onClick={() => navigate('/cadastro')}
                            style={{ background: 'none', border: 'none', color: '#4ade80', fontWeight: 600, cursor: 'pointer', fontSize: 14, padding: 0 }}
                        >
                            Cadastre-se grátis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
