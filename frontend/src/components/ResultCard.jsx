import React from "react";
import { FiCheck } from "react-icons/fi";

export function ResultCard({ result, onReset }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-7 text-center">
      <div className="text-4xl mb-3 text-[var(--success)]"><FiCheck size={48} strokeWidth={2} /></div>
      <p className="text-lg font-bold mb-2">Conversion complete!</p>
      <p className="text-sm text-[var(--muted)] mb-6">
        {result.filename}
        {result.pageCount ? ` · ${result.pageCount} page${result.pageCount > 1 ? "s" : ""}` : ""}
        {result.packageType === "zip" ? " · ZIP archive" : ""}
      </p>

      <a
        href={result.downloadUrl}
        download={result.filename}
        className="inline-block px-9 py-3 bg-[var(--accent)] text-black rounded-lg font-extrabold text-sm no-underline mb-4"
      >
        ⬇ Download
      </a>

      <br />
      <button onClick={onReset} className="mt-2 text-sm text-[var(--muted)] underline">
        Convert another file
      </button>
    </div>
  );
}
