// src/pages/BelajarPage.js
// "Mulai Belajar": peta petualangan bergamifikasi (menggantikan tab Mode Ujian).
// Deteksi bebas sekarang ada di GerakanBebasPage, kamus di KamusPage.
import React, { useState } from "react";
import useGameProgress from "../hooks/useGameProgress";
import LevelPlay from "../components/LevelPlay";
import { LEVELS, MAX_STARS_PER_LEVEL } from "../data/levels";
import "./BelajarPage.css";

const Stars = ({ count }) => (
  <div className="level-stars" aria-label={`${count} dari ${MAX_STARS_PER_LEVEL} bintang`}>
    {Array.from({ length: MAX_STARS_PER_LEVEL }, (_, i) => (
      <span key={i} className={i < count ? "star filled" : "star"} aria-hidden="true">
        {i < count ? "★" : "☆"}
      </span>
    ))}
  </div>
);

function BelajarPage() {
  const { progress, totalStars, addXp, completeLevel } = useGameProgress();
  const [activeLevelId, setActiveLevelId] = useState(null);

  const activeLevel = LEVELS.find((l) => l.id === activeLevelId);

  if (activeLevel) {
    return (
      <LevelPlay
        key={activeLevel.id}
        level={activeLevel}
        onExit={() => setActiveLevelId(null)}
        onAddXp={addXp}
        onComplete={(stars, bonus) => completeLevel(activeLevel.id, stars, bonus)}
      />
    );
  }

  // Level terbuka jika level sebelumnya sudah meraih minimal 1 bintang
  const isUnlocked = (i) => i === 0 || (progress.stars[LEVELS[i - 1].id] || 0) >= 1;
  const maxStars = LEVELS.length * MAX_STARS_PER_LEVEL;

  const stats = [
    { icon: "⭐", label: "Total Bintang", value: `${totalStars}/${maxStars}` },
    { icon: "🔥", label: "Streak", value: `${progress.streak} hari` },
    { icon: "✨", label: "XP", value: progress.xp },
  ];

  return (
    <div className="belajar-page">
      <header className="belajar-hero">
        <h1 className="belajar-title">Petualangan Belajar BISINDO</h1>
        <p className="belajar-subtitle">
          Mari mulai petualangan belajar bahasa isyarat!
        </p>
      </header>

      <div className="stat-row">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-icon" aria-hidden="true">{s.icon}</span>
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="level-map">
        {LEVELS.map((level, i) => {
          const unlocked = isUnlocked(i);
          const stars = progress.stars[level.id] || 0;
          const side = i % 2 === 0 ? "right" : "left";
          const state = !unlocked ? "locked" : stars > 0 ? "completed" : "current";
          return (
            <button
              type="button"
              key={level.id}
              className={`level-card ${side} ${state}`}
              disabled={!unlocked}
              onClick={() => setActiveLevelId(level.id)}
            >
              {!unlocked && (
                <span className="level-lock" aria-hidden="true">🔒</span>
              )}
              <span className="level-emoji" aria-hidden="true">{level.emoji}</span>
              <span className="level-name">{level.name}</span>
              <span className="level-range">
                Huruf {level.letters[0]} - {level.letters[level.letters.length - 1]}
              </span>
              <span className="level-letters" aria-hidden="true">
                {level.letters.join(" • ")}
              </span>
              <Stars count={stars} />
              {!unlocked && <span className="sr-only">Terkunci</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BelajarPage;