import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AdminLayout } from "../../components/admin/AdminLayout";
import {
  FiPlusCircle, FiEdit3, FiTrash2, FiEye, FiSearch,
  FiFileText, FiFilter,
} from "react-icons/fi";
import axios from "axios";

export function AdminBlogList() {
  const { authHeader } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteSlug, setDeleteSlug] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    axios
      .get("/api/admin/blog", { headers: authHeader })
      .then((r) => setPosts(r.data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteSlug) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/blog/${deleteSlug}`, { headers: authHeader });
      setPosts((prev) => prev.filter((p) => p.slug !== deleteSlug));
    } catch {
      alert("Failed to delete post");
    } finally {
      setDeleting(false);
      setDeleteSlug(null);
    }
  };

  const filtered = posts
    .filter((p) => filter === "all" || p.status === filter)
    .filter((p) =>
      !search || p.title?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">Blog Posts</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{posts.length} total posts</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all w-fit"
          style={{ background: "var(--accent)", color: "#0a0a0f" }}
        >
          <FiPlusCircle size={15} />
          New Post
        </Link>
      </div>

      {/* Filters & search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter size={14} className="text-[var(--muted)]" />
          {["all", "published", "draft"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all"
              style={
                filter === f
                  ? { background: "rgba(232,255,71,0.12)", color: "var(--accent)" }
                  : { background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {loading ? (
          <div className="py-16 text-center text-[var(--muted)] text-sm">Loading posts…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <FiFileText size={32} className="mx-auto mb-3 text-[var(--muted)]" />
            <p className="text-[var(--muted)] text-sm">
              {search ? "No posts match your search." : "No posts yet."}
            </p>
            {!search && (
              <Link
                to="/admin/blog/new"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "var(--accent)", color: "#0a0a0f" }}
              >
                <FiPlusCircle size={14} /> Create first post
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div
              className="hidden md:grid px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--border)]"
              style={{ gridTemplateColumns: "1fr 120px 120px 100px" }}
            >
              <span>Title</span>
              <span>Published</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {filtered.map((p) => (
                <div
                  key={p.slug}
                  className="flex flex-col md:grid gap-2 md:gap-0 px-6 py-4 hover:bg-white/[0.02] transition-colors"
                  style={{ gridTemplateColumns: "1fr 120px 120px 100px" }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text)] truncate">{p.title}</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5 truncate">/blog/{p.slug}</p>
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {p.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(232,255,71,0.08)", color: "var(--accent)" }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex md:block items-center gap-2">
                    <span className="text-xs text-[var(--muted)] md:pt-1">{p.published_at || "—"}</span>
                  </div>
                  <div className="flex md:block items-center gap-2">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={
                        p.status === "draft"
                          ? { background: "rgba(251,191,36,0.12)", color: "#fbbf24" }
                          : { background: "rgba(34,197,94,0.12)", color: "#22c55e" }
                      }
                    >
                      {p.status === "draft" ? "Draft" : "Published"}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    {p.status !== "draft" && (
                      <Link
                        to={`/blog/${p.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5 transition-all"
                        title="View"
                      >
                        <FiEye size={14} />
                      </Link>
                    )}
                    <Link
                      to={`/admin/blog/edit/${p.slug}`}
                      className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-white/5 transition-all"
                      title="Edit"
                    >
                      <FiEdit3 size={14} />
                    </Link>
                    <button
                      onClick={() => setDeleteSlug(p.slug)}
                      className="p-2 rounded-lg text-[var(--muted)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70">
          <div
            className="rounded-2xl p-7 w-full max-w-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h3 className="text-lg font-bold text-[var(--text)] mb-2">Delete Post</h3>
            <p className="text-sm text-[var(--muted)] mb-6">
              Are you sure you want to delete <strong className="text-[var(--text)]">{deleteSlug}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteSlug(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
