import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Blog() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetch('/api/blog')
			.then((r) => r.ok ? r.json() : { posts: [] })
			.then((data) => setPosts(data.posts || []))
			.catch(() => setPosts([]));
	}, []);

	return (
		<div className="min-h-screen px-4 py-16 bg-[var(--bg)]">
			<div className="max-w-4xl mx-auto border border-[var(--border)] bg-[var(--surface)] rounded-2xl p-8 md:p-10">
				<h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] mb-4">File Conversion Blog</h1>
				<p className="text-[var(--muted)] leading-relaxed mb-6">
					Tips, guides, and best practices for converting documents, spreadsheets, presentations, PDFs, and images.
				</p>

				<div className="space-y-6">
					{posts.length === 0 && (
						<p className="text-[var(--muted)]">No posts yet.</p>
					)}
					{posts.map((p) => (
						<article key={p.slug} className="mb-2">
							<h2 className="text-xl font-bold text-[var(--text)] mb-1">
								<Link to={`/blog/${p.slug}`} className="hover:underline">{p.title}</Link>
							</h2>
							<p className="text-[var(--muted)]">{p.description}</p>
						</article>
					))}
				</div>
			</div>
		</div>
	);
}
