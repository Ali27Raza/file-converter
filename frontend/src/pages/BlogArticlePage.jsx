import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SeoHead } from "../components/SeoHead";
import { FiCalendar, FiUser, FiClock, FiArrowLeft, FiShare2, FiTag } from "react-icons/fi";

function estimateReadTime(html) {
  const text = html?.replace(/<[^>]+>/g, "") || "";
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function BlogArticlePage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/blog/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => { if (mounted) setPost(data); })
      .catch(() => { if (mounted) setPost(null); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => (mounted = false);
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <span className="animate-spin w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full inline-block" />
          <p className="text-sm text-[var(--muted)]">Loading article…</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center px-4">
          <p className="text-5xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Article Not Found</h1>
          <p className="text-[var(--muted)] mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "var(--accent)", color: "#0a0a0f" }}
          >
            <FiArrowLeft size={14} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const siteUrl = (import.meta.env.VITE_SITE_URL || "https://yourwebsite.com").replace(/\/$/, "");
  const canonical = post.canonical_url || `${siteUrl}/blog/${post.slug}`;
  const readTime = estimateReadTime(post.content);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta_title || post.title,
    image: [new URL(post.og_image || post.image || "/og-image.png", siteUrl).toString()],
    author: { "@type": "Person", name: post.author || "FileForge" },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    description: post.meta_description || post.description,
    mainEntityOfPage: canonical,
    keywords: (post.keywords || []).join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonical },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <SeoHead
        pathname={`/blog/${post.slug}`}
        title={post.meta_title || post.title}
        description={post.meta_description || post.description}
        image={post.og_image || post.image}
        keywords={post.keywords}
        canonical={canonical}
        jsonLd={[articleSchema, breadcrumbSchema]}
      />

      {/* Hero with optional featured image */}
      {post.image && (
        <div className="relative w-full h-64 md:h-96 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, var(--bg))" }} />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--muted)] mb-8">
          <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[var(--accent)] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[var(--text)] truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(232,255,71,0.1)", color: "var(--accent)" }}
              >
                <FiTag size={10} /> {t}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--text)] leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta bar */}
        <div
          className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b border-[var(--border)] text-sm text-[var(--muted)]"
        >
          {post.author && (
            <span className="flex items-center gap-1.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--accent)", color: "#0a0a0f" }}
              >
                {post.author.charAt(0).toUpperCase()}
              </div>
              {post.author}
            </span>
          )}
          {post.published_at && (
            <span className="flex items-center gap-1">
              <FiCalendar size={13} />
              {new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <FiClock size={13} />
            {readTime} min read
          </span>
          <button
            onClick={handleShare}
            className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={
              copied
                ? { background: "rgba(34,197,94,0.12)", color: "#22c55e" }
                : { background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }
            }
          >
            <FiShare2 size={12} />
            {copied ? "Copied!" : "Share"}
          </button>
        </div>

        {/* Article content */}
        <div
          className="article-content text-[var(--text)] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Keywords */}
        {post.keywords?.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[var(--border)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">Keywords</p>
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((k) => (
                <span
                  key={k}
                  className="text-xs px-2.5 py-1 rounded-lg"
                  style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            <FiArrowLeft size={14} /> Back to all posts
          </Link>
        </div>
      </div>

      <style>{`
        .article-content h1 { font-size: 2rem; font-weight: 800; margin: 2rem 0 1rem; color: var(--text); }
        .article-content h2 { font-size: 1.5rem; font-weight: 700; margin: 1.75rem 0 0.75rem; color: var(--text); }
        .article-content h3 { font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: var(--text); }
        .article-content h4 { font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: var(--text); }
        .article-content p { margin: 0.875rem 0; color: var(--muted); line-height: 1.8; }
        .article-content strong { font-weight: 700; color: var(--text); }
        .article-content em { font-style: italic; }
        .article-content code { font-family: monospace; background: rgba(255,255,255,0.08); padding: 0.15em 0.45em; border-radius: 5px; font-size: 0.875em; color: var(--accent); }
        .article-content pre { background: #111118; border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; overflow-x: auto; margin: 1.25rem 0; }
        .article-content pre code { background: none; padding: 0; color: var(--text); }
        .article-content blockquote { border-left: 3px solid var(--accent); padding: 0.5rem 0 0.5rem 1.25rem; color: var(--muted); margin: 1.25rem 0; font-style: italic; background: rgba(232,255,71,0.03); border-radius: 0 8px 8px 0; }
        .article-content ul { list-style: none; padding-left: 0; margin: 0.75rem 0; }
        .article-content ul li { padding-left: 1.5rem; position: relative; margin: 0.4rem 0; color: var(--muted); }
        .article-content ul li::before { content: "•"; color: var(--accent); position: absolute; left: 0; font-weight: bold; }
        .article-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.75rem 0; color: var(--muted); }
        .article-content ol li { margin: 0.4rem 0; }
        .article-content a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
        .article-content img { max-width: 100%; border-radius: 12px; margin: 1.25rem 0; }
        .article-content hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
        .article-content table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; font-size: 0.9rem; }
        .article-content th { background: var(--surface); color: var(--text); font-weight: 600; padding: 0.75rem 1rem; text-align: left; border: 1px solid var(--border); }
        .article-content td { padding: 0.65rem 1rem; border: 1px solid var(--border); color: var(--muted); }
        .article-content tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
        .article-content mark { background: rgba(232,255,71,0.2); color: var(--text); border-radius: 3px; padding: 0 3px; }
      `}</style>
    </div>
  );
}
