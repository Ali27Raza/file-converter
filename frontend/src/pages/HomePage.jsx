import React, { useState } from "react";
import { ConverterWidget } from "../components/ConverterWidget";
import {
  FiFileText, FiShield, FiZap, FiLock, FiDownload, FiCpu,
  FiCheckCircle, FiArrowRight
} from "react-icons/fi";
import {
  FaFileWord, FaFilePdf, FaFilePowerpoint, FaFileExcel,
  FaFileAlt, FaFileImage, FaImage
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const STATS = [
  { value: "20+", label: "File Formats" },
  { value: "100%", label: "Private" },
  { value: "0", label: "Data Stored" },
  { value: "Free", label: "No Account" },
];

const FEATURES = [
  {
    icon: FiLock,
    title: "Privacy First",
    desc: "Files are processed server-side and permanently deleted after conversion. We never read, store, or share your data.",
  },
  {
    icon: FiZap,
    title: "Instant Conversion",
    desc: "High-performance conversion pipeline delivers results in seconds, even for large documents and high-resolution images.",
  },
  {
    icon: FiCpu,
    title: "No Software Needed",
    desc: "Everything runs in the browser. No installs, no plugins, no sign-up — just upload, convert, and download.",
  },
  {
    icon: FiShield,
    title: "Secure by Design",
    desc: "Each file gets a unique temporary session. Your files are never accessible to other users or retained after delivery.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Upload your file",
    desc: "Drag & drop or click to select any supported document or image.",
  },
  {
    step: "02",
    title: "Choose output format",
    desc: "Pick from dozens of supported target formats — Word, PDF, PNG, and more.",
  },
  {
    step: "03",
    title: "Download instantly",
    desc: "Your converted file is ready in seconds and deleted right after download.",
  },
];

const FORMAT_GROUPS = [
  { label: "Documents", formats: ["DOCX", "PDF", "PPTX", "XLSX", "ODT"] },
  { label: "Images", formats: ["PNG", "JPG", "WEBP", "BMP", "TIFF"] },
];

const FORMAT_INFO = {
  DOCX: { icon: FaFileWord,       tip: "Microsoft Word document format. Supports rich text, tables, images, and complex layouts. The industry standard for editable documents." },
  PDF:  { icon: FaFilePdf,        tip: "Portable Document Format. Preserves exact layout on any device or OS. The go-to format for sharing final, print-ready documents." },
  PPTX: { icon: FaFilePowerpoint, tip: "Microsoft PowerPoint presentation. Supports slides, animations, charts, and multimedia. Ideal for professional presentations." },
  XLSX: { icon: FaFileExcel,      tip: "Microsoft Excel spreadsheet. Handles large data tables, formulas, pivot tables, and charts. The standard for structured data." },
  ODT:  { icon: FaFileAlt,        tip: "Open Document Text — an open ISO standard used by LibreOffice, OpenOffice, and Google Docs. Fully open and vendor-neutral." },
  PNG:  { icon: FaFileImage,      tip: "Portable Network Graphics. Lossless compression with full transparency support. Best for screenshots, logos, and UI graphics." },
  JPG:  { icon: FaFileImage,      tip: "JPEG compressed image. Excellent for photographs and complex scenes. Reduces file size significantly with minimal perceptible quality loss." },
  WEBP: { icon: FaImage,          tip: "Modern web image format developed by Google. Offers 25–35% better compression than JPEG/PNG at equivalent quality. Ideal for web." },
  BMP:  { icon: FaImage,          tip: "Windows Bitmap format. Stores raw, uncompressed pixel data. Produces large files but with zero quality loss — useful for certain legacy workflows." },
  TIFF: { icon: FaImage,          tip: "Tagged Image File Format. High-fidelity lossless format used in professional photography, scanning, and print production pipelines." },
};

function FormatBadge({ fmt }) {
  const [hovered, setHovered] = useState(false);
  const info = FORMAT_INFO[fmt] || { icon: FaFileAlt, tip: fmt };
  const Icon = info.icon;

  return (
    <div className="relative inline-block">
      <span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg"
        style={{
          background: hovered ? "rgba(232,255,71,0.16)" : "rgba(232,255,71,0.06)",
          border: "1px solid rgba(232,255,71,0.2)",
          color: "var(--accent)",
          letterSpacing: "0.05em",
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
      >
        <Icon style={{ fontSize: 11, flexShrink: 0 }} />
        {fmt}
      </span>

      {hovered && (
        <div
          className="absolute z-50 bottom-full left-1/2 mb-2 w-56 rounded-xl p-3 pointer-events-none"
          style={{
            transform: "translateX(-50%)",
            background: "#16161f",
            border: "1px solid rgba(232,255,71,0.22)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
          }}
        >
          <p className="text-xs font-bold mb-1" style={{ color: "var(--accent)" }}>{fmt}</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{info.tip}</p>
          <div
            className="absolute left-1/2 top-full"
            style={{
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid rgba(232,255,71,0.22)",
            }}
          />
        </div>
      )}
    </div>
  );
}

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>FileForge — Free File Converter | Convert Word, Excel, PowerPoint, PDF, and Images Instantly</title>
        <meta name="description" content="Fast, private file conversion. Convert Word, Excel, PowerPoint, PDF, and images instantly in your browser. No uploads, no sharing—just local processing and automatic deletion." />
      </Helmet>

      {/* ── Hero ── */}
      <div className="min-h-screen flex items-start justify-center py-16 px-4 bg-[var(--bg)]">
        <div className="w-full max-w-6xl mx-auto md:flex md:items-center md:gap-12">

          {/* Left: text */}
          <div className="md:flex-1 mb-8 md:mb-0">
            <div
              className="inline-flex items-center mb-6 text-sm uppercase tracking-wider"
              style={{ color: "var(--accent)", background: "rgba(232,255,71,0.06)", borderRadius: 999, padding: "6px 14px", border: "1px solid rgba(232,255,71,0.12)" }}
            >
              <FiFileText className="mr-3" />
              <span className="font-semibold">File Converter</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: "var(--text)" }}>
              Convert <span className="text-[var(--accent)]">File Format</span>
              <br className="hidden md:block" />
              to any supported format.
            </h1>

            <p className="text-base md:text-lg text-[var(--muted)] mb-2">
              Word · Excel · PowerPoint · PDF · Images
            </p>

            <p className="mt-4 text-[var(--muted)] max-w-lg leading-relaxed">
              Fast, private file conversion — processed securely and deleted immediately after delivery. No account, no limits, no traces.
            </p>

            {/* Trust bullets */}
            <ul className="mt-6 space-y-2">
              {[
                "No file size restrictions on common formats",
                "Files auto-deleted after download",
                "No login or account required",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                  <FiCheckCircle className="shrink-0" style={{ color: "var(--accent)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: converter */}
          <div className="w-full md:w-[420px]">
            <ConverterWidget />
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <h1 className="text-4xl font-bold text-center mb-6" style={{ color: "var(--text)" }}>Why Choose FileForge</h1>
      <div className="bg-[var(--bg)] border-y border-[var(--border)] py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold" style={{ color: "var(--accent)" }}>{value}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "var(--muted)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <section className="bg-[var(--bg)] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-3 text-center" style={{ color: "var(--accent)" }}>How it works</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12" style={{ color: "var(--text)" }}>
            Three steps to your converted file
          </h2>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
            {STEPS.map(({ step, title, desc }, i) => (
              <React.Fragment key={step}>
                <div
                  className="flex-1 rounded-2xl p-6"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <span
                    className="text-5xl font-extrabold leading-none select-none"
                    style={{ color: "rgba(232,255,71,0.5)" }}
                  >
                    {step}
                  </span>
                  <h3 className="font-bold text-base mt-3 mb-2" style={{ color: "var(--text)" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex items-center justify-center px-3">
                    <FiArrowRight className="text-xl" style={{ color: "var(--text)" }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-[var(--bg)] py-20 px-4 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-3 text-center" style={{ color: "var(--accent)" }}>Why FileForge</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12" style={{ color: "var(--text)" }}>
            Built for speed, privacy, and reliability
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl p-6"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-xl mb-4"
                  style={{ background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.15)" }}
                >
                  <Icon style={{ color: "var(--accent)", fontSize: 18 }} />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Supported formats ── */}
      <section className="bg-[var(--bg)] py-20 px-4 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-3 text-center" style={{ color: "var(--accent)" }}>Supported formats</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12" style={{ color: "var(--text)" }}>
            All the formats you need
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {FORMAT_GROUPS.map(({ label, formats }) => (
              <div key={label} className="flex-1 max-w-md">
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>{label}</p>
                <div className="flex flex-wrap gap-2">
                  {formats.map((fmt) => (
                    <FormatBadge key={fmt} fmt={fmt} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="bg-[var(--bg)] py-16 px-4 border-t border-[var(--border)]">
        <div
          className="max-w-3xl mx-auto rounded-2xl p-10 text-center"
          style={{ background: "var(--surface)", border: "1px solid rgba(232,255,71,0.2)" }}
        >
          <FiDownload className="mx-auto mb-4 text-3xl" style={{ color: "var(--accent)" }} />
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: "var(--text)" }}>
            Ready to convert your file?
          </h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--muted)" }}>
            No account required. Drag and drop your file above and get your converted file in seconds.
          </p>
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-black"
            style={{ background: "var(--accent)" }}
          >
            Convert Now <FiArrowRight />
          </a>
        </div>
      </section>
    </>
  );
}
