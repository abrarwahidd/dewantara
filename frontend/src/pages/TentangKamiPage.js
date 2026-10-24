// src/pages/TentangKamiPage.js
import React from "react";
import "./TentangKamiPage.css";

/* Ikon (inline SVG, warna mengikuti `currentColor`) */
const svgProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

const IconEye = () => (
  <svg {...svgProps} width="42" height="42">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconCheckSquare = () => (
  <svg {...svgProps} width="42" height="42">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);
const IconBook = () => (
  <svg {...svgProps} width="32" height="32">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const IconHome = () => (
  <svg {...svgProps} width="32" height="32">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IconMessage = () => (
  <svg {...svgProps} width="32" height="32">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const misi = [
  "Menyediakan platform deteksi alfabet bahasa isyarat real-time yang gratis dan mudah diakses.",
  "Menggunakan AI (MediaPipe & Random Forest) untuk memberikan umpan balik pembelajaran instan.",
  "Menjangkau anak tunarungu di wilayah terpencil.",
  "Meningkatkan literasi dan komunikasi untuk mengatasi hambatan pendidikan inklusif.",
];

const masalah = [
  {
    icon: <IconBook />,
    title: "Literasi Terbatas",
    text: "Anak tunarungu di wilayah terpencil kesulitan mengakses materi pembelajaran bahasa isyarat yang berkualitas.",
  },
  {
    icon: <IconHome />,
    title: "Jarak dari SLB",
    text: "Daerah yang jauh dari Sekolah Luar Biasa (SLB), membatasi akses pendidikan khusus.",
  },
  {
    icon: <IconMessage />,
    title: "Hambatan Komunikasi",
    text: "Kurangnya pengetahuan bahasa isyarat menciptakan kesenjangan komunikasi antara anak tunarungu dan lingkungan sekitar.",
  },
];

function TentangKamiPage() {
  return (
    <div className="tentang-kami-page">
      {/* ===== Header ===== */}
      <section className="tentang-header">
        <h1>Tentang DEWANTARA</h1>
        <p>
          DEWANTARA lahir dari keyakinan bahwa teknologi dapat menjadi jembatan
          untuk pendidikan inklusif dan komunikasi yang lebih baik bagi anak
          tunarungu.
        </p>
      </section>

      {/* ===== Visi & Misi ===== */}
      <section className="visi-misi-section">
        <div className="visi-misi-container">
          <div className="visi-misi-item">
            <div className="item-icon">
              <IconEye />
            </div>
            <h3>Visi Kami</h3>
            <p>
              Menciptakan dunia di mana setiap anak, termasuk yang tunarungu di
              wilayah terpencil, dapat mengakses pendidikan berkualitas melalui
              teknologi AI. Mendukung{" "}
              <strong>SDG 4 (Quality Education)</strong> dan{" "}
              <strong>SDG 10 (Reduced Inequalities)</strong> untuk masa depan
              yang lebih inklusif.
            </p>
          </div>

          <div className="visi-misi-item">
            <div className="item-icon">
              <IconCheckSquare />
            </div>
            <h3>Misi Kami</h3>
            <ul>
              {misi.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== Masalah yang Kami Atasi ===== */}
      <section className="masalah-section">
        <div className="masalah-container">
          <h2 className="masalah-title">Masalah yang Kami Atasi</h2>
          <p className="masalah-subtitle">
            DEWANTARA hadir untuk mengatasi tantangan nyata dalam pendidikan
            anak tunarungu
          </p>

          <div className="masalah-grid">
            {masalah.map((m) => (
              <article className="masalah-card" key={m.title}>
                <div className="masalah-icon">{m.icon}</div>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default TentangKamiPage;