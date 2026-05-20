import React from "react";
import { Link } from "react-router-dom";

export function OnPageSeoContent({
  toolName,
  intro,
  steps = [],
  faqs = [],
  relatedLinks = [],
  trustNote,
  updatedAt,
}) {
  return (
    <section className="w-full max-w-6xl mx-auto mt-10 px-1">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text)] mb-4">
          {toolName}: How it works
        </h2>

        <p className="text-[var(--muted)] leading-relaxed mb-6">{intro}</p>

        <h3 className="text-xl font-bold text-[var(--text)] mb-3">Steps</h3>
        <ol className="list-decimal pl-6 space-y-2 text-[var(--muted)] mb-8">
          {steps.map((step, idx) => (
            <li key={`${toolName}-step-${idx}`}>{step}</li>
          ))}
        </ol>

        <h3 className="text-xl font-bold text-[var(--text)] mb-3">FAQs</h3>
        <div className="space-y-4 mb-8">
          {faqs.map((item, idx) => (
            <div key={`${toolName}-faq-${idx}`}>
              <p className="font-semibold text-[var(--text)]">{item.q}</p>
              <p className="text-[var(--muted)]">{item.a}</p>
            </div>
          ))}
        </div>

        {relatedLinks.length > 0 && (
          <>
            <h3 className="text-xl font-bold text-[var(--text)] mb-3">Related tools</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {relatedLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </>
        )}

        {trustNote && <p className="text-sm text-[var(--muted)] mb-2">{trustNote}</p>}
        {updatedAt && <p className="text-xs text-[var(--muted)]">Last updated: {updatedAt}</p>}
      </div>
    </section>
  );
}
