// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageSquare, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
              <rect x="6" y="4" width="22" height="28" rx="3" fill="#2563eb"/>
              <rect x="3" y="8" width="8" height="3" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="3" y="13" width="8" height="3" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="3" y="18" width="6" height="3" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="20" y="18" width="24" height="26" rx="3" fill="#1d4ed8"/>
            </svg>
            <span>NextConvertIFile</span>
          </div>
          <p className="footer-tagline">The fastest and easiest way to convert your files online for free.</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Product</h4>
            <Link to="/convert">Converter</Link>
            <Link to="/tools">Compression</Link>
            <Link to="/tools">Editing</Link>
            <Link to="/api">API</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/status">Status</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/feedback">Feedback</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/gdpr">GDPR</Link>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="footer-social">
              <a href="#" className="social-btn" aria-label="Website"><Globe size={16} /></a>
              <a href="#" className="social-btn" aria-label="Discord"><MessageSquare size={16} /></a>
              <a href="#" className="social-btn" aria-label="Email"><Mail size={16} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2024 NextConvertIFile. All rights reserved.</span>
        <div className="footer-badge">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L10.2 5.5L15 6.2L11.5 9.6L12.4 14.5L8 12.1L3.6 14.5L4.5 9.6L1 6.2L5.8 5.5L8 1Z" fill="#10b981"/>
          </svg>
          256-bit SSL Secure
        </div>
      </div>
    </footer>
  );
}
