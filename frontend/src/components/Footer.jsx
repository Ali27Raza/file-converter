import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { NAV_LINKS } from "./Navbar";
import { FiGithub, FiTwitter, FiMail } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="mt-10 bg-[var(--surface)] border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Left: Logo only */}
          <div className="flex items-start md:justify-start justify-center">
            <img
              src={logo}
              alt="FileForge logo"
              className="w-60 h-60  shrink-0 object-contain rounded-lg shadow-sm"
            />
          </div>

          {/* Middle: Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="flex flex-col leading-tight">
              <div className="text-2xl md:text-3xl font-extrabold text-[var(--text)]">
                File<span className="text-[var(--accent)]">Forge</span>
              </div>
              <div className="text-base text-[var(--muted)]">Fast, private file conversion</div>
            </div>
            <p className="text-sm text-[var(--muted)] max-w-md">
              Convert documents and images quickly — no account, no tracking, files removed after conversion.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-[var(--muted)] hover:text-[var(--text)]">
                <FiGithub size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[var(--muted)] hover:text-[var(--text)]">
                <FiTwitter size={18} />
              </a>
              <a href="mailto:hello@example.com" className="text-[var(--muted)] hover:text-[var(--text)]">
                <FiMail size={18} />
              </a>
            </div>
          </div>

          {/* Right: Quick links */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h4 className="text-xs uppercase tracking-wider text-[var(--accent)] mb-3">Quick links</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-[var(--muted)]">
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} className="hover:text-[var(--text)]">{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[var(--muted)]">
          <div>© {new Date().getFullYear()} FileForge · Built for speed and privacy.</div>
          <div className="text-[var(--muted)]">Made with care · <Link to="/privacy" className="hover:text-[var(--text)]">Privacy</Link></div>
        </div>
      </div>
    </footer>
  );
}
