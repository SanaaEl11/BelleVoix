import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import logo from "../../assets/logo.png"; // Placeholder for logo image
import headerImage from "../../assets/header-bg2.webp"; // Placeholder for header background image
import { FaBars } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import Login from "../Login";

const Navbar = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };
  {
    /* <ImCross /> */
  }
  // import { ImCross } from "react-icons/im";
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-gradient shadow-lg fixed-top">
        <div className="container-fluid px-4 px-lg-5">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="Dutch School Logo" className="logo-img me-2" />
          </Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={isNavExpanded ? "true" : "false"}
            aria-label="Toggle navigation"
            onClick={toggleNav}
          >
            <span className="navbar-toggler-icon ">
              <FaBars color="#1c2526" />
            </span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            {/* Navigation links removed, only Login button remains */}
            <div className="ms-3">
              <button type="button" className="btn btn-login-pro fw-bold px-4 py-2" onClick={() => setShowLoginModal(true)}>
                Connexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header with Cover Image */}
      <header className="hero-section position-relative text-center">
        <div className="header-bg-img">
          <img src={headerImage} alt="Header Background" className="bg-img" />
          <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100">
            <div className="container h-100 d-flex align-items-center justify-content-center">
              <div className="text-center text-light">
                <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInDown">
                BIENVENUE À BELLE VOIX, ÉCOLE PRIVÉE
                </h1>
                <p className="lead mb-4 animate__animated animate__fadeInUp">
                  Promouvoir l'éducation avec une expérience d'apprentissage vivante
                </p>
                <Link
                  to="/services"
                  className="header-link-explore animate__animated animate__zoomIn"
                >
                  Explorer maintenant <FaArrowRight style={{marginLeft: '0.5em', verticalAlign: 'middle'}} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-content">
            <button className="login-modal-close" onClick={() => setShowLoginModal(false)}>&times;</button>
            <Login onCloseModal={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
