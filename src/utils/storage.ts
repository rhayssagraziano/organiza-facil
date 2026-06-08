const ONBOARDING_PREFIX = 'onboarding_';
const GCAL_KEY = 'gcal_connected';

// ── Onboarding ────────────────────────────────────────────────────────────────

export const getOnboardingDone = (usuarioId: number): boolean =>
  localStorage.getItem(ONBOARDING_PREFIX + usuarioId) === 'done';

export const setOnboardingDone = (usuarioId: number): void => {
  localStorage.setItem(ONBOARDING_PREFIX + usuarioId, 'done');
};

export const clearOnboarding = (usuarioId: number): void => {
  localStorage.removeItem(ONBOARDING_PREFIX + usuarioId);
};

// ── Calendario ───────────────────────────────────────────────────────────

export const getCalendarConnected = (): boolean =>
  localStorage.getItem(GCAL_KEY) === 'true';

export const setCalendarConnected = (value: boolean): void => {
  if (value) localStorage.setItem(GCAL_KEY, 'true');
  else localStorage.removeItem(GCAL_KEY);
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const getStoredUser = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const removeStoredUser = (key: string): void => {
  localStorage.removeItem(key);
};
