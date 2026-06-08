
export const fmt = (v: number | null | undefined): string =>
  (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


export const fmtPercent = (value: number, total: number): string => {
  if (total <= 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};


export const todayISO = (): string =>
  new Date().toISOString().split('T')[0];


export const todayLong = (): string => {
  const s = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
};


export const fmtMonthYear = (): string => {
  const s = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
};


export const fmtDate = (dateStr: string): string => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};


export const fmtMonths = (months: number): string =>
  `${months} ${months === 1 ? 'mês' : 'meses'}`;
