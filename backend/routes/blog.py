import os
import json
import re
import shutil
from datetime import date
from flask import Blueprint, jsonify, abort, request
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename

blog_bp = Blueprint("blog_bp", __name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "blog_posts")
IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "blog_images")

ALLOWED_IMAGE_EXTS = {"png", "jpg", "jpeg", "gif", "webp", "svg"}


def _slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return re.sub(r"^-+|-+$", "", text)


def _load_post(slug):
    path = os.path.join(DATA_DIR, f"{slug}.json")
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_post(slug, data):
    os.makedirs(DATA_DIR, exist_ok=True)
    path = os.path.join(DATA_DIR, f"{slug}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def _list_posts(include_drafts=False):
    posts = []
    if not os.path.exists(DATA_DIR):
        return posts
    for fname in os.listdir(DATA_DIR):
        if not fname.endswith(".json"):
            continue
        with open(os.path.join(DATA_DIR, fname), "r", encoding="utf-8") as f:
            try:
                post = json.load(f)
                if not include_drafts and post.get("status") == "draft":
                    continue
                posts.append({
                    "title": post.get("title"),
                    "slug": post.get("slug"),
                    "description": post.get("description"),
                    "published_at": post.get("published_at"),
                    "author": post.get("author"),
                    "tags": post.get("tags", []),
                    "thumbnail": post.get("thumbnail") or post.get("image") or "",
                    "image": post.get("image") or "",
                    "status": post.get("status", "published"),
                })
            except Exception:
                continue
    posts.sort(key=lambda p: p.get("published_at") or "", reverse=True)
    return posts


# ── Public endpoints ──────────────────────────────────────────────────────────

@blog_bp.route("/api/blog")
def blog_index():
    return jsonify({"posts": _list_posts(include_drafts=False)})


@blog_bp.route("/api/blog/<slug>")
def blog_post(slug):
    post = _load_post(slug)
    if not post or post.get("status") == "draft":
        abort(404)
    return jsonify(post)


# ── Admin endpoints (JWT protected) ──────────────────────────────────────────

@blog_bp.route("/api/admin/blog", methods=["GET"])
@jwt_required()
def admin_blog_list():
    return jsonify({"posts": _list_posts(include_drafts=True)})


@blog_bp.route("/api/admin/blog", methods=["POST"])
@jwt_required()
def admin_create_post():
    data = request.get_json(silent=True) or {}
    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400

    slug = data.get("slug") or _slugify(title)
    slug = _slugify(slug)

    # prevent duplicate slugs
    if _load_post(slug):
        slug = f"{slug}-{date.today().strftime('%Y%m%d')}"

    today = date.today().isoformat()
    post = {
        "slug": slug,
        "title": title,
        "meta_title": data.get("meta_title") or title,
        "description": data.get("description", ""),
        "meta_description": data.get("meta_description") or data.get("description", ""),
        "keywords": data.get("keywords", []),
        "tags": data.get("tags", []),
        "author": data.get("author", "FileForge Team"),
        "status": data.get("status", "published"),
        "published_at": data.get("published_at") or today,
        "updated_at": today,
        "thumbnail": data.get("thumbnail", ""),
        "image": data.get("image", ""),
        "og_title": data.get("og_title") or data.get("meta_title") or title,
        "og_description": data.get("og_description") or data.get("description", ""),
        "og_image": data.get("og_image") or data.get("image", ""),
        "canonical_url": data.get("canonical_url", ""),
        "content": data.get("content", ""),
    }
    _save_post(slug, post)
    return jsonify(post), 201


@blog_bp.route("/api/admin/blog/<slug>", methods=["GET"])
@jwt_required()
def admin_get_post(slug):
    post = _load_post(slug)
    if not post:
        abort(404)
    return jsonify(post)


@blog_bp.route("/api/admin/blog/<slug>", methods=["PUT"])
@jwt_required()
def admin_update_post(slug):
    existing = _load_post(slug)
    if not existing:
        abort(404)
    data = request.get_json(silent=True) or {}

    new_slug = _slugify(data.get("slug") or slug)
    today = date.today().isoformat()

    updated = {
        "slug": new_slug,
        "title": data.get("title", existing["title"]),
        "meta_title": data.get("meta_title") or data.get("title") or existing.get("meta_title"),
        "description": data.get("description", existing.get("description", "")),
        "meta_description": data.get("meta_description") or data.get("description") or existing.get("meta_description", ""),
        "keywords": data.get("keywords", existing.get("keywords", [])),
        "tags": data.get("tags", existing.get("tags", [])),
        "author": data.get("author", existing.get("author", "FileForge Team")),
        "status": data.get("status", existing.get("status", "published")),
        "published_at": existing.get("published_at"),
        "updated_at": today,
        "thumbnail": data.get("thumbnail", existing.get("thumbnail", "")),
        "image": data.get("image", existing.get("image", "")),
        "og_title": data.get("og_title") or data.get("meta_title") or data.get("title") or existing.get("og_title", ""),
        "og_description": data.get("og_description") or data.get("description") or existing.get("og_description", ""),
        "og_image": data.get("og_image") or data.get("image") or existing.get("og_image", ""),
        "canonical_url": data.get("canonical_url", existing.get("canonical_url", "")),
        "content": data.get("content", existing.get("content", "")),
    }

    # rename file if slug changed
    if new_slug != slug:
        old_path = os.path.join(DATA_DIR, f"{slug}.json")
        if os.path.exists(old_path):
            os.remove(old_path)

    _save_post(new_slug, updated)
    return jsonify(updated)


@blog_bp.route("/api/admin/blog/<slug>", methods=["DELETE"])
@jwt_required()
def admin_delete_post(slug):
    path = os.path.join(DATA_DIR, f"{slug}.json")
    if not os.path.exists(path):
        abort(404)
    os.remove(path)
    return jsonify({"message": "Post deleted"})


@blog_bp.route("/api/admin/blog/upload-image", methods=["POST"])
@jwt_required()
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No image file"}), 400
    file = request.files["image"]
    if not file.filename:
        return jsonify({"error": "Empty filename"}), 400

    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_IMAGE_EXTS:
        return jsonify({"error": "Invalid file type"}), 400

    os.makedirs(IMAGES_DIR, exist_ok=True)
    filename = secure_filename(file.filename)
    save_path = os.path.join(IMAGES_DIR, filename)
    file.save(save_path)
    return jsonify({"url": f"/blog-images/{filename}"})
