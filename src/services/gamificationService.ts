export const getXP = (): number => {
    const s = localStorage.getItem('pgm_xp');
    return s ? parseInt(s) : 0;
};

export const saveXP = (xp: number): void => {
    localStorage.setItem('pgm_xp', String(xp));
};

export const getMilestones = (): Record<number, number[]> => {
    try { return JSON.parse(localStorage.getItem('pgm_milestones') || '{}'); } catch { return {}; }
};

export const saveMilestones = (data: Record<number, number[]>): void => {
    localStorage.setItem('pgm_milestones', JSON.stringify(data));
};

export const getStreaks = (): Record<number, { count: number; lastDate: string }> => {
    try { return JSON.parse(localStorage.getItem('pgm_streaks') || '{}'); } catch { return {}; }
};

export const saveStreaks = (data: Record<number, { count: number; lastDate: string }>): void => {
    localStorage.setItem('pgm_streaks', JSON.stringify(data));
};
