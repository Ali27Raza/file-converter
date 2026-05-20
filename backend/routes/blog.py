import os
import json
from flask import Blueprint, jsonify, abort

blog_bp = Blueprint("blog_bp", __name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "blog_posts")

def _load_post(slug):
    path = os.path.join(DATA_DIR, f"{slug}.json")
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def _list_posts():
    posts = []
    if not os.path.exists(DATA_DIR):
        return posts
    for fname in os.listdir(DATA_DIR):
        if not fname.endswith('.json'):
            continue
        with open(os.path.join(DATA_DIR, fname), 'r', encoding='utf-8') as f:
            try:
                post = json.load(f)
                # expose only summary fields for the index
                posts.append({
                    'title': post.get('title'),
                    'slug': post.get('slug'),
                    'description': post.get('description'),
                    'published_at': post.get('published_at'),
                })
            except Exception:
                continue
    # sort by published_at desc if available
    posts.sort(key=lambda p: p.get('published_at') or '', reverse=True)
    return posts


@blog_bp.route('/api/blog')
def blog_index():
    posts = _list_posts()
    return jsonify({'posts': posts})


@blog_bp.route('/api/blog/<slug>')
def blog_post(slug):
    post = _load_post(slug)
    if not post:
        abort(404)
    return jsonify(post)
