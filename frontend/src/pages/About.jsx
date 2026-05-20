import React from "react";

export function About() {
	return (
		<div className="min-h-screen px-4 py-16 bg-[var(--bg)]">
			<div className="max-w-4xl mx-auto border border-[var(--border)] bg-[var(--surface)] rounded-2xl p-8 md:p-10">
				<h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] mb-4">About FileForge</h1>
				<p className="text-[var(--muted)] leading-relaxed mb-4">
					FileForge is an online file conversion tool built to make everyday format conversion simple, fast, and reliable.
					You can convert Word, Excel, PowerPoint, PDF, InPage, and image files in a clean workflow.
				</p>
				<p className="text-[var(--muted)] leading-relaxed">
					Our goal is to give users a straightforward converter experience with clear format support and high-quality output.
				</p>
			</div>
		</div>
	);
}
