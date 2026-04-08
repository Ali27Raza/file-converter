// src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, LogOut, User, History, Menu, X } from 'lucide-react';
import { POPULAR_CONVERSIONS } from '../utils/conversionService';
import './Navbar.css';

const MORE_CONVERSIONS = [
  { from: 'XLSX', to: 'PDF', label: 'Excel to PDF', desc: 'Spreadsheets to document format' },
  { from: 'PPTX', to: 'PDF', label: 'PPT to PDF', desc: 'Convert slides to PDF pages' },
  { from: 'MP4', to: 'MP3', label: 'MP4 to MP3', desc: 'Extract audio from videos' },
];

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [convertOpen, setConvertOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const convertRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (convertRef.current && !convertRef.current.contains(e.target)) {
        setConvertOpen(false);
        setToolsOpen(false);
        setPricingOpen(false);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="4" width="22" height="28" rx="3" fill="#2563eb"/>
              <rect x="3" y="8" width="8" height="3" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="3" y="13" width="8" height="3" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="3" y="18" width="6" height="3" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="20" y="18" width="24" height="26" rx="3" fill="#1d4ed8"/>
            </svg>
          </div>
          <span className="logo-text">NextConvertIFile</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links" ref={convertRef}>
          {/* Convert dropdown */}
          <div className="nav-dropdown">
            <button
              className={`nav-link ${convertOpen ? 'active' : ''}`}
              onClick={() => { setConvertOpen(!convertOpen); setToolsOpen(false); setPricingOpen(false); }}
            >
              Convert <ChevronDown size={14} className={`chevron ${convertOpen ? 'rotated' : ''}`} />
            </button>
            {convertOpen && (
              <div className="dropdown-panel convert-panel fade-in-scale">
                <div className="dropdown-col">
                  <p className="dropdown-label">POPULAR CONVERSIONS</p>
                  {POPULAR_CONVERSIONS.slice(0, 3).map(c => (
                    <Link key={c.label} to={`/convert?from=${c.from}&to=${c.to}`} className="dropdown-item" onClick={() => setConvertOpen(false)}>
                      <div className="di-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="1" y="0" width="10" height="13" rx="1.5" fill="#2563eb" opacity="0.15"/>
                          <rect x="1" y="0" width="10" height="13" rx="1.5" stroke="#2563eb" strokeWidth="1.2"/>
                          <rect x="2.5" y="3" width="6" height="1" rx="0.5" fill="#2563eb"/>
                          <rect x="2.5" y="5.5" width="6" height="1" rx="0.5" fill="#2563eb"/>
                          <rect x="2.5" y="8" width="4" height="1" rx="0.5" fill="#2563eb"/>
                        </svg>
                      </div>
                      <div>
                        <span className="di-title">{c.label}</span>
                        <span className="di-desc">{c.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="dropdown-col">
                  <p className="dropdown-label">MORE OPTIONS</p>
                  {MORE_CONVERSIONS.map(c => (
                    <Link key={c.label} to={`/convert?from=${c.from}&to=${c.to}`} className="dropdown-item" onClick={() => setConvertOpen(false)}>
                      <div className="di-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="1" y="0" width="10" height="13" rx="1.5" fill="#2563eb" opacity="0.15"/>
                          <rect x="1" y="0" width="10" height="13" rx="1.5" stroke="#2563eb" strokeWidth="1.2"/>
                        </svg>
                      </div>
                      <div>
                        <span className="di-title">{c.label}</span>
                        <span className="di-desc">{c.desc}</span>
                      </div>
                    </Link>
                  ))}
                  <div className="dropdown-item view-all">
                    <span>Can't find what you need?</span>
                    <Link to="/tools" onClick={() => setConvertOpen(false)} className="view-all-link">
                      View All 50+ Tools →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to="/tools" className="nav-link">Tools</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/support" className="nav-link">Support</Link>
        </div>

        {/* Auth buttons */}
        <div className="navbar-auth">
          {currentUser ? (
            <div className="user-menu-wrap" ref={convertRef}>
              <button className="user-avatar-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className="user-avatar">
                  {currentUser.displayName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase()}
                </div>
                <ChevronDown size={14} />
              </button>
              {userMenuOpen && (
                <div className="user-dropdown fade-in-scale">
                  <div className="user-info">
                    <p className="user-name">{currentUser.displayName || 'User'}</p>
                    <p className="user-email">{currentUser.email}</p>
                  </div>
                  <div className="user-menu-items">
                    <Link to="/dashboard" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                      <User size={14} /> Dashboard
                    </Link>
                    <Link to="/history" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                      <History size={14} /> History
                    </Link>
                    <button className="user-menu-item danger" onClick={handleLogout}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log In</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up Free</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu fade-in">
          <Link to="/convert" className="mobile-link" onClick={() => setMobileOpen(false)}>Convert</Link>
          <Link to="/tools" className="mobile-link" onClick={() => setMobileOpen(false)}>Tools</Link>
          <Link to="/pricing" className="mobile-link" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link to="/support" className="mobile-link" onClick={() => setMobileOpen(false)}>Support</Link>
          <div className="mobile-auth">
            {currentUser ? (
              <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" onClick={() => setMobileOpen(false)}>Log In</Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
