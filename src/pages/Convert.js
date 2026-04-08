// src/pages/Convert.js
import React, { useState, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../context/AuthContext";
import {
  convertFile,
  formatFileSize,
  POPULAR_CONVERSIONS,
} from "../utils/conversionService";
import {
  Upload,
  CheckCircle,
  RefreshCw,
  Share2,
  Download,
  X,
  AlertCircle,
} from "lucide-react";
import "./Convert.css";

export default function Convert() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();

  const [file, setFile] = useState(location.state?.file || null);
  const [outputFormat, setOutputFormat] = useState("PDF");
  const [status, setStatus] = useState("idle"); // idle | uploading | converting | done | error
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus("idle");
      setResult(null);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 100 * 1024 * 1024,
    accept: {
      "application/msword": [".doc", ".docx"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  async function handleConvert() {
    if (!file || !outputFormat) return;
    setStatus("uploading");
    setError("");
    setProgress(0);

    try {
      const res = await convertFile(
        file,
        outputFormat,
        currentUser?.uid,
        ({ stage, percent }) => {
          setProgress(Math.round(percent));
          if (stage === "uploading") setProgressLabel("Uploading file...");
          else if (stage === "converting") setProgressLabel("Converting...");
          else if (stage === "done") setProgressLabel("Done!");
          if (stage === "converting") setStatus("converting");
        },
      );
      setResult(res);
      setStatus("done");
    } catch (err) {
      setError(err.message || "Conversion failed. Please try again.");
      setStatus("error");
    }
  }

  function handleReset() {
    setFile(null);
    setOutputFormat("PDF");
    setStatus("idle");
    setResult(null);
    setError("");
    setProgress(0);
  }

  function handleShare() {
    if (result?.downloadUrl) {
      navigator.clipboard.writeText(result.downloadUrl);
      alert("Link copied to clipboard!");
    }
  }

  const outputName =
    result?.filename ||
    (file
      ? `converted_${file.name.split(".")[0]}.${outputFormat.toLowerCase()}`
      : "");

  return (
    <div className="convert-page">
      <div className="convert-layout">
        {/* Left sidebar ad */}
        <aside className="convert-sidebar-left">
          <div className="ad-slot sidebar-ad-v" style={{ height: 500 }}>
            <span>ADVERTISEMENT</span>
            <small>High quality vertical ad placement</small>
          </div>
        </aside>

        {/* Main */}
        <main className="convert-main">
          <nav className="breadcrumb">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Home
            </a>
            <span className="bc-sep">›</span>
            <span>Download</span>
          </nav>

          {/* Success state */}
          {status === "done" && result && (
            <div className="result-card fade-in">
              <div className="result-success-icon">
                <CheckCircle size={32} color="#10b981" />
              </div>
              <h2 className="result-title">Conversion Successful!</h2>
              <p className="result-sub">
                Your file has been processed and is ready for download. It will
                be available for 24 hours.
              </p>

              <div className="result-file-box">
                <div className="result-file-preview">
                  <div className="result-file-icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <rect
                        x="3"
                        y="2"
                        width="17"
                        height="22"
                        rx="3"
                        fill="#2563eb"
                        opacity="0.15"
                      />
                      <rect
                        x="3"
                        y="2"
                        width="17"
                        height="22"
                        rx="3"
                        stroke="#2563eb"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7 10h10M7 13.5h10M7 17h7"
                        stroke="#2563eb"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="result-file-info">
                  <p className="result-filename">{outputName}</p>
                  <p className="result-meta">
                    {outputFormat} Document • {formatFileSize(result.fileSize)}{" "}
                    • {result.pages || ""} {result.pages ? "Pages" : ""}
                  </p>
                  <div className="result-actions">
                    <a
                      href={result.downloadUrl}
                      download={outputName}
                      className="btn btn-primary btn-lg"
                    >
                      <Download size={16} /> Download Now
                    </a>
                    <button className="btn btn-outline" onClick={handleShare}>
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                </div>
              </div>

              <button className="convert-another-link" onClick={handleReset}>
                <span>⊕</span> Convert another file
              </button>
              <p className="bulk-prompt">
                Want to convert multiple files?{" "}
                <a
                  href="/pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/pricing");
                  }}
                >
                  Upgrade to Pro
                </a>{" "}
                for bulk processing.
              </p>

              {/* Sponsored content */}
              <div className="sponsored-section">
                <p className="sponsored-label">SPONSORED CONTENT</p>
                <div className="sponsored-grid">
                  {[
                    {
                      title: "The Best Cloud Storage for 2024",
                      sponsor: "Sponsored by CloudGen",
                    },
                    {
                      title: "Sign PDF Documents Electronically",
                      sponsor: "Sponsored by SignEase",
                    },
                    {
                      title: "Protect Your Files with 256-bit Encryption",
                      sponsor: "Sponsored by GuardFile",
                    },
                  ].map((s) => (
                    <div className="sponsored-card" key={s.title}>
                      <div className="sponsored-thumb ad-slot" />
                      <div>
                        <p className="sponsored-title">{s.title}</p>
                        <p className="sponsored-by">{s.sponsor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Upload/Convert state */}
          {status !== "done" && (
            <div className="convert-card fade-in">
              <h1 className="convert-heading">
                {searchParams.get("from") && searchParams.get("to")
                  ? `${searchParams.get("from")} to ${searchParams.get("to")} Converter`
                  : "Convert Your File"}
              </h1>
              <p className="convert-desc">
                Fast, secure, and free file conversion — no registration needed.
              </p>

              {/* File upload */}
              {!file ? (
                <div
                  {...getRootProps()}
                  className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}
                >
                  <input {...getInputProps()} />
                  <div className="dropzone-icon">
                    <Upload size={26} />
                  </div>
                  <p className="dropzone-title">
                    {isDragActive
                      ? "Drop your file here..."
                      : "Drag & Drop a Word file here"}
                  </p>
                  <p className="dropzone-sub">
                    Supports .doc and .docx files. Output is PDF only.
                  </p>
                  <button className="btn btn-primary btn-sm" type="button">
                    Choose File
                  </button>
                </div>
              ) : (
                <div className="file-selected">
                  <div className="file-selected-info">
                    <div className="file-selected-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="3"
                          y="2"
                          width="13"
                          height="18"
                          rx="2"
                          fill="#2563eb"
                          opacity="0.2"
                          stroke="#2563eb"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M7 8h6M7 11h6M7 14h4"
                          stroke="#2563eb"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="fs-name">{file.name}</p>
                      <p className="fs-size">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button className="fs-remove" onClick={handleReset}>
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Format + Convert */}
              <div className="convert-bar">
                <div>
                  <label className="format-label">Output Format</label>
                  <select
                    className="format-select"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                  >
                    <option value="PDF">PDF</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleConvert}
                  disabled={
                    !file ||
                    !outputFormat ||
                    status === "uploading" ||
                    status === "converting"
                  }
                >
                  {status === "uploading" || status === "converting" ? (
                    <>
                      <RefreshCw size={16} className="spin-icon" />{" "}
                      {progressLabel}
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 8h12M8 2l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>{" "}
                      Convert
                    </>
                  )}
                </button>
              </div>

              {/* Progress */}
              {(status === "uploading" || status === "converting") && (
                <div className="progress-wrap">
                  <div className="progress-info">
                    <span className="progress-label">{progressLabel}</span>
                    <span className="progress-pct">{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {status === "error" && (
                <div className="error-box">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right sidebar ad */}
        <aside className="convert-sidebar-right">
          <div className="ad-slot sidebar-ad-v" style={{ height: 500 }}>
            <span>ADVERTISEMENT</span>
            <small>High quality vertical ad placement</small>
          </div>
        </aside>
      </div>
    </div>
  );
}
