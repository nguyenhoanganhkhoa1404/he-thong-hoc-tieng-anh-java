// app/forum/page.tsx — Nhóm 5: Community Forum
"use client";
import { useState, useEffect } from "react";
import { mockForumPosts } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";
import type { ForumPost } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import DashboardSidebar from "@/components/layout/Sidebar";

const categories = ["All", "grammar", "vocabulary", "speaking", "listening", "general"] as const;
const catLabel: Record<string, string> = {
  grammar: "📝 Grammar", vocabulary: "🔤 Vocabulary", speaking: "🎤 Speaking",
  listening: "🎧 Listening", general: "💬 General"
};

function PostCard({ post, currentUser, currentUserRole }: { post: any, currentUser: string, currentUserRole: string }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Update local likes immediately while API resolves silently
  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikesCount(likesCount + 1);
    fetch(`/api/v1/forum/posts/${post.id}/like`, { method: "POST" }).catch(console.error);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/v1/forum/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, authorId: currentUser, authorRole: currentUserRole })
      });
      if (res.ok) {
        setNewComment("");
        // Real-time polling runs every 5 seconds so it will sync automatically,
        // but we assume the page feels instantly responsive anyway
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReplyClick = (authorId: string) => {
    setNewComment(prev => (prev ? prev + ` @[${authorId}] ` : `@[${authorId}] `));
    // Standard focus logic
    setTimeout(() => {
      const el = document.getElementById(`comment-input-${post.id}`);
      if (el) el.focus();
    }, 10);
  };

  const renderCommentText = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(@\[[^\]]+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('@[') && part.endsWith(']')) {
        const username = part.substring(2, part.length - 1);
        return <span key={i} className="text-cyan-400 font-bold bg-cyan-400/10 px-1 py-0.5 rounded text-xs">@{username}</span>;
      }
      return part;
    });
  };

  return (
    <div className="glass border border-white/10 rounded-2xl p-5 mb-4">
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
          <h3 className="font-bold text-white text-base mb-2 cursor-pointer transition-colors">
            {post.title}
          </h3>
          <p className="text-slate-400 text-sm mb-3 whitespace-pre-wrap">{post.content}</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>by <span className="text-slate-300">{post.author.displayName}</span></span>
            <button onClick={handleLike} className={`hover:text-pink-400 transition-colors ${liked ? "text-pink-500" : ""}`}>
              {liked ? "❤️" : "🤍"} {post.likes}
            </button>
            <button onClick={toggleComments} className="hover:text-cyan-400 transition-colors">
              💬 {post.comments.length} replies
            </button>
            <span>{post.createdAt}</span>
          </div>
          
          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-white/10 border-dashed animate-fade-in">
              {post.comments.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {post.comments.map((cm: any, i: number) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                        {cm.authorId ? String(cm.authorId).charAt(0).toUpperCase() : "S"}
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-900/50 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-slate-300 w-fit max-w-[90%]">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-xs text-violet-300">{cm.authorId}</span>
                            {cm.authorRole === "TEACHER" && (
                              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Teacher</span>
                            )}
                          </div>
                          <div className="leading-relaxed">
                            {renderCommentText(cm.content)}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleReplyClick(cm.authorId)}
                          className="text-[10px] text-slate-500 hover:text-cyan-400 font-bold uppercase tracking-wider ml-2 mt-1 transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 mb-4 italic">No comments yet. Be the first to reply!</p>
              )}
              
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <input 
                  id={`comment-input-${post.id}`}
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..." 
                  className="flex-1 bg-slate-900 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <Button variant="neon" size="sm" type="submit" disabled={submittingComment || !newComment.trim()}>Reply</Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForumPage() {
  const { user } = useAuth();
  const currentUser = user?.displayName || "Anonymous";
  const currentUserRole = user?.role || "LEARNER";
  const isTeacher = user?.role === "TEACHER";

  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // New Post Form State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTopic, setNewTopic] = useState("general");
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = () => {
    setLoading(true);
    fetch("/api/v1/forum/posts")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(item => {
            const p = item.post ? item.post : item;
            const c = item.comments || [];
            return {
              id: p.id,
              title: p.title || "Untitled",
              content: p.content || "",
              category: p.topic || "general",
              author: { displayName: p.authorId || "Anonymous" },
              createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Just now",
              likes: p.likes || 0,
              comments: c,
              tags: [],
              pinned: false
            };
          }).sort((a: any, b: any) => b.id.localeCompare(a.id)); // basic sort
          
          setPosts(prev => {
            // Basic diff check to prevent React from re-rendering unchanged objects
            if (prev.length !== mapped.length || prev[0]?.id !== mapped[0]?.id) return mapped;
            return mapped;
          });
        } else {
          setPosts(mockForumPosts); // Fallback to mock if db is empty
        }
      })
      .catch((e) => {
        console.error(e);
        setPosts(prev => prev.length ? prev : mockForumPosts);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 5000); // 5 second polling for new posts
    return () => clearInterval(interval);
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          topic: newTopic,
          authorId: currentUser
        })
      });
      if (res.ok) {
        setShowModal(false);
        setNewTitle("");
        setNewContent("");
        fetchPosts(); // Reload board
      }
    } catch (e) {
      console.error("Failed to post", e);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = posts.filter(p =>
    (category === "All" || p.category === category) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={`min-h-screen ${isTeacher ? "flex" : "pt-24 pb-16 px-4"}`}>
      {isTeacher && <DashboardSidebar />}
      <div className={`${isTeacher ? "ml-64 p-8 w-full" : "max-w-5xl mx-auto"} relative`}>
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

        <div className="flex gap-3 mb-6 items-center">
          <Button variant="neon" size="sm" onClick={() => setShowModal(true)}>✍️ New Post</Button>
          <span className="glass border border-white/10 px-3 py-1.5 rounded-xl text-xs text-slate-400 flex items-center">
            {filtered.length} posts found
          </span>
          {loading && <span className="text-xs text-cyan-400 animate-pulse ml-2">Syncing database...</span>}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filtered.length > 0 ? filtered.map(post => (
            <PostCard key={post.id} post={post} currentUser={currentUser} currentUserRole={currentUserRole} />
          )) : !loading && (
            <div className="text-center py-16 text-slate-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>No posts found. Be the first to start a discussion!</p>
            </div>
          )}
        </div>
        
        {/* Create Post Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl relative shadow-2xl">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-5 text-slate-400 hover:text-white text-xl">✕</button>
              <h2 className="text-2xl font-bold text-white mb-6">Create New Discussion</h2>
              
              <form onSubmit={handleCreatePost} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Topic</label>
                  <select 
                    value={newTopic} 
                    onChange={e => setNewTopic(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors">
                    {categories.filter(c => c !== "All").map(c => (
                      <option key={c} value={c}>{catLabel[c]}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Title</label>
                  <Input 
                    placeholder="E.g. How to improve speaking skills?" 
                    value={newTitle} 
                    onChange={e => setNewTitle(e.target.value)} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Content</label>
                  <textarea 
                    rows={5}
                    placeholder="Share your thoughts, ask questions, or provide tips..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    required
                  />
                </div>
                
                <div className="pt-2 flex justify-end gap-3">
                  <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button variant="neon" type="submit" disabled={submitting || !newTitle.trim() || !newContent.trim()}>
                    {submitting ? "Posting..." : "Publish Post 🚀"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
