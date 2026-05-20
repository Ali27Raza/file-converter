import React from "react";

export function ProgressBar({ progress }) {
  return (
    <div className="mt-6">
      <div className="flex justify-between text-[12px] text-[var(--muted)] mb-2">
        <span>Converting…</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1.5 rounded overflow-hidden bg-[var(--border)]">
        <div className="h-full rounded bg-[var(--accent)]" style={{ width: `${progress}%`, transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
}
