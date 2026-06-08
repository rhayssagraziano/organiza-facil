/** Returns the CSS color variable for a given financial score (0–1000) */
export const scoreColor = (score: number): string => {
  if (score >= 800) return 'var(--verde)';
  if (score >= 600) return '#60a5fa';
  if (score >= 400) return 'var(--amarelo)';
  return 'var(--vermelho)';
};

/** Returns a translucent background color for a given financial score */
export const scoreBg = (score: number): string => {
  if (score >= 800) return 'rgba(74,222,128,0.12)';
  if (score >= 600) return 'rgba(96,165,250,0.12)';
  if (score >= 400) return 'rgba(251,191,36,0.12)';
  return 'rgba(248,113,113,0.12)';
};

/** Returns a human-readable label for a financial score */
export const scoreLabel = (score: number): string => {
  if (score >= 800) return 'Excelente';
  if (score >= 600) return 'Bom';
  if (score >= 400) return 'Regular';
  return 'Atenção';
};
