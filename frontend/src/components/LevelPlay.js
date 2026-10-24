// src/components/LevelPlay.js
// Mode ujian versi gamifikasi: pemain memeragakan huruf satu per satu.
// Gaya (.level-play, .target-box, dst.) ada di pages/BelajarPage.css.
import React, { useState, useRef, useEffect } from "react";
import useHandDetection from "../hooks/useHandDetection";
import CameraCard from "./CameraCard";
import { MAX_STARS_PER_LEVEL } from "../data/levels";

const REQUIRED_MATCHES = 2; // huruf harus terbaca 2x berturut-turut (~0,8 detik)
const WRONG_THRESHOLD = 3; // 3x berturut-turut huruf lain = dihitung 1 kesalahan
const NEXT_DELAY_MS = 1200;
const XP_PER_LETTER = 10;
const XP_PER_STAR = 10; // bonus saat level selesai
const IDLE_MESSAGE = "Peragakan huruf di depan kamera.";

// 0-1 salah = 3 bintang, 2-4 salah = 2 bintang, selebihnya 1 bintang
const calcStars = (mistakes) => (mistakes <= 1 ? 3 : mistakes <= 4 ? 2 : 1);

const Stars = ({ count }) => (
  <span className="stars" aria-label={`${count} dari ${MAX_STARS_PER_LEVEL} bintang`}>
    {Array.from({ length: MAX_STARS_PER_LEVEL }, (_, i) => (
      <span key={i} className={i < count ? "star filled" : "star"} aria-hidden="true">
        {i < count ? "★" : "☆"}
      </span>
    ))}
  </span>
);

function LevelPlay({ level, onExit, onAddXp, onComplete }) {
  const { letters } = level;
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState({ type: "idle", message: IDLE_MESSAGE });
  const [result, setResult] = useState(null);

  const indexRef = useRef(0);
  const matchRef = useRef(0);
  const wrongRef = useRef(0);
  const mistakesRef = useRef(0);
  const lockedRef = useRef(false);
  const timerRef = useRef(null);

  const advance = () => {
    const next = indexRef.current + 1;
    if (next >= letters.length) {
      const stars = calcStars(mistakesRef.current);
      const bonus = stars * XP_PER_STAR;
      onComplete(stars, bonus);
      setResult({ stars, mistakes: mistakesRef.current, bonus });
      return;
    }
    indexRef.current = next;
    matchRef.current = 0;
    wrongRef.current = 0;
    lockedRef.current = false;
    setIndex(next);
    setFeedback({ type: "idle", message: IDLE_MESSAGE });
  };

  const handlePrediction = (raw) => {
    if (lockedRef.current) return;
    const value = String(raw).trim().toUpperCase();
    // Selain satu huruf (mis. "Tidak Terdeteksi") dianggap tangan tidak terbaca
    if (!/^[A-Z]$/.test(value)) {
      matchRef.current = 0;
      wrongRef.current = 0;
      return;
    }
    const target = letters[indexRef.current];

    if (value === target) {
      wrongRef.current = 0;
      matchRef.current += 1;
      if (matchRef.current < REQUIRED_MATCHES) return;
      lockedRef.current = true;
      onAddXp(XP_PER_LETTER);
      setFeedback({ type: "correct", message: `Benar! +${XP_PER_LETTER} XP` });
      timerRef.current = setTimeout(advance, NEXT_DELAY_MS);
      return;
    }

    matchRef.current = 0;
    wrongRef.current += 1;
    if (wrongRef.current === WRONG_THRESHOLD) {
      mistakesRef.current += 1;
      setFeedback({ type: "wrong", message: "Belum tepat, coba lagi." });
    }
  };

  const { videoRef, isCameraOn, prediction, error, startCamera, stopCamera } =
    useHandDetection(handlePrediction);

  // Kamera mati otomatis saat level selesai
  useEffect(() => {
    if (result) stopCamera();
  }, [result, stopCamera]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const restart = () => {
    clearTimeout(timerRef.current);
    indexRef.current = 0;
    matchRef.current = 0;
    wrongRef.current = 0;
    mistakesRef.current = 0;
    lockedRef.current = false;
    setIndex(0);
    setResult(null);
    setFeedback({ type: "idle", message: IDLE_MESSAGE });
  };

  const rangeLabel = `Huruf ${letters[0]} - ${letters[letters.length - 1]}`;

  if (result) {
    return (
      <div className="level-play">
        <div className="level-result">
          <div className="level-result-emoji" aria-hidden="true">{level.emoji}</div>
          <h2>{level.name} selesai!</h2>
          <Stars count={result.stars} />
          <p>
            {result.mistakes === 0
              ? "Sempurna, tanpa kesalahan!"
              : `${result.mistakes} kesalahan.`}{" "}
            Bonus <strong>+{result.bonus} XP</strong>.
          </p>
          <div className="level-result-actions">
            <button type="button" className="back-pill" onClick={restart}>
              Main Lagi
            </button>
            <button type="button" className="play-primary" onClick={onExit}>
              Kembali ke Peta
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shownPrediction = /^[A-Za-z]$/.test(prediction) ? prediction.toUpperCase() : "–";

  return (
    <div className="level-play">
      <div className="level-play-head">
        <button type="button" className="back-pill" onClick={onExit}>
          &larr; Kembali
        </button>
        <div className="level-play-title">
          <h2>{level.name}</h2>
          <p>{rangeLabel}</p>
        </div>
      </div>

      <ol className="letter-progress" aria-label="Progres huruf">
        {letters.map((letter, i) => {
          const done = i < index || (i === index && feedback.type === "correct");
          const state = done ? "done" : i === index ? "current" : "";
          return (
            <li key={letter} className={`letter-dot ${state}`}>
              {done ? "✓" : letter}
            </li>
          );
        })}
      </ol>

      <div className="target-box">
        <span className="target-label">Peragakan huruf</span>
        <span className="target-letter">{letters[index]}</span>
        <p className={`target-feedback ${feedback.type}`} aria-live="polite">
          {feedback.message}
        </p>
      </div>

      <CameraCard
        videoRef={videoRef}
        isCameraOn={isCameraOn}
        onStart={startCamera}
        onStop={stopCamera}
        error={error}
      >
        {isCameraOn ? (
          <div className="prediction">
            <span className="prediction-label">Terdeteksi</span>
            <span className="prediction-value">{shownPrediction}</span>
          </div>
        ) : (
          "Nyalakan kamera untuk memulai."
        )}
      </CameraCard>
    </div>
  );
}

export default LevelPlay;