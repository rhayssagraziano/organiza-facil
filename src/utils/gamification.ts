import type { Objetivo } from '../types';

export const XP_PER_LEVEL = 500;
export const MILESTONES = [25, 50, 75, 100];
export const COIN_EMOJIS = ['🪙', '💰', '⭐', '💎'];
export const CONFETTI_COLORS = ['#22C55E', '#F59E0B', '#FCD34D', '#ffffff', '#16A34A', '#818CF8'];
export const PRESETS = [50, 100, 200, 500];

export const calcXP = (val: number): number =>
    Math.round(val * 0.4 + (val >= 200 ? 50 : 0) + (val >= 500 ? 80 : 0));

export const levelTitle = (lvl: number): string =>
    lvl <= 3 ? 'Poupador Iniciante'
        : lvl <= 6 ? 'Poupador Intermediário'
            : lvl <= 10 ? 'Poupador Avançado'
                : lvl <= 15 ? 'Poupador Expert'
                    : 'Poupador Mestre';

const GAME_KEY = 'pgm_last_game';

export type GameType = 'coinCatch' | 'runner';

export const getNextGame = (): GameType => {
    const last = localStorage.getItem(GAME_KEY);
    const next: GameType = last === 'coinCatch' ? 'runner' : 'coinCatch';
    localStorage.setItem(GAME_KEY, next);
    return next;
};

export const getObjetivoIcon = (nome: string): string => {
    const n = nome.toLowerCase();

    if (n.includes('viagem') || n.includes('férias') || n.includes('ferias') || n.includes('turismo') || n.includes('trip') || n.includes('viajar')) return '✈️';
    if (n.includes('europa') || n.includes('paris') || n.includes('orlando') || n.includes('cancún') || n.includes('cancun') || n.includes('disney') || n.includes('miami') || n.includes('eua') || n.includes('usa') || n.includes('internacional')) return '🌍';
    if (n.includes('praia') || n.includes('beach') || n.includes('ilha') || n.includes('resort')) return '🏖️';

    if (n.includes('carro') || n.includes('car') || n.includes('veículo') || n.includes('veiculo') || n.includes('automóvel') || n.includes('automovel')) return '🚗';
    if (n.includes('moto') || n.includes('motocicleta')) return '🏍️';
    if (n.includes('caminhão') || n.includes('caminhao') || n.includes('truck')) return '🚛';
    if (n.includes('bicicleta') || n.includes('bike')) return '🚲';

    if (n.includes('casa') || n.includes('apartamento') || n.includes('apê') || n.includes('ape') || n.includes('imóvel') || n.includes('imovel') || n.includes('moradia')) return '🏠';
    if (n.includes('terreno') || n.includes('lote') || n.includes('chácara') || n.includes('chacara') || n.includes('sítio') || n.includes('sitio')) return '🌿';

    if (n.includes('iphone') || n.includes('celular') || n.includes('smartphone') || n.includes('telefone')) return '📱';
    if (n.includes('notebook') || n.includes('computador') || n.includes('laptop') || n.includes('mac') || n.includes('pc')) return '💻';
    if (n.includes('playstation') || n.includes('ps5') || n.includes('ps4') || n.includes('xbox') || n.includes('nintendo') || n.includes('switch') || n.includes('console') || n.includes('game') || n.includes('jogo')) return '🎮';
    if (n.includes('tv') || n.includes('televisão') || n.includes('televisao') || n.includes('smart tv')) return '📺';
    if (n.includes('câmera') || n.includes('camera') || n.includes('foto') || n.includes('fotografia')) return '📷';
    if (n.includes('fone') || n.includes('headphone') || n.includes('airpod') || n.includes('som')) return '🎧';

    if (n.includes('faculdade') || n.includes('universidade') || n.includes('curso') || n.includes('estudos') || n.includes('escola') || n.includes('intercâmbio') || n.includes('intercambio') || n.includes('mba') || n.includes('pós') || n.includes('pos')) return '🎓';
    if (n.includes('livro') || n.includes('book') || n.includes('biblioteca')) return '📚';

    if (n.includes('academia') || n.includes('gym') || n.includes('musculação') || n.includes('musculacao') || n.includes('exercício') || n.includes('exercicio')) return '💪';
    if (n.includes('saúde') || n.includes('saude') || n.includes('médico') || n.includes('medico') || n.includes('cirurgia') || n.includes('tratamento') || n.includes('dentista')) return '🏥';
    if (n.includes('óculos') || n.includes('oculos') || n.includes('lente')) return '👓';

    if (n.includes('casamento') || n.includes('wedding') || n.includes('noivado') || n.includes('festa')) return '💍';
    if (n.includes('bebê') || n.includes('bebe') || n.includes('filho') || n.includes('filha') || n.includes('maternidade') || n.includes('enxoval')) return '👶';
    if (n.includes('presente') || n.includes('gift') || n.includes('natal') || n.includes('aniversário') || n.includes('aniversario')) return '🎁';

    if (n.includes('reserva') || n.includes('emergência') || n.includes('emergencia') || n.includes('fundo')) return '🛡️';
    if (n.includes('investimento') || n.includes('invest') || n.includes('aposentadoria') || n.includes('previdência') || n.includes('previdencia')) return '📈';
    if (n.includes('dívida') || n.includes('divida') || n.includes('débito') || n.includes('debito') || n.includes('empréstimo') || n.includes('emprestimo')) return '💳';
    if (n.includes('poupança') || n.includes('poupanca') || n.includes('economia') || n.includes('guardar')) return '🐷';

    if (n.includes('móveis') || n.includes('moveis') || n.includes('sofá') || n.includes('sofa') || n.includes('cama') || n.includes('guarda-roupa') || n.includes('decoração') || n.includes('decoracao') || n.includes('reforma')) return '🛋️';
    if (n.includes('cozinha') || n.includes('geladeira') || n.includes('fogão') || n.includes('fogao') || n.includes('eletrodoméstico') || n.includes('eletrodomestico')) return '🍳';

    if (n.includes('pet') || n.includes('cachorro') || n.includes('gato') || n.includes('animal') || n.includes('veterinário') || n.includes('veterinario')) return '🐾';

    if (n.includes('surf') || n.includes('skate') || n.includes('esporte')) return '🏄';
    if (n.includes('instrumento') || n.includes('violão') || n.includes('violao') || n.includes('guitarra') || n.includes('piano') || n.includes('música') || n.includes('musica')) return '🎸';
    if (n.includes('roupa') || n.includes('moda') || n.includes('vestuário') || n.includes('vestuario') || n.includes('tênis') || n.includes('tenis') || n.includes('sapato')) return '👟';

    return '🎯';
};

export function getNextMilestone(obj: Objetivo, done: number[]): { pct: number; xp: number } | null {
    const pct = obj.valorMeta > 0 ? (obj.valorAtual / obj.valorMeta) * 100 : 0;
    for (const m of MILESTONES) {
        if (!done.includes(m) && pct < m) return { pct: m, xp: m === 100 ? 500 : 180 };
    }
    return null;
}
