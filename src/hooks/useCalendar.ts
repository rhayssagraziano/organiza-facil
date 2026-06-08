import { useState, useRef, useCallback } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import type { Despesa } from '../types';

interface UseCalendarResult {
  isConnected: boolean;
  syncing: boolean;
  message: string;
  connect: () => void;
  disconnect: () => void;
}

const STORAGE_KEY = 'gcal_connected';

function useCalendar(despesas: Despesa[]): UseCalendarResult {
  const [isConnected, setIsConnected] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const despesasRef = useRef(despesas);
  despesasRef.current = despesas;

  const handleSuccess = useCallback(async (tokenResponse: { access_token: string }) => {
    setSyncing(true);
    setMessage('');
    try {
      const contas = despesasRef.current.filter(d => d.diaVencimento);
      const now = new Date();
      const year = now.getFullYear();
      const monthIdx = now.getMonth();
      let created = 0;
      for (const d of contas) {
        try {
          const lastDay = new Date(year, monthIdx + 1, 0).getDate();
          const day = Math.min(d.diaVencimento!, lastDay);
          const date = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              summary: `Vencimento: ${d.descricao}`,
              description: `Valor: ${d.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nTipo: ${d.tipo}`,
              start: { date },
              end: { date },
              recurrence: [`RRULE:FREQ=MONTHLY;BYMONTHDAY=${day}`],
              reminders: {
                useDefault: false,
                overrides: [
                  { method: 'email', minutes: 1440 },
                  { method: 'popup', minutes: 60 },
                ],
              },
            }),
          });
          if (res.ok) created++;
        } catch { /* skip individual failures */ }
      }
      setIsConnected(true);
      localStorage.setItem(STORAGE_KEY, 'true');
      setMessage(
        created > 0
          ? `✓ ${created} lembrete(s) adicionado(s) ao Google Agenda.`
          : '✓ Google Agenda conectado com sucesso.'
      );
    } catch {
      setMessage('Erro ao criar eventos. Tente novamente.');
    } finally {
      setSyncing(false);
    }
  }, []);

  const googleLogin = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.events',
    include_granted_scopes: false,
    onSuccess: handleSuccess,
    onError: (err) => {
      const nonOAuth = err as { type?: string };
      if (nonOAuth?.type === 'popup_closed') {
        setMessage('Popup fechado. Se viu um aviso, clique em "Avançado" → "Acessar o app".');
      } else if (nonOAuth?.type === 'popup_failed_to_open') {
        setMessage('Popup bloqueado. Permita popups para este site e tente novamente.');
      } else {
        setMessage('Não foi possível conectar ao Google Agenda. Tente novamente.');
      }
    },
  });

  const connect = useCallback(() => googleLogin(), [googleLogin]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    localStorage.removeItem(STORAGE_KEY);
    setMessage('');
  }, []);

  return { isConnected, syncing, message, connect, disconnect };
}

export default useCalendar;
