import React, { useRef, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { FiUploadCloud, FiX, FiImage, FiClipboard } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

export function ImageUploadZone({ value, onChange, label = "Featured Image" }) {
  const { authHeader } = useAuth();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const upload = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be under 8 MB.");
      return;
    }
    setError("");
    setUploading(true);
    setProgress(0);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await axios.post("/api/admin/blog/upload-image", fd, {
        headers: { ...authHeader, "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded / e.total) * 100)),
      });
      onChange(res.data.url);
    } catch (e) {
      setError(e?.response?.data?.error || "Upload failed. Try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [authHeader, onChange]);

  // Handle paste anywhere on the page when this component is mounted
  useEffect(() => {
    const handler = (e) => {
      const items = Array.from(e.clipboardData?.items || []);
      const imageItem = items.find((i) => i.type.startsWith("image/"));
      if (imageItem) {
        e.preventDefault();
        upload(imageItem.getAsFile());
      }
    };
    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, [upload]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) upload(file);
    e.target.value = "";
  };

  const remove = () => onChange("");

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
        {label}
      </label>

      {value ? (
        /* Preview */
        <div className="relative group rounded-xl overflow-hidden aspect-video bg-[var(--bg)]">
          <img
            src={value}
            alt="Featured"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <FiUploadCloud size={13} /> Replace
            </button>
            <button
              type="button"
              onClick={remove}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all"
            >
              <FiX size={13} /> Remove
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className="relative flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer transition-all select-none"
          style={{
            minHeight: 140,
            border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
            background: dragging ? "rgba(232,255,71,0.04)" : "var(--bg)",
          }}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3 px-6 py-4">
              <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
              <p className="text-xs text-[var(--muted)]">Uploading… {progress}%</p>
              <div
                className="w-48 h-1.5 rounded-full overflow-hidden"
                style={{ background: "var(--border)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, background: "var(--accent)" }}
                />
              </div>
            </div>
          ) : (
            <>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(232,255,71,0.08)" }}
              >
                <FiImage size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-medium text-[var(--text)]">
                  Drop image here, or{" "}
                  <span style={{ color: "var(--accent)" }}>click to browse</span>
                </p>
                <p className="text-xs text-[var(--muted)] mt-1 flex items-center justify-center gap-1">
                  <FiClipboard size={10} /> Ctrl+V to paste from clipboard
                </p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  PNG, JPG, GIF, WebP — max 8 MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
