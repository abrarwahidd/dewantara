// src/pages/BerandaPage.js
import React from "react";
import { Link } from "react-router-dom";
import "./BerandaPage.css";
// Pastikan path ke ilustrasi Anda sudah benar
import heroIllustration from "../assets/images/hero-latest.png";

/* Ikon fitur (inline SVG, warna mengikuti `currentColor`) */
const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 32,
  height: 32,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

const IconUsers = () => (
  <svg {...iconProps}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCamera = () => (
  <svg {...iconProps}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const IconGift = () => (
  <svg {...iconProps}>
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

const features = [
  {
    icon: <IconUsers />,
    title: "Pendidikan Inklusif",
    text: "Menjangkau anak tunarungu di wilayah terpencil yang jauh dari SLB. Akses literasi untuk semua.",
  },
  {
    icon: <IconCamera />,
    title: "Teknologi AI Real-Time",
    text: "Deteksi alfabet bahasa isyarat secara otomatis dengan MediaPipe dan Random Forest. Feedback instan untuk pembelajaran mandiri.",
  },
  {
    icon: <IconGift />,
    title: "Akses Gratis & Mandiri",
    text: "Tanpa biaya, mudah digunakan, dan dapat diakses kapan saja. Memberdayakan pembelajaran mandiri dengan antarmuka ramah anak.",
  },
];

function BerandaPage() {
  return (
    <div className="beranda-wrapper new-design">
      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="hero-bg-shape hero-bg-shape-1" aria-hidden="true"></div>
        <div className="hero-bg-shape hero-bg-shape-2" aria-hidden="true"></div>
        <div className="hero-bg-shape hero-bg-shape-3" aria-hidden="true"></div>

        <div className="beranda-container">
          <div className="hero-content">
            <h1 className="animate-fade-in-up">DEWANTARA</h1>
            <h2 className="hero-subtitle animate-fade-in-up">
              Deteksi Wajah dan Tangan Real-Time untuk Anak Tunarungu
            </h2>
            <p className="animate-fade-in-up delay-1">
              Mendukung pendidikan inklusif di wilayah jauh dari SLB. Solusi
              berbasis AI untuk literasi mandiri dan komunikasi tanpa hambatan.
            </p>
            <div className="animate-fade-in-up delay-2">
              <Link to="/gerakan-bebas" className="hero-button">
                Mulai Deteksi &rarr;
              </Link>
            </div>
          </div>

          <div className="hero-image animate-scale-in">
            <img
              src={heroIllustration}
              alt="Orang-orang berkomunikasi dengan bahasa isyarat"
            />
          </div>
        </div>
      </section>

      {/* ===== MENGAPA DEWANTARA ===== */}
      <section className="why-section">
        <div className="beranda-container">
          <h2 className="section-title">Mengapa DEWANTARA?</h2>
          <p className="section-subtitle">
            Teknologi AI untuk Pendidikan Inklusif Berkualitas
          </p>

          <div className="feature-grid">
            {features.map((f) => (
              <article className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SDG ===== */}
      <section className="sdg-section">
        <div className="beranda-container">
          <h2>Mendukung SDG 4 &amp; 10</h2>
          <p>
            DEWANTARA berkontribusi pada{" "}
            <strong>Sustainable Development Goals</strong> untuk Pendidikan
            Berkualitas (SDG 4) dan Pengurangan Ketimpangan (SDG 10). Kami
            percaya setiap anak berhak mendapat akses pendidikan yang setara.
          </p>

          <div className="sdg-stats">
            <div className="sdg-stat">
              <span className="sdg-stat-value">100%</span>
              <span className="sdg-stat-label">Gratis untuk Semua</span>
            </div>
            <div className="sdg-stat">
              <span className="sdg-stat-value">Real-Time</span>
              <span className="sdg-stat-label">Deteksi Instan</span>
            </div>
            <div className="sdg-stat">
              <span className="sdg-stat-value">Inklusif</span>
              <span className="sdg-stat-label">Jangkauan Luas</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA PENUTUP ===== */}
      <section className="cta-section">
        <div className="beranda-container">
          <h2 className="section-title">Siap Memulai Perjalanan Belajar?</h2>
          <p className="section-subtitle">
            Bergabunglah dengan gerakan pendidikan inklusif untuk masa depan
            yang lebih baik.
          </p>
          <Link to="/gerakan-bebas" className="hero-button">
            Mulai Deteksi Sekarang &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}

export default BerandaPage;