// src/components/CameraCard.js
// Kartu kamera yang dipakai di Gerakan Bebas dan di halaman level.
import React, { useState } from "react";
import "./CameraCard.css";

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

const IconCamera = () => (
  <svg {...iconProps}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const IconCameraOff = () => (
  <svg {...iconProps}>
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" />
  </svg>
);

const FLIP_KEY = "dewantara-flip-preview";
const readFlip = () => {
  try {
    return localStorage.getItem(FLIP_KEY) === "1";
  } catch {
    return false;
  }
};

/**
 * @param videoRef  ref dari useHandDetection
 * @param children  isi bar bawah (hasil prediksi, petunjuk, dll)
 */
function CameraCard({ videoRef, isCameraOn, onStart, onStop, error, children }) {
  // Balik tampilan (cermin). Hanya mengubah PRATINJAU, bukan frame yang dikirim ke model.
  const [flipped, setFlipped] = useState(readFlip);
  const toggleFlip = () => {
    const next = !flipped;
    setFlipped(next);
    try {
      localStorage.setItem(FLIP_KEY, next ? "1" : "0");
    } catch {
      /* abaikan jika penyimpanan diblokir */
    }
  };

  return (
    <div className="camera-card">
      <div className="camera-stage">
        <video
          ref={videoRef}
          className={`${isCameraOn ? "is-on" : ""} ${flipped ? "flipped" : ""}`}
          autoPlay
          playsInline
          muted
        />
        <button
          type="button"
          className={`camera-flip ${flipped ? "active" : ""}`}
          onClick={toggleFlip}
          aria-pressed={flipped}
          aria-label="Balik tampilan kamera (efek cermin)"
          title="Balik tampilan kamera"
        >
          <span aria-hidden="true">⇄</span> Cermin
        </button>
        <div className="camera-guide">
          <span>Posisikan tangan di sini</span>
        </div>
      </div>

      <div className="camera-bar">
        <button
          type="button"
          className={`camera-toggle ${isCameraOn ? "on" : "off"}`}
          onClick={isCameraOn ? onStop : onStart}
          aria-label={isCameraOn ? "Matikan kamera" : "Nyalakan kamera"}
          title={isCameraOn ? "Matikan kamera" : "Nyalakan kamera"}
        >
          {isCameraOn ? <IconCamera /> : <IconCameraOff />}
        </button>
        <div className="camera-bar-content" aria-live="polite">
          {error ? (
            <span className="camera-error" role="alert">
              {error}
            </span>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

export default CameraCard;