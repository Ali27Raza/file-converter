import React from "react";
import { ConverterWidget } from "../components/ConverterWidget";
import { OnPageSeoContent } from "../components/OnPageSeoContent";

const ALLOWED = ["inp"]; // placeholder extension for InPage

export function InPageToImagePage() {
    return (
        <div className="min-h-screen py-16 px-4 bg-[var(--bg)]">
            <div className="w-full max-w-6xl mx-auto md:flex md:items-center md:gap-12">
                <div className="md:flex-1 mb-8 md:mb-0">
                    <div className="inline-flex items-center mb-6 text-sm uppercase tracking-wider" style={{ color: 'var(--accent)', background: 'rgba(232,255,71,0.06)', borderRadius: 999, padding: '6px 14px', border: '1px solid rgba(232,255,71,0.12)' }}>
                        <span className="font-semibold">INPAGE TO IMAGE</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--text)' }}>
                        Convert <span className="text-[var(--accent)]">InPage</span><br />to images.
                    </h1>

                    <p className="text-base md:text-lg text-[var(--muted)]">INPAGE to JPG · PNG</p>
                </div>

                <div className="w-full md:w-96">
                    <ConverterWidget allowedInputExts={ALLOWED} limitOutputs={["jpg", "png"]} />
                </div>
            </div>

            <OnPageSeoContent
                toolName="InPage to Image Converter"
                intro="Export InPage documents as JPG or PNG images for previews and quick sharing."
                steps={[
                    "Upload your .inp file.",
                    "Select JPG or PNG output.",
                    "Convert and download the image result.",
                ]}
                faqs={[
                    { q: "Which output formats are supported?", a: "JPG and PNG are supported." },
                    { q: "Can I preview images after conversion?", a: "Yes, downloaded images can be previewed instantly." },
                    { q: "Is this suitable for social sharing?", a: "Yes, image output is easy to share on web and messaging platforms." },
                ]}
                relatedLinks={[
                    { to: "/inpage-to-pdf", label: "InPage to PDF" },
                    { to: "/image-to-pdf", label: "Image to PDF" },
                ]}
                trustNote="Built for quick format transitions from legacy InPage documents."
                updatedAt="May 2026"
            />
        </div>
    );
}
