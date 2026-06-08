import { useMemo } from 'react';
import type { DashboardDTO, Objetivo } from '../types';

export interface PlanoItem {
  id: string;
  color: string;
  titulo: string;
  descricao: string;
  tipo: 'corte' | 'objetivo' | 'investimento' | 'divida';
  valor?: number;
}

export function computePlanoItems(data: DashboardDTO | null, objetivos: Objetivo[]): PlanoItem[] {
  if (!data || data.totalReceitas <= 0) return [];
  const items: PlanoItem[] = [];
  const rec = data.totalReceitas;

  // Necessidades > 50%?
  const necAtual = data.atualNecessidades;
  const necIdeal = rec * 0.5;
  if (necAtual > necIdeal + 1) {
    const excesso = necAtual - necIdeal;
    items.push({
      id: 'corte-fixas',
      color: '#60a5fa',
      titulo: 'Reduzir despesas fixas',
      descricao: `Economize R$ ${excesso.toFixed(0)}/mês — despesas fixas estão em ${((necAtual / rec) * 100).toFixed(0)}% da renda (ideal: 50%)`,
      tipo: 'corte',
      valor: excesso,
    });
  }

  // Desejos > 30%?
  const desAtual = data.atualDesejos;
  const desIdeal = rec * 0.3;
  if (desAtual > desIdeal + 1) {
    const excesso = desAtual - desIdeal;
    items.push({
      id: 'corte-variaveis',
      color: 'var(--roxo)',
      titulo: 'Cortar gastos variáveis',
      descricao: `Reduza R$ ${excesso.toFixed(0)}/mês para atingir o ideal de 30% da renda em desejos`,
      tipo: 'corte',
      valor: excesso,
    });
  }

  // Dívidas existem?
  if (data.totalDividas > 1) {
    const divPct = (data.totalDividas / rec) * 100;
    items.push({
      id: 'amortizar-dividas',
      color: 'var(--amarelo)',
      titulo: 'Amortizar dívidas',
      descricao: `Suas dívidas representam ${divPct.toFixed(0)}% da renda — priorize quitá-las para ter mais fôlego`,
      tipo: 'divida',
      valor: data.totalDividas,
    });
  }

  // Por objetivo
  for (const o of objetivos) {
    const faltante = Math.max(0, o.valorMeta - o.valorAtual);
    if (faltante <= 0) continue;
    const porMes = faltante / Math.max(1, o.prazoMeses);
    items.push({
      id: `objetivo-${o.id}`,
      color: 'var(--verde)',
      titulo: o.nome,
      descricao: `Guarde R$ ${porMes.toFixed(0)}/mês por ${o.prazoMeses} ${o.prazoMeses === 1 ? 'mês' : 'meses'} para atingir a meta`,
      tipo: 'objetivo',
      valor: porMes,
    });
  }

  // Investimentos abaixo do ideal?
  const invAtual = data.atualInvestimentos;
  const invIdeal = rec * 0.2;
  if (invAtual < invIdeal - 1 && items.length < 6) {
    items.push({
      id: 'investimento',
      color: '#4ade80',
      titulo: 'Aumentar investimentos',
      descricao: `Você investe ${((invAtual / rec) * 100).toFixed(0)}% da renda. Tente chegar em 20% (R$ ${(invIdeal - invAtual).toFixed(0)}/mês a mais)`,
      tipo: 'investimento',
      valor: invIdeal - invAtual,
    });
  }

  return items;
}

function usePlanoAcao(data: DashboardDTO | null, objetivos: Objetivo[]): PlanoItem[] {
  return useMemo(() => computePlanoItems(data, objetivos), [data, objetivos]);
}

export default usePlanoAcao;
