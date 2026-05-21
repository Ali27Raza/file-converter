import React from "react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <div className="w-full max-w-xl text-center border border-[var(--border)] bg-[var(--surface)] rounded-2xl p-8">
        <p className="text-2xl md:text-3xl font-extrabold uppercase tracking-wider text-[var(--accent)] mb-2">404</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] mb-3">Page not found</h1>
        <p className="text-[var(--muted)] mb-6">The page you are looking for doesn’t exist or was moved.</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-lg bg-[var(--accent)] text-black font-bold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
