export interface Usuario {
id?: number;
nome: string;
email: string;
senha: string;
fotoUrl?: string;
}

export interface Receita {
id?: number;
descricao: string;
valor: number;
data: string;
tipo: string; // SALARIO, FREELANCE, INVESTIMENTO
usuario?: { id: number };
}

export interface Despesa {
id?: number;
descricao: string;
valor: number;
data: string;
tipo: string; // FIXA, VARIAVEL, PARCELA, DIVIDA
categoria?: string;
diaVencimento: number;
totalParcelas?: number;
parcelaAtual?: number;
valorParcela?: number;
valorOriginal?: number;
nomeCredor?: string;
negativada?: boolean;
usuario?: { id: number };
}

export interface Objetivo {
id?: number;
nome: string;
valorMeta: number;
valorAtual: number;
prazoMeses: number;
prioridade: string; // ALTA, MEDIA, BAIXA
tipo: string; // NORMAL, QUITACAO_DIVIDA
usuario?: { id: number };
}

export interface DashboardDTO {
totalReceitas: number;
totalDespesasFixas: number;
totalDespesasVariaveis: number;
totalDividas: number;
saldoDisponivel: number;
score: number;
classificacaoScore: string;
idealNecessidades: number;
idealDesejos: number;
idealInvestimentos: number;
atualNecessidades: number;
atualDesejos: number;
atualInvestimentos: number;
sugestoes: string[];
}