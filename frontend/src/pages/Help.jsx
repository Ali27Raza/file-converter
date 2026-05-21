import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	FiUpload, FiSettings, FiDownload, FiChevronDown,
	FiChevronUp, FiAlertCircle, FiMail, FiArrowRight,
	FiFileText, FiClock, FiShield,
} from "react-icons/fi";

const STEPS = [
	{
		icon: FiUpload,
		step: "01",
		title: "Upload your file",
		desc: "Navigate to the converter page for your format (e.g. Word to PDF). Click the upload zone or drag and drop your file into it. Supported file extensions are listed on each converter page.",
	},
	{
		icon: FiSettings,
		step: "02",
		title: "Choose output format",
		desc: "Some converters offer multiple output formats. If a format selector appears, pick the one you need. Otherwise the output format is fixed and shown in the page title.",
	},
	{
		icon: FiDownload,
		step: "03",
		title: "Convert & download",
		desc: "Click the Convert button and wait a few seconds. When complete, a download button appears. Your file is automatically deleted from our servers the moment you download it.",
	},
];

const CONVERTERS = [
	{ from: "Word (DOCX)", to: "PDF", path: "/word-to-pdf" },
	{ from: "Word (DOCX)", to: "Image (PNG/JPG)", path: "/word-to-image" },
	{ from: "Excel (XLSX)", to: "PDF", path: "/excel-to-pdf" },
	{ from: "PowerPoint (PPTX)", to: "PDF", path: "/ppt-to-pdf" },
	{ from: "PDF", to: "Word (DOCX)", path: "/pdf-to-word" },
	{ from: "PDF", to: "Image (PNG/JPG)", path: "/pdf-to-image" },
	{ from: "Image", to: "PDF", path: "/image-to-pdf" },
	{ from: "InPage (INP)", to: "PDF", path: "/inpage-to-pdf" },
	{ from: "InPage (INP)", to: "Image", path: "/inpage-to-image" },
];

const FAQS = [
	{
		q: "Is FileForge really free?",
		a: "Yes — completely. There is no paid plan, no trial, and no hidden limit. Every converter on this site is free to use with no account required.",
	},
	{
		q: "Are my files safe? Who can see them?",
		a: "Nobody. Files are uploaded over an encrypted HTTPS connection, processed in an isolated session on our server, and permanently deleted as soon as your download completes. We have no access to your file content and do not log or inspect uploads.",
	},
	{
		q: "What is the maximum file size?",
		a: "For most formats we support files up to 50 MB. Very large presentations or image-heavy documents may take longer to process. If your file exceeds the limit, you'll see a clear error message before conversion begins.",
	},
	{
		q: "My conversion failed — what should I check?",
		a: "First confirm the file extension matches the converter you're using (e.g., only .docx files on the Word to PDF page). Make sure the file isn't password-protected or corrupted. If it fails repeatedly, try re-saving the original in its source application and uploading again.",
	},
	{
		q: "Why does my converted PDF look different from the original?",
		a: "Layout fidelity depends on the fonts and features used in the source file. Documents using uncommon fonts may substitute them during conversion. For best results, embed fonts in the source document before uploading, or use PDF export from the original application.",
	},
	{
		q: "Do I need to install anything?",
		a: "No. FileForge runs entirely in your browser. Conversion happens on our server — you don't need LibreOffice, Microsoft Office, or any plugin installed on your device.",
	},
	{
		q: "Can I convert multiple files at once?",
		a: "Batch conversion is not yet supported. Each conversion is one file at a time. You can start a new conversion immediately after downloading your result.",
	},
	{
		q: "Why does InPage conversion require InPage to be installed?",
		a: "InPage's proprietary .inp format has no open specification. The only reliable way to extract the content is through the InPage application itself. For InPage-to-PDF conversion, InPage must be installed on the machine running the FileForge backend.",
	},
	{
		q: "Can I use FileForge on my phone or tablet?",
		a: "Yes. The interface is fully responsive and works on iOS and Android browsers. File selection and download work the same way as on desktop.",
	},
	{
		q: "How long does conversion take?",
		a: "Most conversions complete in 2–10 seconds. Large files or complex layouts may take up to 30 seconds. If conversion takes longer than 2 minutes, something has likely gone wrong — refresh and try again.",
	},
];

const TIPS = [
	{ icon: FiFileText, title: "Use the right converter page", desc: "Each page accepts a specific input format. Going to Word to PDF and uploading a .pptx won't work — use the PowerPoint to PDF page instead." },
	{ icon: FiShield, title: "Avoid password-protected files", desc: "Encrypted or password-protected documents cannot be processed. Remove the password in the source application before uploading." },
	{ icon: FiClock, title: "Don't close the tab mid-conversion", desc: "Conversion happens server-side, but the result is delivered to your browser tab. If you close the tab before downloading, you'll need to convert again." },
];

function FaqItem({ q, a }) {
	const [open, setOpen] = useState(false);
	return (
		<div
			className="rounded-xl overflow-hidden"
			style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
		>
			<button
				onClick={() => setOpen((v) => !v)}
				className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
				style={{ color: "var(--text)" }}
			>
				<span className="text-sm font-semibold">{q}</span>
				{open
					? <FiChevronUp className="shrink-0" style={{ color: "var(--accent)" }} />
					: <FiChevronDown className="shrink-0" style={{ color: "var(--muted)" }} />}
			</button>
			{open && (
				<div
					className="px-5 pb-5 text-sm leading-relaxed border-t"
					style={{ color: "var(--muted)", borderColor: "var(--border)" }}
				>
					<p className="pt-4">{a}</p>
				</div>
			)}
		</div>
	);
}

export function Help() {
	return (
		<>
			<Helmet>
				<title>Help Center — FileForge</title>
				<meta name="description" content="Learn how to convert files with FileForge. Step-by-step guides, supported format list, troubleshooting tips, and FAQs." />
			</Helmet>

			{/* ── Hero ── */}
			<section className="px-4 pt-20 pb-16 bg-[var(--bg)]">
				<div className="max-w-3xl mx-auto text-center">
					<div
						className="inline-flex items-center mb-6 text-xs uppercase tracking-widest font-semibold"
						style={{ color: "var(--accent)", background: "rgba(232,255,71,0.06)", borderRadius: 999, padding: "6px 16px", border: "1px solid rgba(232,255,71,0.14)" }}
					>
						Help Center
					</div>
					<h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5" style={{ color: "var(--text)" }}>
						How can we <span style={{ color: "var(--accent)" }}>help you?</span>
					</h1>
					<p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
						Everything you need to know about converting files with FileForge —
						from your first upload to troubleshooting tricky formats.
					</p>
				</div>
			</section>

			{/* ── How to convert ── */}
			<section className="px-4 py-20 bg-[var(--bg)] border-t border-[var(--border)]">
				<div className="max-w-5xl mx-auto">
					<p className="text-xs uppercase tracking-widest mb-3 text-center" style={{ color: "var(--accent)" }}>Getting started</p>
					<h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12" style={{ color: "var(--text)" }}>
						How to convert a file
					</h2>
					<div className="flex flex-col md:flex-row gap-4 md:gap-0">
						{STEPS.map(({ icon: Icon, step, title, desc }, i) => (
							<React.Fragment key={step}>
								<div
									className="flex-1 rounded-2xl p-6"
									style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
								>
									<div className="flex items-center gap-3 mb-4">
										<div
											className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
											style={{ background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.15)" }}
										>
											<Icon style={{ color: "var(--accent)", fontSize: 16 }} />
										</div>
										<span className="text-3xl font-extrabold leading-none select-none" style={{ color: "rgba(232,255,71,0.3)" }}>{step}</span>
									</div>
									<h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>{title}</h3>
									<p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</p>
								</div>
								{i < STEPS.length - 1 && (
									<div className="hidden md:flex items-center justify-center px-3">
										<FiArrowRight style={{ color: "var(--muted)", fontSize: 18 }} />
									</div>
								)}
							</React.Fragment>
						))}
					</div>
				</div>
			</section>

			{/* ── Supported converters ── */}
			<section className="px-4 py-20 bg-[var(--bg)] border-t border-[var(--border)]">
				<div className="max-w-5xl mx-auto">
					<p className="text-xs uppercase tracking-widest mb-3 text-center" style={{ color: "var(--accent)" }}>Available converters</p>
					<h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12" style={{ color: "var(--text)" }}>
						Supported conversion paths
					</h2>
					<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
						{CONVERTERS.map(({ from, to, path }) => (
							<Link
								key={path}
								to={path}
								className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 group"
								style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
							>
								<div className="min-w-0">
									<p className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>{from}</p>
									<p className="text-xs" style={{ color: "var(--muted)" }}>to {to}</p>
								</div>
								<FiArrowRight
									className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
									style={{ color: "var(--accent)", fontSize: 14 }}
								/>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* ── Tips ── */}
			<section className="px-4 py-20 bg-[var(--bg)] border-t border-[var(--border)]">
				<div className="max-w-5xl mx-auto">
					<p className="text-xs uppercase tracking-widest mb-3 text-center" style={{ color: "var(--accent)" }}>Pro tips</p>
					<h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12" style={{ color: "var(--text)" }}>
						Get the best results
					</h2>
					<div className="grid sm:grid-cols-3 gap-6">
						{TIPS.map(({ icon: Icon, title, desc }) => (
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

			{/* ── Troubleshooting ── */}
			<section className="px-4 py-20 bg-[var(--bg)] border-t border-[var(--border)]">
				<div className="max-w-3xl mx-auto">
					<p className="text-xs uppercase tracking-widest mb-3 text-center" style={{ color: "var(--accent)" }}>Troubleshooting</p>
					<h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6" style={{ color: "var(--text)" }}>
						Common issues
					</h2>
					<div
						className="rounded-2xl p-6 mb-12"
						style={{ background: "var(--surface)", border: "1px solid rgba(255,77,109,0.2)" }}
					>
						<div className="flex items-start gap-3">
							<FiAlertCircle className="mt-0.5 shrink-0" style={{ color: "var(--error)", fontSize: 18 }} />
							<div>
								<p className="font-semibold text-sm mb-2" style={{ color: "var(--text)" }}>If conversion fails, run through this checklist:</p>
								<ol className="list-decimal pl-4 space-y-1.5 text-sm" style={{ color: "var(--muted)" }}>
									<li>Confirm the file extension matches the converter page you're on.</li>
									<li>Make sure the file is not password-protected or encrypted.</li>
									<li>Check that the file is not corrupted — try opening it in its original app first.</li>
									<li>For InPage files, verify that InPage is installed on the backend server.</li>
									<li>Refresh the page and try uploading the file again.</li>
									<li>If the issue persists, re-save the file in its source application and retry.</li>
								</ol>
							</div>
						</div>
					</div>

					{/* ── FAQ ── */}
					<p className="text-xs uppercase tracking-widest mb-3 text-center" style={{ color: "var(--accent)" }}>FAQ</p>
					<h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8" style={{ color: "var(--text)" }}>
						Frequently asked questions
					</h2>
					<div className="space-y-3">
						{FAQS.map((item) => (
							<FaqItem key={item.q} {...item} />
						))}
					</div>
				</div>
			</section>

			{/* ── Contact CTA ── */}
			<section className="px-4 py-16 bg-[var(--bg)] border-t border-[var(--border)]">
				<div
					className="max-w-3xl mx-auto rounded-2xl p-10 text-center"
					style={{ background: "var(--surface)", border: "1px solid rgba(232,255,71,0.2)" }}
				>
					<FiMail className="mx-auto mb-4 text-3xl" style={{ color: "var(--accent)" }} />
					<h2 className="text-2xl font-extrabold mb-3" style={{ color: "var(--text)" }}>
						Still stuck?
					</h2>
					<p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--muted)" }}>
						If you couldn't find what you needed, reach out and we'll help as fast as we can.
						Include the file type, converter you used, and any error message you saw.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
						<a
							href="mailto:support@fileforge.app"
							className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-black"
							style={{ background: "var(--accent)" }}
						>
							<FiMail /> Email Support
						</a>
						<Link
							to="/about"
							className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm"
							style={{ color: "var(--text)", background: "transparent", border: "1px solid var(--border)" }}
						>
							About FileForge <FiArrowRight />
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
