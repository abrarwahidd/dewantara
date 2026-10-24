// src/pages/GerakanBebasPage.js
// Mode praktik bebas (sebelumnya tab "Deteksi Bebas" di BelajarPage).
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useHandDetection from "../hooks/useHandDetection";
import CameraCard from "../components/CameraCard";
import "./GerakanBebasPage.css";

function GerakanBebasPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { videoRef, isCameraOn, prediction, error, startCamera, stopCamera } =
    useHandDetection();

  // Kalau halaman dibuka langsung (tanpa riwayat), "Kembali" ke Beranda
  const goBack = () => {
    if (location.key !== "default") navigate(-1);
    else navigate("/");
  };

  const hasLetter = /^[A-Za-z]$/.test(prediction);

  return (
    <div className="gerakan-page">
      <div className="gerakan-head">
        <button type="button" className="back-pill gerakan-back" onClick={goBack}>
          &larr; Kembali
        </button>
        <h1>Mode Praktik Bebas</h1>
        <p>Latihan dan Belajar BISINDO Tanpa Batasan</p>
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
            <span className="prediction-label">Hasil prediksi</span>
            <span className="prediction-value">
              {hasLetter ? prediction.toUpperCase() : "–"}
            </span>
            {!hasLetter && prediction === "Tidak Terdeteksi" && (
              <span className="gerakan-hint">Tangan belum terdeteksi</span>
            )}
          </div>
        ) : (
          "Nyalakan kamera lalu peragakan huruf abjad BISINDO."
        )}
      </CameraCard>
    </div>
  );
}

export default GerakanBebasPage;