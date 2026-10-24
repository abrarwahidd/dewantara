// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
// Ganti dengan file logo Dewantara (logo bulat merah)
import siteLogo from "../assets/images/LOGO-D.png";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <img src={siteLogo} alt="Dewantara Logo" className="navbar-logo" />
            <span>DEWANTARA</span>
          </Link>
        </div>

        <div className={`navbar-center ${isMenuOpen ? "active" : ""}`}>
          <NavLink to="/" end className="nav-link" onClick={closeMenu}>
            Beranda
          </NavLink>
          <NavLink to="/tentang-kami" className="nav-link" onClick={closeMenu}>
            Tentang Dewantara
          </NavLink>
          <NavLink to="/belajar" className="nav-link" onClick={closeMenu}>
            Mulai Belajar
          </NavLink>
          <NavLink to="/gerakan-bebas" className="nav-link" onClick={closeMenu}>
            Gerakan Bebas
          </NavLink>
          <NavLink to="/kamus" className="nav-link" onClick={closeMenu}>
            Kamus
          </NavLink>
          <Link to="/hubungi-kami" className="mobile-cta" onClick={closeMenu}>
            Hubungi
          </Link>
        </div>

        <div className="navbar-right">
          <Link to="/hubungi-kami" className="cta-button">
            Hubungi
          </Link>
          <button
            className={`hamburger ${isMenuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;