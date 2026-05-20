import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/image-to-pdf", label: "Image to PDF" },
  { to: "/word-to-image", label: "Word to Image" },
  { to: "/word-to-pdf", label: "Word to PDF" },
  { to: "/excel-to-pdf", label: "Excel to PDF" },
  { to: "/powerpoint-to-pdf", label: "PowerPoint to PDF" },
  { to: "/pdf-to-word", label: "PDF to Word" },
  { to: "/pdf-to-image", label: "PDF to Image" },
  { to: "/inpage-to-pdf", label: "InPage to PDF" },
  { to: "/inpage-to-image", label: "InPage to Image" },
  { to: "/about", label: "About" },
  { to: "/help", label: "Help" },
  { to: "/blog", label: "Blog" },

];

export function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const navRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    function checkScroll() {
      const el = navRef.current;
      if (!el) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollWidth > el.clientWidth && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
    checkScroll();
    window.addEventListener("resize", checkScroll);
    const el = navRef.current;
    if (el) el.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
      if (el) el.removeEventListener("scroll", checkScroll);
    };
  }, [navRef, NAV_LINKS.length]);

  function scrollNav(amount = 200) {
    navRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <nav
      className="sticky top-0 z-50"
      style={{ background: "rgba(10,10,15,0.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid var(--border)", fontFamily: 'Arial, sans-serif' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-4">
          <span className="font-extrabold text-lg" style={{ color: "var(--text)", fontFamily: "Arial, sans-serif" }}>File<span style={{ color: "var(--accent)" }}>Forge</span></span>
        </Link>

        {/* Desktop links: horizontally scrollable without wrapping */}
        <div className="hidden md:flex items-center gap-2 ml-6 lg:ml-8">
          <button
            onClick={() => scrollNav(-240)}
            className="p-2 rounded-md text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            aria-label="Scroll links left"
            style={{ display: canScrollLeft ? 'inline-flex' : 'none' }}
          >
            <FiChevronLeft size={18} />
          </button>

          <div className="relative">
            <div
              ref={navRef}
              className="flex gap-2 items-center overflow-x-auto whitespace-nowrap"
              style={{ maxWidth: "48rem", scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`inline-block px-3 py-2 rounded-md text-sm transition-colors ${pathname === to ? "text-[var(--accent)] bg-[rgba(232,255,71,0.06)]" : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.03)]"}`}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-10"
              style={{
                background: "linear-gradient(to right, rgba(10,10,15,0.96), rgba(10,10,15,0))",
                opacity: canScrollLeft ? 1 : 0,
                transition: "opacity 180ms ease",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-10"
              style={{
                background: "linear-gradient(to left, rgba(10,10,15,0.96), rgba(10,10,15,0))",
                opacity: canScrollRight ? 1 : 0,
                transition: "opacity 180ms ease",
              }}
            />
          </div>

          <button
            onClick={() => scrollNav(240)}
            className="p-2 rounded-md text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            aria-label="Scroll links right"
            style={{ display: canScrollRight ? 'inline-flex' : 'none' }}
          >
            <FiChevronRight size={18} />
          </button>
        </div>

        <button
          className="md:hidden p-2 text-[var(--text)]"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${pathname === to ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--text)]"}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
