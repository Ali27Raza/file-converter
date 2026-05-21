import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FiShield, FiZap, FiHeart, FiGlobe,
  FiLock, FiCode, FiArrowRight, FiCheckCircle,
} from "react-icons/fi";

const STATS = [
  { value: "20+", label: "Formats Supported" },
  { value: "100%", label: "Private Processing" },
  { value: "0", label: "Files Retained" },
  { value: "Free", label: "Always & Forever" },
];

const VALUES = [
  {
    icon: FiLock,
    title: "Privacy by Default",
    desc: "Your files are processed server-side in isolated sessions and permanently deleted after conversion. We never read, index, or store your content — not even temporarily beyond the conversion window.",
  },
  {
    icon: FiZap,
    title: "Speed Without Compromise",
    desc: "Our conversion pipeline is optimised for throughput. Whether it's a single-page PDF or a 200-slide presentation, you get your result in seconds — not minutes.",
  },
  {
    icon: FiGlobe,
    title: "Open & Accessible",
    desc: "No account. No paywall. No browser extension required. FileForge works on any device with a modern browser, anywhere in the world, completely free of charge.",
  },
  {
    icon: FiCode,
    title: "Built on Solid Tech",
    desc: "Under the hood we use battle-tested open-source libraries — LibreOffice for documents, Pillow and ImageMagick for images — so output quality matches what professionals expect.",
  },
  {
    icon: FiShield,
    title: "Secure by Architecture",
    desc: "Each upload gets a unique temporary token. Files are never shared between sessions and are wiped from disk the moment your download completes.",
  },
  {
    icon: FiHeart,
    title: "Built with Care",
    desc: "FileForge started as a frustration with bloated, ad-riddled converters. Every design decision — from the UI to the backend — is made with the user experience in mind first.",
  },
];

const FORMATS = [
  { group: "Documents", items: ["Word (DOCX)", "PDF", "PowerPoint (PPTX)", "Excel (XLSX)", "InPage (INP)"] },
  { group: "Images", items: ["PNG", "JPEG / JPG", "WebP", "BMP", "TIFF"] },
];

const TIMELINE = [
  { year: "2023", event: "FileForge started as a weekend project to solve a real problem: converting InPage Urdu files without paying for proprietary software." },
  { year: "2024", event: "Extended to support the full Office suite (Word, Excel, PowerPoint) and all major image formats. Launched publicly." },
  { year: "2025", event: "Rebuilt the conversion pipeline for speed and reliability. Added image-to-PDF, PDF-to-image, and batch processing groundwork." },
  { year: "Now",  event: "Serving thousands of conversions every month with zero user accounts, zero data retention, and zero ads." },
];

export function About() {
  return (
    <>
      <Helmet>
        <title>About FileForge — Private, Fast File Conversion</title>
        <meta name="description" content="Learn how FileForge works, why we built it, and the values that guide every decision — privacy first, always free, no account required." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="px-4 pt-20 pb-16 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center mb-6 text-xs uppercase tracking-widest font-semibold"
            style={{ color: "var(--accent)", background: "rgba(232,255,71,0.06)", borderRadius: 999, padding: "6px 16px", border: "1px solid rgba(232,255,71,0.14)" }}
          >
            About FileForge
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5" style={{ color: "var(--text)" }}>
            File conversion that <span style={{ color: "var(--accent)" }}>respects&nbsp;you</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
            FileForge is a free, privacy-first file converter. No sign-up, no tracking, no nonsense —
            just upload your file, pick a format, and download the result. Everything else is noise.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="bg-[var(--bg)] border-y border-[var(--border)] py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl md:text-4xl font-extrabold" style={{ color: "var(--accent)" }}>{value}</p>
              <p className="text-xs uppercase tracking-widest mt-2" style={{ color: "var(--muted)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mission ── */}
      <section className="px-4 py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto md:flex md:gap-16 md:items-start">
          <div className="md:flex-1 mb-10 md:mb-0">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Our Mission</p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-5" style={{ color: "var(--text)" }}>
              The converter we always wanted
            </h2>
            <p className="leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
              Most online converters are paywalled, ad-stuffed, or quietly retain your files for analytics.
              FileForge was built to be the opposite: genuinely free, demonstrably private, and fast enough
              that you don't think twice about using it.
            </p>
            <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
              We believe a file conversion tool should be a utility — like a calculator. You use it,
              it does its job, and it disappears. No account to manage, no subscription to cancel,
              no data to worry about.
            </p>
          </div>
          <div className="md:w-80">
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>What we promise</p>
              <ul className="space-y-3">
                {[
                  "No account or sign-in ever required",
                  "Files deleted immediately after download",
                  "No ads, no upsells, no paywalls",
                  "No analytics on your file content",
                  "No cookies beyond session mechanics",
                  "Open about what we do and don't do",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--muted)" }}>
                    <FiCheckCircle className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="px-4 py-20 bg-[var(--bg)] border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-3 text-center" style={{ color: "var(--accent)" }}>What we stand for</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12" style={{ color: "var(--text)" }}>
            Our core values
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
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
      <section className="px-4 py-20 bg-[var(--bg)] border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-3 text-center" style={{ color: "var(--accent)" }}>Supported formats</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12" style={{ color: "var(--text)" }}>
            Every format you actually need
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {FORMATS.map(({ group, items }) => (
              <div
                key={group}
                className="rounded-2xl p-6"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>{group}</p>
                <ul className="space-y-2">
                  {items.map((fmt) => (
                    <li key={fmt} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: "var(--accent)" }}
                      />
                      {fmt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="px-4 py-20 bg-[var(--bg)] border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-3 text-center" style={{ color: "var(--accent)" }}>Our journey</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12" style={{ color: "var(--text)" }}>
            How we got here
          </h2>
          <div className="relative pl-6 border-l" style={{ borderColor: "var(--border)" }}>
            {TIMELINE.map(({ year, event }, i) => (
              <div key={year} className={i < TIMELINE.length - 1 ? "mb-10" : ""}>
                <div
                  className="absolute -left-2 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "var(--surface)", border: "2px solid var(--accent)", marginTop: 2 }}
                />
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>{year}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-16 bg-[var(--bg)] border-t border-[var(--border)]">
        <div
          className="max-w-3xl mx-auto rounded-2xl p-10 text-center"
          style={{ background: "var(--surface)", border: "1px solid rgba(232,255,71,0.2)" }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: "var(--text)" }}>
            Ready to convert a file?
          </h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--muted)" }}>
            No account. No payment. Just drag, drop, and download. It takes about ten seconds.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-black"
            style={{ background: "var(--accent)" }}
          >
            Start Converting <FiArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
