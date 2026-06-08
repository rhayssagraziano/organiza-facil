import type { Despesa } from '../types';

function toICSDate(year: number, month: number, day: number): string {
  return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
}

export function gerarICS(despesas: Despesa[]): string {
  const contas = despesas.filter(d => d.diaVencimento);
  if (contas.length === 0) return '';

  const now = new Date();
  const year = now.getFullYear();
  const monthIdx = now.getMonth();
  const monthNum = monthIdx + 1;

  const events = contas.map((d, i) => {
    const lastDay = new Date(year, monthIdx + 1, 0).getDate();
    const day = Math.min(d.diaVencimento!, lastDay);
    const dateStr = toICSDate(year, monthNum, day);
    const uid = `organizafacil-${d.id ?? i}-${Date.now()}@app`;
    const valor = d.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `RRULE:FREQ=MONTHLY;BYMONTHDAY=${day}`,
      `SUMMARY:Vencimento: ${d.descricao}`,
      `DESCRIPTION:Valor: ${valor}\\nTipo: ${d.tipo}`,
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Amanhã vence: ${d.descricao} (${valor})`,
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OrganizaFácil//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICS(despesas: Despesa[], filename = 'lembretes-vencimento.ics'): boolean {
  const content = gerarICS(despesas);
  if (!content) return false;
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}
