import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';

export function Navbar() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', height: 60,
            background: scrolled ? 'rgba(13,17,23,0.92)' : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
            transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Logo size={52} />
                <span style={{ fontWeight: 800, fontSize: 16, color: '#22C55E' }}>OrganizaFácil</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => navigate('/login')} style={{
                    padding: '7px 16px', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8,
                    color: '#F1F5F9', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                    Entrar
                </button>
                <button onClick={() => navigate('/cadastro')} style={{
                    padding: '7px 16px', background: '#22C55E', border: 'none',
                    borderRadius: 8, color: '#000', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                }}>
                    Começar grátis
                </button>
            </div>
        </nav>
    );
}
