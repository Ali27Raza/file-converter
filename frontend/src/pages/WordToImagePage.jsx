import React from "react";
import { ConverterWidget } from "../components/ConverterWidget";
import { OnPageSeoContent } from "../components/OnPageSeoContent";

const ALLOWED = ["doc", "docx"];
const IMAGE_OUTPUTS = ["jpg", "png"];

export function WordToImagePage() {
  return (
    <div className="min-h-screen py-16 px-4 bg-[var(--bg)]">
      <div className="w-full max-w-6xl mx-auto md:flex md:items-center md:gap-12">
        <div className="md:flex-1 mb-8 md:mb-0">
          <div className="inline-flex items-center mb-6 text-sm uppercase tracking-wider" style={{ color: 'var(--accent)', background: 'rgba(232,255,71,0.06)', borderRadius: 999, padding: '6px 14px', border: '1px solid rgba(232,255,71,0.12)' }}>
            <span className="font-semibold">WORD TO IMAGE</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--text)' }}>
            Convert <span className="text-[var(--accent)]">Word docs</span><br />to images.
          </h1>

          <p className="text-base md:text-lg text-[var(--muted)]">DOC · DOCX to JPG · PNG</p>
        </div>

        <div className="w-full md:w-96">
          <ConverterWidget allowedInputExts={ALLOWED} limitOutputs={IMAGE_OUTPUTS} />
        </div>
      </div>

      <OnPageSeoContent
        toolName="Word to Image Converter"
        intro="Turn Word files into JPG or PNG images for previews, sharing, and visual content workflows."
        steps={[
          "Upload your DOC or DOCX file.",
          "Choose JPG or PNG as output.",
          "Convert and download the image result.",
        ]}
        faqs={[
          { q: "Which image format should I choose?", a: "Use PNG for text clarity and JPG for smaller file size." },
          { q: "Can I convert DOC and DOCX?", a: "Yes, both formats are supported." },
          { q: "Is conversion fast?", a: "Most files convert in seconds depending on size." },
        ]}
        relatedLinks={[
          { to: "/word-to-pdf", label: "Word to PDF" },
          { to: "/pdf-to-image", label: "PDF to Image" },
        ]}
        trustNote="No account required. Convert and download in a few clicks."
        updatedAt="May 2026"
      />
    </div>
  );
}
