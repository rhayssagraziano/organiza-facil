import { useState } from 'react';
import type { Objetivo } from '../types';
import { XP_PER_LEVEL, MILESTONES } from '../utils/gamification';
import { getXP, saveXP, getMilestones, saveMilestones, getStreaks, saveStreaks } from '../services/gamificationService';

export function useGamification() {
    const [xpTotal, setXpTotal] = useState<number>(getXP);
    const [milestonesDone, setMilestonesDone] = useState<Record<number, number[]>>(getMilestones);
    const [streaks, setStreaks] = useState<Record<number, { count: number; lastDate: string }>>(getStreaks);

    const level = Math.floor(xpTotal / XP_PER_LEVEL) + 1;
    const xpInLevel = xpTotal % XP_PER_LEVEL;

    const addXP = (amount: number) => {
        setXpTotal(prev => {
            const next = prev + amount;
            saveXP(next);
            return next;
        });
    };

    const checkMilestones = (obj: Objetivo, newValor: number): number => {
        if (!obj.id) return 0;
        const pct = (newValor / obj.valorMeta) * 100;
        const awarded = milestonesDone[obj.id] ?? [];
        let xpGained = 0;
        const newAwarded = [...awarded];
        for (const m of MILESTONES) {
            if (pct >= m && !awarded.includes(m)) {
                xpGained += m === 100 ? 500 : 180;
                newAwarded.push(m);
            }
        }
        if (xpGained > 0) {
            const next = { ...milestonesDone, [obj.id]: newAwarded };
            setMilestonesDone(next);
            saveMilestones(next);
        }
        return xpGained;
    };

    const updateStreak = (objId: number) => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];
        setStreaks(prev => {
            const cur = prev[objId] ?? { count: 0, lastDate: '' };
            const count = cur.lastDate === yStr ? cur.count + 1 : cur.lastDate === today ? cur.count : 1;
            const next = { ...prev, [objId]: { count, lastDate: today } };
            saveStreaks(next);
            return next;
        });
    };

    return { xpTotal, level, xpInLevel, milestonesDone, streaks, addXP, checkMilestones, updateStreak };
}
