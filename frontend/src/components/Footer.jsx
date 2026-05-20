import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }} className="mt-12">
      <div className="max-w-6xl mx-auto px-6 py-12 md:flex md:items-start md:gap-12">
        <div className="md:flex-1 mb-6 md:mb-0">
          <div className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>
            File<span style={{ color: "var(--accent)" }}>Forge</span>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)] max-w-md">
            Fast, private file conversion. Your files are processed locally and deleted after conversion — never stored or shared.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 min-w-[220px]">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--accent)] mb-3">Converters</p>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">Any to Any</Link>
              <Link to="/image-to-pdf" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">Image to PDF</Link>
              <Link to="/word-to-image" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">Word to Image</Link>
              <Link to="/word-to-pdf" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">Word to PDF</Link>
              <Link to="/excel-to-pdf" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">Excel to PDF</Link>
              <Link to="/powerpoint-to-pdf" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">PowerPoint to PDF</Link>
              <Link to="/pdf-to-word" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">PDF to Word</Link>
              <Link to="/pdf-to-image" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">PDF to Image</Link>
              <Link to="/inpage-to-pdf" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">InPage to PDF</Link>
              <Link to="/inpage-to-image" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">InPage to Image</Link>
            </nav>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--accent)] mb-3">Formats</p>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-[var(--muted)]">Word · Excel · PowerPoint</span>
              <span className="text-sm text-[var(--muted)]">PDF · JPG · PNG</span>
              <span className="text-sm text-[var(--muted)]">WebP · GIF</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }} className="py-4">
        <div className="max-w-6xl mx-auto px-6 text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} FileForge · Built for speed and privacy.
        </div>
      </div>
    </footer>
  );
}
