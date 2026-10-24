// src/hooks/useGameProgress.js
// Menyimpan XP, bintang per level, dan streak harian di localStorage.
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "dewantara-progress-v1";
const DEFAULT_STATE = { xp: 0, stars: {}, streak: 0, lastActive: null };

const dateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

// Berkunjung hari ini = aktif. Berurutan dengan kemarin -> streak naik.
function touchStreak(state) {
  const now = new Date();
  const today = dateKey(now);
  if (state.lastActive === today) return state;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const streak = state.lastActive === dateKey(yesterday) ? state.streak + 1 : 1;
  return { ...state, streak, lastActive: today };
}

export default function useGameProgress() {
  const [progress, setProgress] = useState(() => touchStreak(load()));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* penyimpanan penuh / diblokir: progres hanya berlaku di sesi ini */
    }
  }, [progress]);

  const addXp = useCallback((amount) => {
    setProgress((p) => ({ ...p, xp: p.xp + amount }));
  }, []);

  const completeLevel = useCallback((levelId, stars, bonusXp) => {
    setProgress((p) => ({
      ...p,
      xp: p.xp + bonusXp,
      stars: { ...p.stars, [levelId]: Math.max(p.stars[levelId] || 0, stars) },
    }));
  }, []);

  const totalStars = Object.values(progress.stars).reduce((a, b) => a + b, 0);

  return { progress, totalStars, addXp, completeLevel };
}