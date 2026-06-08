import { useEffect, useRef, useState } from 'react';
import { loadAvatar } from '../../services/avatarService';
import { PiggyAvatar } from './PiggyAvatar';

const ARENA_W = 440;
const ARENA_H = 300;
const GROUND_Y = 240;
const PIGGY_W = 56;
const PIGGY_H = 56;
const PIGGY_X = 70;
const GRAVITY = 1.5;
const JUMP_VY = 18;
const GAME_DURATION = 15;
const TICK_MS = 50;

interface Obstacle {
    id: number;
    x: number;
    w: number;
    h: number;
    cleared: boolean;
}

interface Props {
    onConcluir: (score: number, victory: boolean) => void;
    onFechar: () => void;
}

export function PiggyRunner({ onConcluir, onFechar }: Props) {
    const [avatar] = useState(loadAvatar);
    const [piggyBottom, setPiggyBottom] = useState(0);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameRunning, setGameRunning] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [victory, setVictory] = useState(false);
    const [isJumping, setIsJumping] = useState(false);

    const piggyVyRef = useRef(0);
    const piggyBottomRef = useRef(0);
    const onGroundRef = useRef(true);
    const obstaclesRef = useRef<Obstacle[]>([]);
    const scoreRef = useRef(0);
    const speedRef = useRef(5);
    const frameRef = useRef(0);
    const obstacleIdRef = useRef(0);
    const gameRunningRef = useRef(false);
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const gameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cleanup = () => {
        if (tickRef.current) clearInterval(tickRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
        if (gameTimerRef.current) clearTimeout(gameTimerRef.current);
    };

    const endGame = (won: boolean) => {
        cleanup();
        gameRunningRef.current = false;
        setGameRunning(false);
        setGameEnded(true);
        setVictory(won);
        setObstacles([]);
    };

    const jump = () => {
        if (!onGroundRef.current) return;
        piggyVyRef.current = JUMP_VY;
        onGroundRef.current = false;
        setIsJumping(true);
    };

    const iniciarJogo = () => {
        cleanup();
        piggyVyRef.current = 0;
        piggyBottomRef.current = 0;
        onGroundRef.current = true;
        obstaclesRef.current = [];
        scoreRef.current = 0;
        speedRef.current = 5;
        frameRef.current = 0;
        obstacleIdRef.current = 0;

        setPiggyBottom(0);
        setObstacles([]);
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setGameEnded(false);
        setVictory(false);
        setIsJumping(false);
        gameRunningRef.current = true;
        setGameRunning(true);

        tickRef.current = setInterval(() => {
            frameRef.current += 1;

            if (!onGroundRef.current) {
                piggyVyRef.current -= GRAVITY;
                piggyBottomRef.current += piggyVyRef.current;
                if (piggyBottomRef.current <= 0) {
                    piggyBottomRef.current = 0;
                    piggyVyRef.current = 0;
                    onGroundRef.current = true;
                    setIsJumping(false);
                }
            }
            setPiggyBottom(piggyBottomRef.current);

            // velocidade aumenta 0.8 a cada 3s (60 ticks), máximo 14
            if (frameRef.current % 60 === 0) {
                speedRef.current = Math.min(speedRef.current + 0.8, 14);
            }

            let newScore = scoreRef.current;
            let newObstacles = obstaclesRef.current
                .map(o => {
                    const nx = o.x - speedRef.current;
                    if (!o.cleared && nx + o.w < PIGGY_X) {
                        newScore++;
                        return { ...o, x: nx, cleared: true };
                    }
                    return { ...o, x: nx };
                })
                .filter(o => o.x > -70);

            // primeiro obstáculo no frame 20, depois a cada 38 frames
            if (frameRef.current === 20 || (frameRef.current > 20 && (frameRef.current - 20) % 38 === 0)) {
                const heights = [35, 40, 45, 55, 60];
                const h = heights[Math.floor(Math.random() * heights.length)];
                newObstacles.push({
                    id: ++obstacleIdRef.current,
                    x: ARENA_W + 10,
                    w: 24,
                    h,
                    cleared: false,
                });
            }

            obstaclesRef.current = newObstacles;
            setObstacles([...newObstacles]);

            if (newScore !== scoreRef.current) {
                scoreRef.current = newScore;
                setScore(newScore);
            }

            // hitboxes reduzidas para dar margem ao jogador
            const piggyRight = PIGGY_X + PIGGY_W - 10;
            const piggyLeft = PIGGY_X + 10;
            const pb = piggyBottomRef.current;

            for (const obs of newObstacles) {
                if (obs.cleared) continue;
                const obsLeft = obs.x + 3;
                const obsRight = obs.x + obs.w - 3;
                if (piggyRight > obsLeft && piggyLeft < obsRight && pb < obs.h - 6) {
                    endGame(false);
                    return;
                }
            }
        }, TICK_MS);

        countdownRef.current = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);

        gameTimerRef.current = setTimeout(() => {
            endGame(true);
        }, GAME_DURATION * 1000);
    };

    useEffect(() => {
        iniciarJogo();
        return cleanup;
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && gameRunningRef.current) {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const handleConcluir = () => {
        setGameEnded(false);
        onConcluir(scoreRef.current, victory);
    };

    const handleFechar = () => {
        cleanup();
        onFechar();
    };

    const timerColor = timeLeft <= 3 ? 'var(--danger)' : timeLeft <= 5 ? 'var(--gold)' : 'var(--green-neon)';
    const piggyY = GROUND_Y - PIGGY_H - piggyBottom;
    const xpGanho = score * 25 + (victory ? 150 : 0);

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', zIndex: 1100, animation: 'fadeIn 0.25s ease',
            padding: 20,
        }}>
            <div style={{ width: '100%', maxWidth: ARENA_W, background: 'var(--bg-card)', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{
                    padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', borderBottom: '1px solid var(--border)',
                }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {gameEnded ? (victory ? '🏆 Sobreviveu!' : '💥 Game Over!') : '🐷 Pule os obstáculos!'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {gameRunning && (
                            <span style={{ fontSize: 13, fontWeight: 700, color: timerColor }}>
                                {timeLeft}s
                            </span>
                        )}
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>
                            ⭐ {score}
                        </span>
                    </div>
                </div>

                <div
                    onClick={() => { if (gameRunningRef.current) jump(); }}
                    style={{
                        position: 'relative', height: ARENA_H, background: 'var(--bg-element)',
                        overflow: 'hidden', cursor: gameRunning ? 'pointer' : 'default',
                        userSelect: 'none',
                    }}
                >
                    {[15, 80, 155, 230, 310, 390].map((x, i) => (
                        <div key={i} style={{
                            position: 'absolute', left: x, top: 18 + (i % 3) * 14,
                            width: 2, height: 2, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.18)',
                        }} />
                    ))}

                    <div style={{
                        position: 'absolute', top: GROUND_Y, left: 0, right: 0, height: 2,
                        background: 'rgba(255,255,255,0.15)',
                    }} />

                    {Array.from({ length: 14 }, (_, i) => (
                        <div key={i} style={{
                            position: 'absolute', top: GROUND_Y + 5,
                            left: 6 + i * 32, width: 18, height: 2,
                            background: 'rgba(255,255,255,0.06)', borderRadius: 2,
                        }} />
                    ))}

                    {(gameRunning || gameEnded) && (
                        <div style={{
                            position: 'absolute',
                            left: PIGGY_X,
                            top: piggyY,
                            width: PIGGY_W,
                            height: PIGGY_H,
                        }}>
                            <PiggyAvatar size={PIGGY_W} config={avatar} animated={!isJumping && gameRunning} />
                        </div>
                    )}

                    {obstacles.map(obs => (
                        <div key={obs.id} style={{ position: 'absolute', left: obs.x, top: GROUND_Y - obs.h }}>
                            <div style={{
                                width: obs.w, height: obs.h,
                                background: 'linear-gradient(180deg, #DC2626 0%, #991B1B 100%)',
                                borderRadius: '4px 4px 0 0',
                                borderTop: '3px solid #FCA5A5',
                            }} />
                            <div style={{
                                position: 'absolute',
                                left: -9, top: Math.round(obs.h * 0.28),
                                width: 9, height: 13,
                                background: '#991B1B',
                                borderRadius: '4px 0 0 4px',
                                borderTop: '2px solid #EF4444',
                            }} />
                            <div style={{
                                position: 'absolute',
                                right: -9, top: Math.round(obs.h * 0.48),
                                width: 9, height: 11,
                                background: '#991B1B',
                                borderRadius: '0 4px 4px 0',
                                borderTop: '2px solid #EF4444',
                            }} />
                        </div>
                    ))}

                    {gameEnded && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(0,0,0,0.62)',
                        }}>
                            <div style={{
                                background: victory ? 'var(--green-glow)' : 'rgba(239,68,68,0.10)',
                                border: `1px solid ${victory ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                borderRadius: 14, padding: '16px 28px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 12, color: victory ? 'var(--green-neon)' : 'var(--danger)', marginBottom: 4 }}>
                                    {victory ? 'Completou os 15 segundos!' : 'Atingido por um obstáculo!'}
                                </div>
                                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--gold-light)' }}>
                                    +{xpGanho} XP
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                                    {score} obstáculo{score !== 1 ? 's' : ''} pulado{score !== 1 ? 's' : ''}
                                    {victory ? ' + 150 bônus' : ''}
                                </div>
                            </div>
                        </div>
                    )}

                    {gameRunning && (
                        <div style={{
                            position: 'absolute', bottom: 6, left: 0, right: 0,
                            textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.18)',
                            pointerEvents: 'none',
                        }}>
                            Toque ou pressione Espaço / ↑ para pular
                        </div>
                    )}
                </div>

                <div style={{ padding: '14px 20px' }}>
                    {gameEnded ? (
                        <button onClick={handleConcluir} style={{
                            width: '100%', padding: '12px', background: 'var(--green-neon)', color: '#000',
                            border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 900, cursor: 'pointer',
                        }}>
                            Concluir (+{xpGanho} XP)
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
