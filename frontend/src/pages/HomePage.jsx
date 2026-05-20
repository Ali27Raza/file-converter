import React from "react";
import { ConverterWidget } from "../components/ConverterWidget";
import { FiFileText } from "react-icons/fi";
import { Helmet } from "react-helmet-async";

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>FileForge — Free File Converter | Convert Word, Excel, PowerPoint, PDF, and Images Instantly</title>
        <meta name="description" content="Fast, private file conversion. Convert Word, Excel, PowerPoint, PDF, and images instantly in your browser. No uploads, no sharing—just local processing and automatic deletion." />
      </Helmet>
    <div className="min-h-screen flex items-start justify-center py-16 px-4 bg-[var(--bg)]">
      <div className="w-full max-w-6xl mx-auto md:flex md:items-center md:gap-12">
        {/* Left: text */}
        <div className="md:flex-1 mb-8 md:mb-0">
          <div className="inline-flex items-center mb-6 text-sm uppercase tracking-wider"
            style={{ color: "var(--accent)", background: "rgba(232,255,71,0.06)", borderRadius: 999, padding: '6px 14px', border: '1px solid rgba(232,255,71,0.12)' }}>
            <FiFileText className="mr-3" />
            <span className="font-semibold">File Converter</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--text)' }}>
            Convert <span className="text-[var(--accent)]">anything</span>
            <br className="hidden md:block" />
            to anything.
          </h1>

          <p className="text-base md:text-lg text-[var(--muted)]">
            Word · Excel · PowerPoint · PDF · Images
          </p>

          <p className="mt-6 text-[var(--muted)] max-w-lg leading-relaxed">
            Fast, private file conversion—processed locally and deleted after conversion. No uploads, no sharing.
          </p>
        </div>

        {/* Right: converter */}
        <div className="w-full md:w-96">
          <div className="mx-auto">
            <ConverterWidget />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
