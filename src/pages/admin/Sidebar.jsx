import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaList, FaMoneyCheckAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import './Sidebar.css';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <nav
      className={`admin-sidebar${collapsed ? ' collapsed' : ''}`}
      aria-label="Admin sidebar navigation"
    >
      <button
        className="sidebar-toggle d-md-none btn btn-light"
        aria-label="Toggle sidebar"
        onClick={() => setCollapsed(!collapsed)}
      >
        <FaBars />
      </button>
      <div className="sidebar-content">
        <div className="sidebar-title mb-4 mt-2">Inscriptions</div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink
              to="/admin/students/add"
              className={({ isActive }) =>
                'nav-link d-flex align-items-center' + (isActive ? ' active' : '')
              }
              aria-label="Ajouter un étudiant"
            >
              <FaUserPlus className="me-2" /> Ajouter Étudiant
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/students/list"
              className={({ isActive }) =>
                'nav-link d-flex align-items-center' + (isActive ? ' active' : '')
              }
              aria-label="Liste des étudiants"
            >
              <FaList className="me-2" /> Liste Étudiants
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/students/payments"
              className={({ isActive }) =>
                'nav-link d-flex align-items-center' + (isActive ? ' active' : '')
              }
              aria-label="Paiement des étudiants"
            >
              <FaMoneyCheckAlt className="me-2" /> Paiements
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/students/payments/add"
              className={({ isActive }) =>
                'nav-link d-flex align-items-center' + (isActive ? ' active' : '')
              }
              aria-label="Ajouter un paiement"
            >
              <FaMoneyCheckAlt className="me-2" /> Ajouter Paiement
            </NavLink>
          </li>
        </ul>
        <div className="sidebar-logout mt-auto">
          <button
            className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
            onClick={handleLogout}
            aria-label="Se déconnecter"
          >
            <FaSignOutAlt className="me-2" /> Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
} 