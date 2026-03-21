// app/forum/page.tsx — Nhóm 5: Community Forum
"use client";
import { useState } from "react";
import { mockForumPosts } from "@/data/mockData";
import type { ForumPost } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const categories = ["All", "grammar", "vocabulary", "speaking", "listening", "general"] as const;
const catLabel: Record<string, string> = {
  grammar: "📝 Grammar", vocabulary: "🔤 Vocabulary", speaking: "🎤 Speaking",
  listening: "🎧 Listening", general: "💬 General"
};

function PostCard({ post }: { post: ForumPost }) {
  return (
    <div className="glass border border-white/10 rounded-2xl p-5 card-hover">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
          {post.author.displayName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            {post.pinned && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400">📌 Pinned</span>}
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300">
              {catLabel[post.category] || post.category}
            </span>
          </div>
          <h3 className="font-bold text-white text-base mb-2 hover:text-violet-300 cursor-pointer transition-colors">
            {post.title}
          </h3>
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">{post.content}</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>by <span className="text-slate-300">{post.author.displayName}</span></span>
            <span>❤️ {post.likes}</span>
            <span>💬 {post.comments.length} replies</span>
            <span>{post.createdAt}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-lg bg-slate-700 text-slate-400">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForumPage() {
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = mockForumPosts.filter(p =>
    (category === "All" || p.category === category) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Nhóm 5 — Forum</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Community <span className="gradient-text">Galaxy</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">Đặt câu hỏi, chia sẻ kinh nghiệm, và học hỏi cùng cộng đồng.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${category === c ? "bg-violet-600/30 border-violet-500 text-violet-200" : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"}`}>
                {c === "All" ? "All Topics" : catLabel[c]}
              </button>
            ))}
          </div>
          <div className="md:ml-auto">
            <Input placeholder="Search posts..." icon="🔍" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Button variant="neon" size="sm">✍️ New Post</Button>
          <span className="glass border border-white/10 px-3 py-1.5 rounded-xl text-xs text-slate-400 flex items-center">
            {filtered.length} posts found
          </span>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filtered.length > 0 ? filtered.map(post => (
            <PostCard key={post.id} post={post} />
          )) : (
            <div className="text-center py-16 text-slate-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>No posts found. Be the first to post!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
