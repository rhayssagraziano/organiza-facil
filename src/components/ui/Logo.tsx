import { useState, useId } from 'react';

interface LogoProps {
    size?: number;
}

const COIN_OFFSETS = [
    { x: 0,  delay: 0   },
    { x: 2,  delay: 0.5 },
    { x: -1, delay: 1.0 },
    { x: 3,  delay: 1.5 },
    { x: 1,  delay: 2.0 },
    { x: 0,  delay: 2.5 },
];

const Logo = ({ size = 56 }: LogoProps) => {
    const [jumping, setJumping] = useState(false);
    const uid = useId().replace(/:/g, '');

    const g = (name: string) => `${uid}${name}`;

    const showCoins = size >= 48;
    const coinSize = Math.round(size * 0.137);
    const coinBaseLeft = size / 2 - coinSize / 2;
    const coinEndY = Math.round(size * 0.057);
    const coinStartY = -(coinSize + 8);

    const css = `
        @keyframes pigFrontJump {
            0%   { transform: translateY(0px)   rotate(0deg)  scale(1);    }
            22%  { transform: translateY(-20px) rotate(-4deg) scale(1.06); }
            48%  { transform: translateY(-30px) rotate(0deg)  scale(1.1);  }
            72%  { transform: translateY(-12px) rotate(4deg)  scale(1.04); }
            90%  { transform: translateY(-3px)  rotate(0deg)  scale(1);    }
            100% { transform: translateY(0px)   rotate(0deg)  scale(1);    }
        }
        @keyframes pigEyeWink {
            0%, 80%, 100% { transform: scaleY(1);    }
            86%           { transform: scaleY(0.05); }
            93%           { transform: scaleY(1);    }
        }
        @keyframes coinFall {
            0%   { transform: translateY(${coinStartY}px); opacity: 0; }
            15%  { opacity: 1; }
            65%  { opacity: 1; }
            85%  { transform: translateY(${coinEndY}px); opacity: 0; }
            100% { transform: translateY(${coinEndY}px); opacity: 0; }
        }
        .pig-front-wrap {
            display: inline-flex;
            position: relative;
            cursor: pointer;
            user-select: none;
        }
        .pig-front-svg {
            filter: drop-shadow(0 6px 14px rgba(22,163,74,0.35));
            transition: filter 0.3s ease;
        }
        .pig-front-wrap:hover .pig-front-svg {
            filter: drop-shadow(0 12px 28px rgba(22,163,74,0.65));
        }
        .pig-front-svg.jumping {
            animation: pigFrontJump 0.72s cubic-bezier(0.36,0.07,0.19,0.97) forwards;
        }
        .pig-wink-grp {
            transform-box: fill-box;
            transform-origin: center;
            animation: pigEyeWink 5s ease-in-out infinite;
        }
    `;

    return (
        <>
            <style>{css}</style>
            <div
                className="pig-front-wrap"
                onMouseEnter={() => { if (!jumping) setJumping(true); }}
            >
                {showCoins && COIN_OFFSETS.map((c, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: coinBaseLeft + c.x,
                            top: 0,
                            pointerEvents: 'none',
                            animation: `coinFall 3s ease-in ${c.delay}s infinite`,
                            zIndex: 2,
                        }}
                    >
                        <svg width={coinSize} height={coinSize} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="#15803d" stroke="#14532d" strokeWidth="1.5" />
                            <ellipse cx="9" cy="8" rx="3.5" ry="2" fill="white" fillOpacity="0.25" transform="rotate(-20 9 8)" />
                            <text x="12" y="16" textAnchor="middle" fill="#bbf7d0" fontSize="7" fontWeight="900" fontFamily="system-ui,-apple-system,Arial,sans-serif">R$</text>
                        </svg>
                    </div>
                ))}
                <svg
                    className={`pig-front-svg${jumping ? ' jumping' : ''}`}
                    width={size}
                    height={size}
                    viewBox="0 0 160 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onAnimationEnd={(e) => { if (e.animationName === 'pigFrontJump') setJumping(false); }}
                >
                    <defs>
                        <radialGradient id={g('body')} cx="33%" cy="26%" r="70%">
                            <stop offset="0%"   stopColor="#bbf7d0" />
                            <stop offset="38%"  stopColor="#4ade80" />
                            <stop offset="75%"  stopColor="#16a34a" />
                            <stop offset="100%" stopColor="#14532d" />
                        </radialGradient>
                        <radialGradient id={g('ear')} cx="36%" cy="28%" r="72%">
                            <stop offset="0%"   stopColor="#86efac" />
                            <stop offset="100%" stopColor="#166534" />
                        </radialGradient>
                        <radialGradient id={g('snout')} cx="38%" cy="32%" r="68%">
                            <stop offset="0%"   stopColor="#86efac" />
                            <stop offset="100%" stopColor="#15803d" />
                        </radialGradient>
                        <radialGradient id={g('leg')} cx="36%" cy="24%" r="72%">
                            <stop offset="0%"   stopColor="#86efac" />
                            <stop offset="100%" stopColor="#14532d" />
                        </radialGradient>
                    </defs>

                    {/* ── PATAS TRASEIRAS (atrás do corpo) ── */}
                    <rect x="40"  y="130" width="15" height="24" rx="7.5" fill={`url(#${g('leg')})`} stroke="#14532d" strokeWidth="1.5" />
                    <rect x="105" y="130" width="15" height="24" rx="7.5" fill={`url(#${g('leg')})`} stroke="#14532d" strokeWidth="1.5" />

                    {/* ── ORELHA ESQUERDA (atrás do corpo) ── */}
                    <ellipse cx="40" cy="42" rx="15" ry="21"
                        fill={`url(#${g('ear')})`} stroke="#14532d" strokeWidth="1.5"
                        transform="rotate(-16 40 42)" />
                    <ellipse cx="40" cy="43" rx="8" ry="12"
                        fill="#a7f3d0" fillOpacity="0.55"
                        transform="rotate(-16 40 43)" />

                    {/* ── ORELHA DIREITA (atrás do corpo) ── */}
                    <ellipse cx="120" cy="42" rx="15" ry="21"
                        fill={`url(#${g('ear')})`} stroke="#14532d" strokeWidth="1.5"
                        transform="rotate(16 120 42)" />
                    <ellipse cx="120" cy="43" rx="8" ry="12"
                        fill="#a7f3d0" fillOpacity="0.55"
                        transform="rotate(16 120 43)" />

                    {/* ── CORPO PRINCIPAL ── */}
                    <circle cx="80" cy="85" r="52"
                        fill={`url(#${g('body')})`} stroke="#14532d" strokeWidth="2" />

                    {/* Brilho superior */}
                    <ellipse cx="61" cy="61" rx="21" ry="13"
                        fill="white" fillOpacity="0.2"
                        transform="rotate(-26 61 61)" />

                    {/* ── BOCHECHAS ── */}
                    <ellipse cx="37" cy="93" rx="14" ry="9" fill="#22c55e" fillOpacity="0.5" />
                    <ellipse cx="123" cy="93" rx="14" ry="9" fill="#22c55e" fillOpacity="0.5" />

                    {/* ── OLHO ESQUERDO (sempre aberto) ── */}
                    <ellipse cx="62" cy="74" rx="10" ry="12" fill="white" />
                    <circle  cx="63" cy="75" r="7"  fill="#0c1a0e" />
                    <circle  cx="65.5" cy="72.5" r="2.5" fill="white" />
                    <circle  cx="61"   cy="78"   r="1.2" fill="white" fillOpacity="0.45" />

                    {/* ── OLHO DIREITO (pisca / wink) ── */}
                    <g className="pig-wink-grp">
                        <ellipse cx="98" cy="74" rx="10" ry="12" fill="white" />
                        <circle  cx="99" cy="75" r="7"  fill="#0c1a0e" />
                        <circle  cx="101.5" cy="72.5" r="2.5" fill="white" />
                        <circle  cx="97"    cy="78"   r="1.2" fill="white" fillOpacity="0.45" />
                    </g>

                    {/* ── GRÁFICO DE BARRAS (barriga) ── */}
                    <rect x="53" y="112" width="54" height="22" rx="6" fill="#000" fillOpacity="0.18" />
                    <line x1="56" y1="130" x2="104" y2="130" stroke="#22d3ee" strokeWidth="1.1" strokeOpacity="0.65" />
                    {/* Barra 1 — baixa */}
                    <rect x="61" y="123" width="10" height="7"  rx="2.5" fill="#22d3ee" fillOpacity="0.9" />
                    <rect x="61" y="123" width="10" height="3"  rx="2.5" fill="#a5f3fc" fillOpacity="0.8" />
                    {/* Barra 2 — média */}
                    <rect x="75" y="117" width="10" height="13" rx="2.5" fill="#22d3ee" fillOpacity="0.9" />
                    <rect x="75" y="117" width="10" height="3"  rx="2.5" fill="#a5f3fc" fillOpacity="0.8" />
                    {/* Barra 3 — alta */}
                    <rect x="89" y="112" width="10" height="18" rx="2.5" fill="#22d3ee" fillOpacity="0.9" />
                    <rect x="89" y="112" width="10" height="3"  rx="2.5" fill="#a5f3fc" fillOpacity="0.8" />

                    {/* ── FOCINHO ── */}
                    <ellipse cx="80" cy="96" rx="22" ry="16"
                        fill={`url(#${g('snout')})`} stroke="#15803d" strokeWidth="1.5" />
                    {/* Brilho focinho */}
                    <ellipse cx="72" cy="89" rx="6" ry="3.5"
                        fill="white" fillOpacity="0.2" transform="rotate(-20 72 89)" />
                    {/* Narinas */}
                    <ellipse cx="71" cy="98" rx="5.5" ry="4.5" fill="#14532d" fillOpacity="0.55" />
                    <ellipse cx="89" cy="98" rx="5.5" ry="4.5" fill="#14532d" fillOpacity="0.55" />

                    {/* ── SORRISO ── */}
                    <path d="M67 110 Q80 120 93 110"
                        stroke="#15803d" strokeWidth="2.2"
                        strokeLinecap="round" fill="none" />

                    {/* ── PATAS DIANTEIRAS ── */}
                    <rect x="55"  y="132" width="15" height="24" rx="7.5" fill={`url(#${g('leg')})`} stroke="#14532d" strokeWidth="1.5" />
                    <rect x="90"  y="132" width="15" height="24" rx="7.5" fill={`url(#${g('leg')})`} stroke="#14532d" strokeWidth="1.5" />

                    {/* ── SLOT DA MOEDA (topo da cabeça) ── */}
                    <rect x="67" y="31" width="26" height="7" rx="3.5" fill="#0a2e13" stroke="#14532d" strokeWidth="1" />
                    <rect x="69" y="36" width="22" height="3" rx="1.5" fill="#000" fillOpacity="0.25" />


                    {/* ── ESTRELINHAS DECORATIVAS ── */}
                    <g transform="translate(13,30)">
                        <line x1="0" y1="-8" x2="0" y2="8"   stroke="#86efac" strokeWidth="2"   strokeLinecap="round" />
                        <line x1="-8" y1="0" x2="8" y2="0"   stroke="#86efac" strokeWidth="2"   strokeLinecap="round" />
                        <line x1="-5" y1="-5" x2="5" y2="5"  stroke="#86efac" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="5"  y1="-5" x2="-5" y2="5" stroke="#86efac" strokeWidth="1.2" strokeLinecap="round" />
                    </g>
                    <g transform="translate(150,24)">
                        <line x1="0" y1="-5" x2="0" y2="5"  stroke="#86efac" strokeWidth="1.6" strokeLinecap="round" />
                        <line x1="-5" y1="0" x2="5" y2="0"  stroke="#86efac" strokeWidth="1.6" strokeLinecap="round" />
                    </g>
                    <g transform="translate(152,110)">
                        <line x1="0" y1="-4" x2="0" y2="4"  stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" />
                        <line x1="-4" y1="0" x2="4" y2="0"  stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" />
                    </g>
                    <circle cx="10"  cy="65"  r="2.5" fill="#4ade80"  fillOpacity="0.7" />
                    <circle cx="150" cy="60"  r="2"   fill="#86efac"  fillOpacity="0.8" />
                    <circle cx="8"   cy="118" r="1.8" fill="#4ade80"  fillOpacity="0.6" />
                    <circle cx="152" cy="142" r="2"   fill="#86efac"  fillOpacity="0.7" />
                    <circle cx="24"  cy="150" r="1.5" fill="#4ade80"  fillOpacity="0.5" />
                </svg>
            </div>
        </>
    );
};

export default Logo;
