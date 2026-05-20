import React from "react";

export function Help() {
	return (
		<div className="min-h-screen px-4 py-16 bg-[var(--bg)]">
			<div className="max-w-4xl mx-auto border border-[var(--border)] bg-[var(--surface)] rounded-2xl p-8 md:p-10">
				<h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] mb-4">Help Center</h1>
				<h2 className="text-xl font-bold text-[var(--text)] mb-2">How to convert files</h2>
				<ol className="list-decimal pl-6 text-[var(--muted)] space-y-2 mb-6">
					<li>Open your converter page (e.g., Word to PDF).</li>
					<li>Upload the supported input file format.</li>
					<li>Choose the output format (if applicable).</li>
					<li>Click Convert and then download the result.</li>
				</ol>
				<h2 className="text-xl font-bold text-[var(--text)] mb-2">Common issues</h2>
				<p className="text-[var(--muted)] leading-relaxed">
					If conversion fails, confirm the file extension is supported and try again. For InPage conversion, ensure InPage is installed on the backend machine.
				</p>
			</div>
		</div>
	);
}
