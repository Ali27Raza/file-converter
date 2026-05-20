import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FiFile} from "react-icons/fi";
import { FORMAT_MAP } from "../conversionConfig";

const ACCEPTED_EXTS = Object.keys(FORMAT_MAP);

// MIME type mapping for file extensions
const MIME_TYPES = {
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  inp: "application/octet-stream",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export function DropZone({ onFile, allowedInputExts }) {
  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) onFile(accepted[0]);
  }, [onFile]);

  // Build accept object dynamically based on allowedInputExts
  const acceptConfig = useMemo(() => {
    const config = {};
    const exts = allowedInputExts && allowedInputExts.length > 0 ? allowedInputExts : ACCEPTED_EXTS;
    
    exts.forEach((ext) => {
      const mime = MIME_TYPES[ext];
      if (mime) {
        if (!config[mime]) {
          config[mime] = [];
        }
        config[mime].push(`.${ext}`);
      }
    });
    
    return config;
  }, [allowedInputExts]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: acceptConfig,
  });

  return (
    <div
      {...getRootProps()}
      className="w-full rounded-xl bg-[var(--surface)] p-2 cursor-pointer"
    >
      <div
        className={`w-full text-center transition-all duration-200 rounded-lg py-14 px-8 border-2 border-dashed ${isDragActive ? 'border-[var(--accent)] bg-[rgba(232,255,71,0.04)]' : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[rgba(232,255,71,0.04)]'}`}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center mb-4 text-[var(--accent)]"><FiFile size={56} /></div>
        <p className="text-xl font-bold text-[var(--text)] mb-2">{isDragActive ? "Drop it here!" : "Drag & drop your file"}</p>
        <p className="text-sm text-[var(--muted)]">or click to browse</p>
        <p className="text-sm text-[var(--muted)] mt-3">
          Supports: { (allowedInputExts && allowedInputExts.length > 0 ? allowedInputExts : ACCEPTED_EXTS).map(e => e.toUpperCase()).join(" · ") }
        </p>
      </div>
    </div>
  );
}
