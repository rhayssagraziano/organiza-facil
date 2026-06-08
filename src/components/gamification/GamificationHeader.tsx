import type { AvatarConfig } from '../../types/gamification';
import { PiggyAvatar } from './PiggyAvatar';
import { XP_PER_LEVEL, levelTitle } from '../../utils/gamification';

interface Props {
    avatar: AvatarConfig;
    level: number;
    xpInLevel: number;
    xpTotal: number;
    onAvatarClick: () => void;
}

export function GamificationHeader({ avatar, level, xpInLevel, xpTotal, onAvatarClick }: Props) {
    return (
        <div style={{
            background: 'var(--bg-card)', borderRadius: 14, padding: '16px 20px',
            marginBottom: 20, border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 16,
        }}>
            <div
                onClick={onAvatarClick}
                style={{
                    position: 'relative', cursor: 'pointer', flexShrink: 0,
                    borderRadius: '50%', border: '2px solid rgba(34,197,94,0.4)',
                    padding: 3, background: 'var(--bg-element)',
                }}
            >
                <PiggyAvatar size={64} config={avatar} />
                <div style={{
                    position: 'absolute', bottom: 2, right: 2,
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8890A6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>Piggy</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>·</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{levelTitle(level)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Nível {level}</span>
                    <div style={{ flex: 1, height: 6, background: 'var(--bg-element)', borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', borderRadius: 6, background: 'var(--green-neon)',
                            width: `${(xpInLevel / XP_PER_LEVEL) * 100}%`,
                            transition: 'width 0.6s ease',
                        }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {xpInLevel}/{XP_PER_LEVEL} XP
                    </span>
                </div>
            </div>

            <div style={{
                flexShrink: 0, padding: '5px 12px',
                background: 'var(--gold-glow)', border: '1px solid rgba(245,158,11,0.4)',
                borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'var(--gold)',
                whiteSpace: 'nowrap',
            }}>
                ⭐ {xpTotal} XP
            </div>
        </div>
    );
}
