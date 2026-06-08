import { useEffect, useRef, useState } from 'react';
import { COIN_EMOJIS } from '../../utils/gamification';

interface CoinData {
    id: number;
    x: number;
    top: number;
    emoji: string;
    speed: number;
}

interface Props {
    onConcluir: (score: number) => void;
    onFechar: () => void;
}

const GAME_DURATION = 8;
const TICK_MS = 50;
const COIN_LIMIT = 8;

export function CoinCatchGame({ onConcluir, onFechar }: Props) {
    const [gameScore, setGameScore] = useState(0);
    const [gameRunning, setGameRunning] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [coins, setCoins] = useState<CoinData[]>([]);

    const scoreRef = useRef(0);
    const coinIdRef = useRef(0);
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const gameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cleanup = () => {
        if (tickRef.current) clearInterval(tickRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
        if (gameTimerRef.current) clearTimeout(gameTimerRef.current);
    };

    const iniciarJogo = () => {
        cleanup();
        scoreRef.current = 0;
        coinIdRef.current = 0;
        setGameScore(0);
        setGameEnded(false);
        setTimeLeft(GAME_DURATION);
        setCoins([]);
        setGameRunning(true);

        tickRef.current = setInterval(() => {
            setCoins(prev => {
                const moved = prev
                    .map(c => ({ ...c, top: c.top + c.speed }))
                    .filter(c => c.top < 110);

                if (moved.length < COIN_LIMIT && Math.random() < 0.15) {
                    moved.push({
                        id: ++coinIdRef.current,
                        x: 4 + Math.random() * 82,
                        top: -10,
                        emoji: COIN_EMOJIS[Math.floor(Math.random() * COIN_EMOJIS.length)],
                        speed: 1.4 + Math.random() * 1.8,
                    });
                }
                return moved;
            });
        }, TICK_MS);

        countdownRef.current = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);

        gameTimerRef.current = setTimeout(() => {
            cleanup();
            setGameRunning(false);
            setGameEnded(true);
            setCoins([]);
        }, GAME_DURATION * 1000);
    };

    useEffect(() => {
        iniciarJogo();
        return cleanup;
    }, []);

    const catchCoin = (id: number) => {
        if (!gameRunning) return;
        setCoins(prev => prev.filter(c => c.id !== id));
        setGameScore(prev => {
            const next = prev + 1;
            scoreRef.current = next;
            return next;
        });
    };

    const handleConcluir = () => {
        setGameEnded(false);
        onConcluir(scoreRef.current);
    };

    const handleFechar = () => {
        cleanup();
        onFechar();
    };

    const timerColor = timeLeft <= 3 ? 'var(--danger)' : timeLeft <= 5 ? 'var(--gold)' : 'var(--green-neon)';

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', zIndex: 1100, animation: 'fadeIn 0.25s ease',
            padding: 20,
        }}>
            <div style={{ width: '100%', maxWidth: 440, background: 'var(--bg-card)', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{
                    padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', borderBottom: '1px solid var(--border)',
                }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {gameEnded ? '✅ Tempo esgotado!' : '🪙 Pegue as moedas!'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {gameRunning && (
                            <span style={{ fontSize: 13, fontWeight: 700, color: timerColor, minWidth: 28, textAlign: 'right' }}>
                                {timeLeft}s
                            </span>
                        )}
                        <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--gold)' }}>
                            🪙 {gameScore}
                        </span>
                    </div>
                </div>

                <div style={{
                    position: 'relative', height: 300, background: 'var(--bg-element)',
                    overflow: 'hidden', cursor: gameRunning ? 'crosshair' : 'default',
                    userSelect: 'none',
                }}>
                    {gameRunning && coins.map(c => (
                        <button
                            key={c.id}
                            onClick={() => catchCoin(c.id)}
                            style={{
                                position: 'absolute',
                                left: `${c.x}%`,
                                top: `${c.top}%`,
                                background: 'none',
                                border: 'none',
                                fontSize: 34,
                                cursor: 'pointer',
                                padding: 4,
                                lineHeight: 1,
                                transform: 'translateZ(0)',
                                willChange: 'top',
                            }}
                        >
                            {c.emoji}
                        </button>
                    ))}

                    {!gameRunning && !gameEnded && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <button onClick={iniciarJogo} style={{
                                padding: '14px 32px', background: 'var(--green-neon)', color: '#000',
                                border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 900, cursor: 'pointer',
                            }}>
                                Iniciar ({GAME_DURATION}s)
                            </button>
                        </div>
                    )}

                    {gameEnded && (
                        <div style={{
                            position: 'absolute', inset: 0, display: 'flex',
                            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(0,0,0,0.6)',
                        }}>
                            <div style={{
                                background: 'var(--gold-glow)', border: '1px solid rgba(245,158,11,0.3)',
                                borderRadius: 14, padding: '16px 24px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 4 }}>XP conquistado</div>
                                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--gold-light)' }}>+{gameScore * 18} XP</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                                    {gameScore} moeda{gameScore !== 1 ? 's' : ''} × 18 XP
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ padding: '14px 20px' }}>
                    {gameEnded ? (
                        <button onClick={handleConcluir} style={{
                            width: '100%', padding: '12px', background: 'var(--green-neon)', color: '#000',
                            border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 900, cursor: 'pointer',
                        }}>
                            Concluir (+{gameScore * 18} XP)
                        </button>
                    ) : (
                        <button onClick={handleFechar} style={{
                            width: '100%', padding: '11px', background: 'none',
                            border: '1px solid var(--border-md)', borderRadius: 10,
                            color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
                        }}>
                            Fechar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
