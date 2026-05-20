import React from "react";
import { FiCheck } from "react-icons/fi";
import { downloadFile } from "../utils/downloadFile";

export function ResultCard({ result, onReset }) {
  async function handleDownload() {
    await downloadFile(result.downloadUrl, result.filename);
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-7 text-center">
      <div className="text-4xl mb-3 text-[var(--success)]"><FiCheck size={48} strokeWidth={2} /></div>
      <p className="text-lg font-bold mb-2">Conversion complete!</p>
      <p className="text-sm text-[var(--muted)] mb-6">
        {result.filename}
        {result.pageCount ? ` · ${result.pageCount} page${result.pageCount > 1 ? "s" : ""}` : ""}
        {result.packageType === "zip" ? " · ZIP archive" : ""}
      </p>

      <button
        type="button"
        onClick={handleDownload}
        className="inline-flex items-center justify-center gap-2 px-9 py-3 bg-[var(--accent)] text-black rounded-lg font-extrabold text-sm no-underline mb-4"
      >
        ⬇ Download
      </button>

      <br />
      <button onClick={onReset} className="mt-2 text-sm text-[var(--muted)] underline">
        Convert another file
      </button>
    </div>
  );
}
