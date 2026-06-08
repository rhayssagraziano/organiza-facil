import type { AvatarConfig } from '../../types/gamification';
import { DARK, LIGHT, defaultAvatar } from '../../services/avatarService';
import { ChestItem } from './ChestItem';

export function PiggyAvatar({ size = 80, config, animated = false }: {
    size?: number; config?: AvatarConfig; animated?: boolean;
}) {
    const cfg = config ?? defaultAvatar;
    const skin = cfg.skinColor;
    const dark = DARK[skin] ?? '#16A34A';
    const light = LIGHT[skin] ?? '#4ADE80';
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={animated ? { animation: 'piggyBounce 1.8s ease-in-out infinite' } : undefined}>
            <ellipse cx="50" cy="65" rx="28" ry="25" fill={skin} />
            <ellipse cx="50" cy="70" rx="17" ry="13" fill={light} />
            <circle cx="50" cy="36" r="22" fill={skin} />
            <circle cx="31" cy="17" r="9" fill={skin} />
            <circle cx="31" cy="17" r="6" fill={dark} />
            <circle cx="69" cy="17" r="9" fill={skin} />
            <circle cx="69" cy="17" r="6" fill={dark} />
            <ellipse cx="34" cy="42" rx="7" ry="5" fill={dark} opacity="0.5" />
            <ellipse cx="66" cy="42" rx="7" ry="5" fill={dark} opacity="0.5" />
            <circle cx="41" cy="33" r="5" fill="white" />
            <circle cx="59" cy="33" r="5" fill="white" />
            <circle cx="42" cy="33" r="3" fill="#1A1A2E" />
            <circle cx="60" cy="33" r="3" fill="#1A1A2E" />
            <circle cx="43" cy="31" r="1.2" fill="white" />
            <circle cx="61" cy="31" r="1.2" fill="white" />
            <ellipse cx="50" cy="44" rx="10" ry="7" fill={dark} />
            <circle cx="46.5" cy="44" r="2.2" fill="#0F4C25" />
            <circle cx="53.5" cy="44" r="2.2" fill="#0F4C25" />
            <path d="M44 50 Q50 54 56 50" stroke="#0F4C25" strokeWidth="1.5" strokeLinecap="round" />

            {/* Chapeis */}
            {cfg.hat === 'bone' && (<>
                <rect x="26" y="14" width="48" height="4" rx="2" fill="#16A34A" />
                <rect x="34" y="7" width="32" height="10" rx="4" fill="#22C55E" />
                <rect x="34" y="7" width="32" height="4" rx="2" fill="#16A34A" opacity="0.5" />
            </>)}
            {cfg.hat === 'coroa' && (<>
                <polygon points="34,14 38,5 44,13 50,3 56,13 62,5 66,14" fill="#F59E0B" />
                <rect x="33" y="13" width="34" height="5" rx="1" fill="#F59E0B" />
                <circle cx="38" cy="5" r="2" fill="#FCD34D" /><circle cx="50" cy="3" r="2" fill="#FCD34D" /><circle cx="62" cy="5" r="2" fill="#FCD34D" />
            </>)}
            {cfg.hat === 'festa' && (<>
                <polygon points="50,1 62,16 38,16" fill="#818CF8" />
                <circle cx="50" cy="1" r="2.5" fill="#F59E0B" />
                <rect x="34" y="14" width="32" height="3" rx="1.5" fill="#6366F1" />
                <circle cx="40" cy="12" r="1.5" fill="#F59E0B" /><circle cx="60" cy="12" r="1.5" fill="#FCD34D" />
            </>)}
            {cfg.hat === 'cowboy' && (<>
                <rect x="35" y="5" width="30" height="12" rx="3" fill="#A0522D" />
                <rect x="39" y="5" width="22" height="5" rx="2" fill="#8B4513" opacity="0.5" />
                <path d="M 16 16 Q 50 21 84 16 L 82 18 Q 50 23 18 18 Z" fill="#8B4513" />
                <rect x="35" y="15" width="30" height="3" fill="#5C3317" />
                <rect x="47" y="15" width="6" height="3" rx="1" fill="#F59E0B" />
            </>)}
            {cfg.hat === 'magico' && (<>
                <rect x="36" y="1" width="28" height="17" rx="2" fill="#1E1B4B" />
                <rect x="26" y="16" width="48" height="5" rx="2" fill="#1E1B4B" />
                <rect x="36" y="16" width="28" height="3" rx="1" fill="white" opacity="0.85" />
                <polygon points="50,5 51.8,10.5 57.5,10.5 52.9,13.5 54.7,19 50,16 45.3,19 47.1,13.5 42.5,10.5 48.2,10.5" fill="#F59E0B" />
            </>)}

            {/* Oculos */}
            {cfg.glasses === 'sol' && (<>
                <path d="M 31 28 L 49 28 L 47 40 Q 41 45 33 40 Z" fill="rgba(0,0,0,0.75)" stroke="#1A1A2E" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 51 28 L 69 28 L 67 40 Q 59 45 53 40 Z" fill="rgba(0,0,0,0.75)" stroke="#1A1A2E" strokeWidth="2" strokeLinejoin="round" />
                <line x1="49" y1="33" x2="51" y2="33" stroke="#1A1A2E" strokeWidth="1.5" />
                <line x1="31" y1="28" x2="15" y2="25" stroke="#1A1A2E" strokeWidth="1.5" />
                <line x1="69" y1="28" x2="85" y2="25" stroke="#1A1A2E" strokeWidth="1.5" />
                <path d="M 33 30 L 41 30 L 39 35 Q 36 37 33 35 Z" fill="white" opacity="0.28" />
                <path d="M 53 30 L 61 30 L 59 35 Q 56 37 53 35 Z" fill="white" opacity="0.28" />
            </>)}
            {cfg.glasses === 'redondo' && (<>
                <circle cx="41" cy="33" r="7" fill="none" stroke="#F59E0B" strokeWidth="2" />
                <circle cx="59" cy="33" r="7" fill="none" stroke="#F59E0B" strokeWidth="2" />
                <line x1="48" y1="33" x2="52" y2="33" stroke="#F59E0B" strokeWidth="1.5" />
                <line x1="30" y1="33" x2="34" y2="33" stroke="#F59E0B" strokeWidth="1.5" />
                <line x1="66" y1="33" x2="70" y2="33" stroke="#F59E0B" strokeWidth="1.5" />
            </>)}
            {cfg.glasses === 'estrela' && (<>
                <polygon points="41,26 43,31 48,31 44,34 46,39 41,36 36,39 38,34 34,31 39,31" fill="rgba(167,139,250,0.85)" stroke="#8B5CF6" strokeWidth="1" />
                <polygon points="59,26 61,31 66,31 62,34 64,39 59,36 54,39 56,34 52,31 57,31" fill="rgba(167,139,250,0.85)" stroke="#8B5CF6" strokeWidth="1" />
                <line x1="48" y1="33" x2="52" y2="33" stroke="#8B5CF6" strokeWidth="1.5" />
                <line x1="30" y1="33" x2="34" y2="33" stroke="#8B5CF6" strokeWidth="1.5" />
                <line x1="66" y1="33" x2="70" y2="33" stroke="#8B5CF6" strokeWidth="1.5" />
            </>)}
            {cfg.glasses === 'coracao' && (<>
                <path d="M41 29C41 27 36 27 36 30C36 34 41 38 41 38C41 38 46 34 46 30C46 27 41 27 41 29Z" fill="rgba(236,72,153,0.85)" stroke="#BE185D" strokeWidth="1" />
                <path d="M59 29C59 27 54 27 54 30C54 34 59 38 59 38C59 38 64 34 64 30C64 27 59 27 59 29Z" fill="rgba(236,72,153,0.85)" stroke="#BE185D" strokeWidth="1" />
                <line x1="46" y1="32" x2="54" y2="32" stroke="#BE185D" strokeWidth="1.5" />
                <line x1="30" y1="32" x2="36" y2="32" stroke="#BE185D" strokeWidth="1.5" />
                <line x1="64" y1="32" x2="70" y2="32" stroke="#BE185D" strokeWidth="1.5" />
            </>)}

            {/* Pescoço */}
            {cfg.neck === 'corrente' && (<>
                {[44, 47, 50, 53, 56].map(x => (
                    <circle key={x} cx={x} cy="57" r="2" fill="#F59E0B" stroke="#D97706" strokeWidth="0.5" />
                ))}
            </>)}
            {cfg.neck === 'gravata_borboleta' && (<>
                <polygon points="44,54 50,58 44,62" fill="#EF4444" />
                <polygon points="56,54 50,58 56,62" fill="#EF4444" />
                <circle cx="50" cy="58" r="2.5" fill="#DC2626" />
            </>)}
            {cfg.neck === 'gravata' && (<>
                <polygon points="48,52 52,52 51,57 50,56 49,57" fill="#1D4ED8" />
                <polygon points="49,57 51,57 55,75 50,79 45,75" fill="#2563EB" />
                <line x1="47" y1="63" x2="53" y2="63" stroke="white" strokeWidth="1" opacity="0.3" />
                <line x1="46" y1="69" x2="54" y2="69" stroke="white" strokeWidth="1" opacity="0.3" />
            </>)}
            {cfg.neck === 'flores' && (<>
                {[
                    { cx: 38, cy: 57, c: '#F472B6' },
                    { cx: 44, cy: 54, c: '#FCD34D' },
                    { cx: 50, cy: 57, c: '#4ADE80' },
                    { cx: 56, cy: 54, c: '#F472B6' },
                    { cx: 62, cy: 57, c: '#FCD34D' },
                ].map((f, i) => (
                    <g key={i}>
                        {[0, 72, 144, 216, 288].map(a => (
                            <ellipse key={a}
                                cx={f.cx + 4 * Math.cos((a - 90) * Math.PI / 180)}
                                cy={f.cy + 4 * Math.sin((a - 90) * Math.PI / 180)}
                                rx="2.2" ry="2.2" fill={f.c} opacity="0.9"
                            />
                        ))}
                        <circle cx={f.cx} cy={f.cy} r="2.2" fill="#FCD34D" stroke="white" strokeWidth="0.5" />
                    </g>
                ))}
            </>)}

            <ChestItem item={cfg.chest} />
        </svg>
    );
}
