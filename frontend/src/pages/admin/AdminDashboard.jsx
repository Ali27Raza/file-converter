import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { FiFileText, FiPlusCircle, FiEye, FiTrendingUp, FiCheckCircle, FiEdit3 } from "react-icons/fi";
import axios from "axios";

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div
      className="rounded-2xl p-6 flex items-start gap-4"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: accent ? "rgba(232,255,71,0.12)" : "rgba(255,255,255,0.05)" }}
      >
        <Icon size={18} style={{ color: accent ? "var(--accent)" : "var(--muted)" }} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-[var(--text)]">{value}</p>
        <p className="text-xs text-[var(--muted)] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { authHeader } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/admin/blog", { headers: authHeader })
      .then((r) => setPosts(r.data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const published = posts.filter((p) => p.status !== "draft").length;
  const drafts = posts.filter((p) => p.status === "draft").length;
  const recent = [...posts].slice(0, 5);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">Dashboard</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Manage your FileForge blog content</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "var(--accent)", color: "#0a0a0f" }}
        >
          <FiPlusCircle size={15} />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiFileText} label="Total Posts" value={posts.length} accent />
        <StatCard icon={FiCheckCircle} label="Published" value={published} />
        <StatCard icon={FiEdit3} label="Drafts" value={drafts} />
        <StatCard icon={FiTrendingUp} label="This Month" value={
          posts.filter((p) => {
            const d = p.published_at;
            if (!d) return false;
            const now = new Date();
            const pub = new Date(d);
            return pub.getMonth() === now.getMonth() && pub.getFullYear() === now.getFullYear();
          }).length
        } />
      </div>

      {/* Recent posts */}
      <div
        className="rounded-2xl"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-bold text-[var(--text)]">Recent Posts</h2>
          <Link
            to="/admin/blog"
            className="text-xs text-[var(--accent)] hover:underline"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-center text-[var(--muted)] text-sm">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FiFileText size={32} className="mx-auto mb-3 text-[var(--muted)]" />
            <p className="text-[var(--muted)] text-sm">No posts yet.</p>
            <Link
              to="/admin/blog/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "var(--accent)", color: "#0a0a0f" }}
            >
              <FiPlusCircle size={14} />
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {recent.map((p) => (
              <div key={p.slug} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)] truncate">{p.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{p.published_at}</p>
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                  style={
                    p.status === "draft"
                      ? { background: "rgba(251,191,36,0.12)", color: "#fbbf24" }
                      : { background: "rgba(34,197,94,0.12)", color: "#22c55e" }
                  }
                >
                  {p.status === "draft" ? "Draft" : "Published"}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/blog/${p.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                    title="View post"
                  >
                    <FiEye size={14} />
                  </Link>
                  <Link
                    to={`/admin/blog/edit/${p.slug}`}
                    className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                    title="Edit post"
                  >
                    <FiEdit3 size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
