import React, { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { DropZone } from "./DropZone";
import { FormatSelector } from "./FormatSelector";
import { ProgressBar } from "./ProgressBar";
import { ResultCard } from "./ResultCard";
import { useConverter } from "../hooks/useConverter";
import { FORMAT_MAP, OUTPUT_LABELS } from "../conversionConfig";

export function ConverterWidget({ allowedInputExts, forcedOutputFormat, limitOutputs }) {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState(forcedOutputFormat || "");
  const [typeError, setTypeError] = useState("");
  const { status, progress, result, errorMsg, convert, reset } = useConverter();

  function getExt(f) {
    return f?.name.split(".").pop().toLowerCase() || "";
  }

  function handleFile(f) {
    const ext = getExt(f);
    if (allowedInputExts && !allowedInputExts.includes(ext)) {
      setTypeError(`Unsupported file type for this converter. Accepted: ${allowedInputExts.join(", ")}`);
      setFile(null);
      return;
    }
    setTypeError("");
    setFile(f);
    if (forcedOutputFormat) {
      setOutputFormat(forcedOutputFormat);
    } else {
      const outs = FORMAT_MAP[ext]?.outputs || [];
      const filtered = limitOutputs ? outs.filter((o) => limitOutputs.includes(o)) : outs;
      setOutputFormat(filtered[0] || "");
    }
    reset();
  }

  function handleReset() {
    setFile(null);
    setOutputFormat(forcedOutputFormat || "");
    setTypeError("");
    reset();
  }

  const inputExt = getExt(file);
  const inputLabel = FORMAT_MAP[inputExt]?.label || inputExt.toUpperCase();
  const canConvert = file && outputFormat && status !== "converting";

  return (
    <div className="w-full max-w-[620px] bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
      {status === "done" && result ? (
        <ResultCard result={result} onReset={handleReset} />
      ) : (
        <>
          {typeError && (
            <div className="mb-4 rounded-md p-4 text-[var(--error)]" style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)', fontSize: 13 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <FiAlertTriangle aria-hidden="true" />
                <span>{typeError}</span>
              </span>
            </div>
          )}

          {!file ? (
            <DropZone onFile={handleFile} allowedInputExts={allowedInputExts} />
          ) : (
            <div className="flex items-center justify-between rounded-lg p-4" style={{ background: 'rgba(232,255,71,0.05)', border: '1px solid rgba(232,255,71,0.15)' }}>
              <div>
                <p className="font-bold mb-1">{file.name}</p>
                <p className="text-[12px] text-[var(--muted)]">{inputLabel} · {(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={handleReset} className="text-[var(--muted)] text-xl" aria-label="Clear file">
                <FiX aria-hidden="true" />
              </button>
            </div>
          )}

          {file && !forcedOutputFormat && (
            <div className="mt-7">
              <FormatSelector
                inputExt={inputExt}
                selected={outputFormat}
                onChange={setOutputFormat}
                limitOutputs={limitOutputs}
              />
            </div>
          )}

          {file && forcedOutputFormat && (
            <div className="mt-4 text-[12px] text-[var(--muted)]">
              Output format: <span className="text-[var(--accent)] px-2 py-1 rounded-md" style={{ background: 'rgba(232,255,71,0.08)', border: '1px solid rgba(232,255,71,0.2)' }}>{OUTPUT_LABELS[forcedOutputFormat] || forcedOutputFormat.toUpperCase()}</span>
            </div>
          )}

          {status === "converting" && <ProgressBar progress={progress} />}

          {status === "error" && (
            <div className="mt-5 rounded-md p-4 text-[var(--error)]" style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)', fontSize: 13 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <FiAlertTriangle aria-hidden="true" />
                <span>{errorMsg}</span>
              </span>
            </div>
          )}

          {file && (
            <button
              disabled={!canConvert}
              onClick={() => convert(file, inputExt, outputFormat)}
              className={`w-full mt-7 py-4 rounded-lg font-extrabold text-base ${canConvert ? 'bg-[var(--accent)] text-black' : 'bg-[var(--border)] text-[var(--muted)]'}`}
            >
              {status === "converting" ? "Converting…" : `Convert to ${OUTPUT_LABELS[outputFormat] || outputFormat.toUpperCase()}`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
