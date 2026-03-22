// app/writing/page.tsx — Nhóm 4: Writing exercises with editor
"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

const prompts = [
  { id: "w1", title: "Write About Your Hometown", type: "paragraph", level: "A2", wordLimit: { min: 80, max: 120 }, prompt: "Write a short paragraph describing your hometown. Include: location, size, what it's famous for, and why you like it." },
  { id: "w2", title: "Advantages of Learning English", type: "essay", level: "B1", wordLimit: { min: 150, max: 200 }, prompt: "Write an essay discussing the advantages of learning English in today's world. Support your points with examples." },
  { id: "w3", title: "IELTS Task 2: Technology & Society", type: "essay", level: "C1", wordLimit: { min: 250, max: 300 }, prompt: "Some people believe technology has made society more impersonal. To what extent do you agree or disagree? Give reasons and examples." },
];

export default function WritingPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/v1/skills/lessons?skill=WRITING")
      .then(r => r.json())
      .then(data => {
        if (!data || data.length === 0) {
          setExercises(prompts);
          return;
        }
        const mapped = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          type: d.level === "A1" || d.level === "A2" ? "paragraph" : "essay",
          level: d.level,
          wordLimit: { min: 100, max: 250 },
          prompt: d.content || d.instructions || "Write your essay based on the topic."
        }));
        setExercises(mapped);
      })
      .catch(() => setExercises(prompts))
      .finally(() => setLoading(false));
  }, []);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  if (selected) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => { setSelected(null); setText(""); setSubmitted(false); }}
            className="text-slate-400 hover:text-white text-sm mb-6">← Back to Writing</button>

          <div className="glass border border-white/10 rounded-3xl p-6 mb-4">
            <span className="text-xs px-2 py-1 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 uppercase mb-3 inline-block">{selected.type}</span>
            <h2 className="text-xl font-bold text-white mb-3">{selected.title}</h2>
            <div className="glass border border-violet-500/20 rounded-2xl p-4 text-slate-300 text-sm leading-relaxed">
              {selected.prompt}
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Required: {selected.wordLimit.min}–{selected.wordLimit.max} words · Level {selected.level}
            </div>
          </div>

          {!submitted ? (
            <div className="glass border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">✍️ Your Response</h3>
                <span className={`text-xs font-medium ${
                  wordCount < selected.wordLimit.min ? "text-slate-400" :
                  wordCount <= selected.wordLimit.max ? "text-emerald-400" : "text-red-400"
                }`}>{wordCount} / {selected.wordLimit.max} words</span>
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Start writing here..."
                rows={12}
                className="input-glow w-full bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 rounded-xl p-4 text-sm font-mono leading-relaxed resize-none"
              />
              <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="progress-neon h-full rounded-full transition-all"
                  style={{ width: `${Math.min((wordCount / selected.wordLimit.max) * 100, 100)}%` }} />
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="ghost" onClick={() => setText("")}>🗑️ Clear</Button>
                <Button variant="neon" className="ml-auto"
                  onClick={() => wordCount >= selected.wordLimit.min && setSubmitted(true)}
                  disabled={wordCount < selected.wordLimit.min}>
                  📤 Submit
                </Button>
              </div>
            </div>
          ) : (
            <div className="glass border border-emerald-500/30 rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-white mb-2">Submitted!</h3>
              <p className="text-slate-400 text-sm mb-6">Your writing has been submitted for review. A teacher will grade it soon.</p>
              <div className="glass border border-white/10 rounded-2xl p-4 text-left mb-6">
                <p className="text-xs text-slate-400 mb-2">{wordCount} words</p>
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-6">{text}</p>
              </div>
              <Button variant="ghost" onClick={() => { setSubmitted(false); setText(""); }}>✍️ Write Another</Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Nhóm 4 — Writing</p>
          <h1 className="text-4xl font-extrabold text-white mb-4">Writing <span className="gradient-text">Workshop</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto">Luyện kỹ năng viết từ đoạn văn đến bài luận IELTS. Nộp bài và nhận phản hồi từ giáo viên.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-3 text-center text-violet-400 py-12 animate-pulse">Loading writing workshop...</div>
          ) : exercises.map(p => (
            <div key={p.id} onClick={() => setSelected(p)}
              className="glass border border-white/10 rounded-2xl p-6 card-hover cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">✍️</span>
                <div className="text-right">
                  <span className="text-xs px-2 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 inline-block mb-1">{p.level}</span>
                  <p className="text-xs text-slate-500 capitalize">{p.type}</p>
                </div>
              </div>
              <h3 className="font-bold text-white text-sm mb-2">{p.title}</h3>
              <p className="text-slate-400 text-xs mb-4 line-clamp-3">{p.prompt}</p>
              <p className="text-xs text-slate-500">{p.wordLimit.min}–{p.wordLimit.max} words</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
