import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiGrid, FiFileText, FiPlusCircle, FiLogOut, FiMenu, FiX,
  FiChevronRight, FiZap,
} from "react-icons/fi";

const NAV = [
  { to: "/admin", icon: FiGrid, label: "Dashboard", exact: true },
  { to: "/admin/blog", icon: FiFileText, label: "All Posts" },
  { to: "/admin/blog/new", icon: FiPlusCircle, label: "New Post" },
];

export function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (nav) =>
    nav.exact ? location.pathname === nav.to : location.pathname.startsWith(nav.to);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          width: 260,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <Link to="/" className="flex items-center gap-2 group">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ background: "var(--accent)", color: "#0a0a0f" }}
            >
              FF
            </span>
            <span className="font-bold text-[var(--text)] text-sm">FileForge Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((n) => {
            const active = isActive(n);
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
                style={
                  active
                    ? { background: "rgba(232,255,71,0.12)", color: "var(--accent)" }
                    : { color: "var(--muted)" }
                }
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--text)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "var(--muted)"; }}
              >
                <n.icon size={16} />
                <span>{n.label}</span>
                {active && <FiChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--accent)", color: "#0a0a0f" }}
            >
              {(user || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text)] capitalize">{user || "Admin"}</p>
              <p className="text-xs text-[var(--muted)]">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--muted)] hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <FiLogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center gap-4 px-4 md:px-8 py-4 border-b border-[var(--border)]"
          style={{ background: "var(--surface)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            <FiMenu size={20} />
          </button>
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <FiZap size={12} style={{ color: "var(--accent)" }} />
            <span>Admin Panel</span>
          </div>
          <div className="ml-auto">
            <Link
              to="/"
              className="text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              target="_blank"
            >
              View Site →
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
