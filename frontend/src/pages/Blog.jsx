import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiUser, FiTag, FiSearch } from "react-icons/fi";

function PostCard({ post }) {
  const thumb = post.thumbnail || post.image;
  return (
    <article
      className="group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01]"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {thumb ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={thumb}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="aspect-video flex items-center justify-center"
          style={{ background: "rgba(232,255,71,0.04)" }}
        >
          <span className="text-4xl opacity-15">📄</span>
        </div>
      )}
      <div className="p-6">
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "rgba(232,255,71,0.1)", color: "var(--accent)" }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg font-bold text-[var(--text)] mb-2 leading-snug group-hover:text-[var(--accent)] transition-colors">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        {/* Description */}
        {post.description && (
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 line-clamp-2">
            {post.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
            {post.author && (
              <span className="flex items-center gap-1">
                <FiUser size={11} /> {post.author}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1">
                <FiCalendar size={11} />
                {new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>
          <Link
            to={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:gap-2 transition-all"
          >
            Read <FiArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(
    (p) =>
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen px-4 py-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(232,255,71,0.1)", color: "var(--accent)" }}
          >
            <FiTag size={11} /> File Conversion Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text)] mb-4">
            Tips, Guides & Best Practices
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto leading-relaxed">
            Expert guides for PDF, Word, Excel, PowerPoint, InPage, and image conversions.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-10">
          <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search articles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl h-64 animate-pulse"
                style={{ background: "var(--surface)" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--muted)] text-lg mb-2">
              {search ? `No posts matching "${search}"` : "No posts published yet."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm text-[var(--accent)] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured first post */}
            {!search && filtered.length > 0 && (
              <article
                className="group rounded-2xl overflow-hidden mb-8 grid md:grid-cols-2 transition-all duration-300"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {(filtered[0].thumbnail || filtered[0].image) ? (
                  <div className="aspect-video md:aspect-auto overflow-hidden">
                    <img
                      src={filtered[0].thumbnail || filtered[0].image}
                      alt={filtered[0].title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div
                    className="aspect-video md:aspect-auto flex items-center justify-center"
                    style={{ background: "rgba(232,255,71,0.05)" }}
                  >
                    <span className="text-6xl opacity-20">✍️</span>
                  </div>
                )}
                <div className="p-8 flex flex-col justify-center">
                  <div
                    className="text-xs font-semibold mb-3 inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(232,255,71,0.1)", color: "var(--accent)" }}
                  >
                    Featured
                  </div>
                  {filtered[0].tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {filtered[0].tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded text-[var(--muted)]"
                          style={{ background: "var(--bg)" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="text-2xl font-extrabold text-[var(--text)] mb-3 leading-tight group-hover:text-[var(--accent)] transition-colors">
                    <Link to={`/blog/${filtered[0].slug}`}>{filtered[0].title}</Link>
                  </h2>
                  {filtered[0].description && (
                    <p className="text-[var(--muted)] text-sm leading-relaxed mb-5 line-clamp-3">
                      {filtered[0].description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                      {filtered[0].author && (
                        <span className="flex items-center gap-1"><FiUser size={11} /> {filtered[0].author}</span>
                      )}
                      {filtered[0].published_at && (
                        <span className="flex items-center gap-1">
                          <FiCalendar size={11} />
                          {new Date(filtered[0].published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/blog/${filtered[0].slug}`}
                      className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                      style={{ background: "var(--accent)", color: "#0a0a0f" }}
                    >
                      Read <FiArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* Remaining posts grid */}
            {(search ? filtered : filtered.slice(1)).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(search ? filtered : filtered.slice(1)).map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
