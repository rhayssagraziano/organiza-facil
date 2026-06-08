import type { AvatarConfig } from '../types/gamification';

export const AVATAR_KEY = 'pgm_avatar';

export const defaultAvatar: AvatarConfig = {
    skinColor: '#22C55E', hat: null, glasses: null, neck: null, chest: 'coin',
};

export const DARK: Record<string, string> = {
    '#22C55E': '#16A34A', '#F59E0B': '#D97706', '#818CF8': '#6366F1',
    '#38BDF8': '#0EA5E9', '#FB923C': '#F97316', '#F472B6': '#EC4899',
};

export const LIGHT: Record<string, string> = {
    '#22C55E': '#4ADE80', '#F59E0B': '#FCD34D', '#818CF8': '#A5B4FC',
    '#38BDF8': '#7DD3FC', '#FB923C': '#FDBA74', '#F472B6': '#F9A8D4',
};

export const loadAvatar = (): AvatarConfig => {
    try {
        const s = localStorage.getItem(AVATAR_KEY);
        return s ? { ...defaultAvatar, ...JSON.parse(s) } : defaultAvatar;
    } catch { return defaultAvatar; }
};

export const saveAvatar = (config: AvatarConfig): void => {
    localStorage.setItem(AVATAR_KEY, JSON.stringify(config));
};
