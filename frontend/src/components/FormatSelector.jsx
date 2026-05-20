import React from "react";
import { FORMAT_MAP, OUTPUT_LABELS } from "../conversionConfig";

export function FormatSelector({ inputExt, selected, onChange, limitOutputs }) {
  const raw = FORMAT_MAP[inputExt]?.outputs || [];
  const outputs = limitOutputs ? raw.filter((f) => limitOutputs.includes(f)) : raw;

  return (
    <div>
      <p className="text-[13px] text-[var(--muted)] mb-3">CONVERT TO</p>
      <div className="flex flex-wrap gap-2">
        {outputs.map((fmt) => (
          <button
            key={fmt}
            onClick={() => onChange(fmt)}
            className={`px-5 py-2 rounded-lg border-2 font-bold text-sm transition-all ${selected === fmt ? 'border-[var(--accent)] bg-[var(--accent)] text-black' : 'border-[var(--border)] text-[var(--text)]'}`}
          >
            {OUTPUT_LABELS[fmt] || fmt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
