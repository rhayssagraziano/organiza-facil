import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';
import { fmtMonthYear } from '../../utils/format';

const styles = `
  .of-nav-btn {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 10px; border: 1px solid transparent;
    background: transparent; color: var(--txt3); cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    flex-shrink: 0;
  }
  .of-nav-btn:hover { background: var(--bg3); color: var(--txt); }
  .of-nav-btn.active { background: var(--verde-bg); color: var(--verde); border: 1px solid var(--verde-borda); }
`;

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/receitas': 'Receitas',
  '/despesas': 'Despesas',
  '/objetivos': 'Objetivos',
  '/plano-acao': 'Plano de Ação',
};

const Layout = ({ children }: { children: ReactNode }) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const title = pageTitles[location.pathname] ?? 'OrganizaFácil';
  const monthYearCapitalized = fmtMonthYear();

  return (
    <>
      <style>{styles}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <aside style={{
          width: 64, flexShrink: 0, background: 'var(--bg2)',
          borderRight: '1px solid var(--borda)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 12, paddingBottom: 12,
          position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
          gap: 4,
        }}>
          <div
            style={{
              width: 38, height: 38,
              border: '1px solid var(--verde-borda)',
              background: 'var(--verde-bg)',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}
            onClick={() => navigate('/dashboard')}
          >
            <Logo size={22} />
          </div>

          <button
            className={`of-nav-btn${location.pathname === '/dashboard' ? ' active' : ''}`}
            onClick={() => navigate('/dashboard')}
            title="Dashboard"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
            </svg>
          </button>

          {/* Receitas */}
          <button
            className={`of-nav-btn${location.pathname === '/receitas' ? ' active' : ''}`}
            onClick={() => navigate('/receitas')}
            title="Receitas"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </button>

          {/* Despesas */}
          <button
            className={`of-nav-btn${location.pathname === '/despesas' ? ' active' : ''}`}
            onClick={() => navigate('/despesas')}
            title="Despesas"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="14 2 14 8 20 8"/>
              <path d="M20 2H8l-6 6v12a2 2 0 002 2h16a2 2 0 002-2V2z"/>
            </svg>
          </button>

          {/* Objetivos */}
          <button
            className={`of-nav-btn${location.pathname === '/objetivos' ? ' active' : ''}`}
            onClick={() => navigate('/objetivos')}
            title="Objetivos"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </button>

          {/* Plano de Ação */}
          <button
            className={`of-nav-btn${location.pathname === '/plano-acao' ? ' active' : ''}`}
            onClick={() => navigate('/plano-acao')}
            title="Plano de Ação"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </button>

          <div style={{ flex: 1 }} />

          <button
            className="of-nav-btn"
            onClick={() => { logout(); navigate('/login'); }}
            title="Sair"
            style={{ color: 'var(--txt3)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </aside>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <header style={{
            height: 52, background: 'var(--bg2)',
            borderBottom: '1px solid var(--borda)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--txt)' }}>{title}</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                fontSize: 12, color: 'var(--txt3)',
                background: 'var(--bg3)',
                border: '1px solid var(--borda)',
                borderRadius: 20, padding: '3px 10px',
              }}>
                {monthYearCapitalized}
              </span>
              <div
                onClick={() => navigate('/perfil')}
                title="Meu Perfil"
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--verde-bg)',
                  border: '1px solid var(--verde-borda)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'var(--verde)',
                  flexShrink: 0, cursor: 'pointer', overflow: 'hidden',
                }}
              >
                {usuario?.fotoUrl ? (
                  <img src={usuario.fotoUrl} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  usuario?.nome?.[0]?.toUpperCase() ?? 'U'
                )}
              </div>
              <span
                onClick={() => navigate('/perfil')}
                style={{ fontSize: 13, color: 'var(--txt2)', fontWeight: 500, cursor: 'pointer' }}
              >
                {usuario?.nome
                  ? usuario.nome.trim().split(' ').filter(p => p.length > 1).slice(0, 2).join(' ') || usuario.nome.trim().split(' ')[0]
                  : 'Usuário'}
              </span>
            </div>
          </header>

          <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: 'var(--bg)' }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
