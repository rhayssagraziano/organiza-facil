import type { Objetivo } from '../../types';
import type { AvatarConfig } from '../../types/gamification';
import { PiggyAvatar } from './PiggyAvatar';
import { fmt } from '../../utils/format';

interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    delay: number;
    size: number;
}

interface Props {
    objetivo: Objetivo;
    avatar: AvatarConfig;
    confetti: ConfettiPiece[];
    onShare: () => void;
    onFechar: () => void;
}

export function CelebrationScreen({ objetivo, avatar, confetti, onShare, onFechar }: Props) {
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'var(--bg-card)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', zIndex: 1200, padding: 24,
            animation: 'fadeIn 0.3s ease', overflow: 'hidden',
        }}>
            {confetti.map(c => (
                <div key={c.id} style={{
                    position: 'absolute', left: `${c.x}%`, top: 0,
                    width: c.size, height: c.size,
                    background: c.color, borderRadius: c.id % 3 === 0 ? '50%' : 2,
                    animation: `confettiFall ${1.5 + c.delay}s ${c.delay}s ease-out forwards`,
                    pointerEvents: 'none',
                }} />
            ))}

            <PiggyAvatar size={120} config={avatar} animated />
            <div style={{ marginTop: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--gold)', marginBottom: 6 }}>
                    🎉 Objetivo concluído!
                </div>
                <div style={{ fontSize: 15, color: 'var(--green-neon)', marginBottom: 4 }}>{objetivo.nome}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--gold)', margin: '12px 0' }}>
                    {fmt(objetivo.valorMeta)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
                    Meta atingida! +500 XP conquistados 🏆
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
                    <button
                        onClick={onShare}
                        style={{
                            padding: '13px', background: 'var(--gold)', color: '#000',
                            border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 900, cursor: 'pointer',
                        }}>
                        Compartilhar conquista 🏆
                    </button>
                    <button onClick={onFechar}
                        style={{
                            padding: '12px', background: 'none',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 10, fontSize: 13, color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                        }}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
