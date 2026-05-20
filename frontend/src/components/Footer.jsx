import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { NAV_LINKS } from "./Navbar";
import { FiGithub, FiTwitter, FiMail } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="mt-12 bg-[var(--surface)] border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-start">
          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="FileForge logo" className="w-10 h-10 object-contain rounded-md shadow-sm" />
              <div>
                <div className="text-lg font-extrabold text-[var(--text)]">File<span className="text-[var(--accent)]">Forge</span></div>
                <div className="text-xs text-[var(--muted)]">Fast, private file conversion</div>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] max-w-sm">
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

          {/* Links (two compact columns) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-xs uppercase tracking-wider text-[var(--accent)] mb-3">Quick links</h4>
            <div className="grid grid-cols-3 gap-2 text-sm text-[var(--muted)]">
              {/** split NAV_LINKS into two columns without increasing footer height */}
              {(() => {
                const half = Math.ceil(NAV_LINKS.length / 2);
                const left = NAV_LINKS.slice(0, half);
                const right = NAV_LINKS.slice(half);
                return (
                  <>
                    <div className="flex flex-col gap-1">
                      {left.map(({ to, label }) => (
                        <Link key={to} to={to} className="hover:text-[var(--text)]">{label}</Link>
                      ))}
                    </div>
                    <div className="flex flex-col gap-1">
                      {right.map(({ to, label }) => (
                        <Link key={to} to={to} className="hover:text-[var(--text)]">{label}</Link>
                      ))}
                    </div>
                  </>
                );
              })()}
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
