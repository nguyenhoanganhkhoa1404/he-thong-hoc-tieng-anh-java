// app/listening/page.tsx — Nhóm 3: Listening exercises with audio player UI
"use client";
import { useState, useEffect } from "react";
import { mockListening } from "@/data/mockData";
import Button from "@/components/ui/Button";

export default function ListeningPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if ((window as any).progressTimer) clearInterval((window as any).progressTimer);
    };
  }, []);

  useEffect(() => {
    fetch("/api/v1/skills/lessons?skill=LISTENING")
      .then(r => r.json())
      .then(data => {
        if (!data || data.length === 0) {
          setLessons(mockListening);
          return;
        }
        const mapped = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          level: d.level,
          duration: 150, // default dummy duration
          transcript: d.content,
          questions: [
            { id: d.id + "q1", question: d.instructions || "What is the main idea?", options: ["Understanding", "Memory", "Focus"], correctAnswer: 0 }
          ]
        }));
        setLessons(mapped);
      })
      .catch(() => setLessons(mockListening))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Nhóm 3 — Listening</p>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Listening <span className="gradient-text">Lab</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">Luyện kỹ năng nghe với các bài hội thoại thực tế ở mọi cấp độ.</p>
        </div>

        {loading ? (
          <div className="text-center text-violet-400 py-12 animate-pulse">Loading listening lab...</div>
        ) : !selected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {lessons.map(ex => (
              <div key={ex.id} onClick={() => setSelected(ex)}
                className="glass border border-white/10 rounded-2xl p-6 card-hover cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center text-2xl">🎧</div>
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 mb-1 inline-block">Level {ex.level}</span>
                    <h3 className="font-bold text-white">{ex.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>⏱️ {Math.floor(ex.duration / 60)}:{String(ex.duration % 60).padStart(2, '0')}</span>
                  <span>❓ {ex.questions.length} questions</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => { setSelected(null); setPlaying(false); setProgress(0); setAnswers({}); }}
              className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-2">← Back</button>

            {/* Audio Player */}
            <div className="glass border border-cyan-500/20 rounded-3xl p-8 mb-6 bg-gradient-to-br from-cyan-900/10 to-violet-900/10">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🎧</div>
                <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                <p className="text-slate-400 text-sm">Level {selected.level}</p>
              </div>

              {/* Waveform visualization */}
              <div className="flex items-center justify-center gap-0.5 h-12 mb-4">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div key={i}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      i < progress * 50 / 100 ? "bg-cyan-400" : "bg-slate-700"
                    }`}
                    style={{ height: `${Math.sin(i * 0.4) * 30 + 50}%`, animationDelay: `${i * 0.05}s` }}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-slate-400">0:00</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setProgress(((e.clientX - rect.left) / rect.width) * 100);
                  }}>
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full relative"
                    style={{ width: `${progress}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
                  </div>
                </div>
                <span className="text-xs text-slate-400">{Math.floor(selected.duration / 60)}:{String(selected.duration % 60).padStart(2, '0')}</span>
              </div>

              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => {
                    if (typeof window === "undefined" || !window.speechSynthesis) return;
                    
                    if (playing) {
                      window.speechSynthesis.pause();
                      setPlaying(false);
                      clearInterval((window as any).progressTimer);
                    } else {
                      if (window.speechSynthesis.paused && progress > 0 && progress < 100) {
                        window.speechSynthesis.resume();
                        setPlaying(true);
                      } else {
                        window.speechSynthesis.cancel();
                        setProgress(0);
                        const ut = new SpeechSynthesisUtterance(selected.transcript);
                        ut.lang = "en-US";
                        ut.rate = 0.85; // slightly slower for learners
                        
                        const words = selected.transcript.split(" ").length;
                        const estSeconds = Math.max(words * (60 / 140), 3); // ~140 wpm
                        
                        ut.onstart = () => {
                          setPlaying(true);
                          let p = 0;
                          const interval = 100;
                          const step = 100 / (estSeconds * 1000 / interval);
                          (window as any).progressTimer = setInterval(() => {
                            p += step;
                            if (p >= 100) { p = 100; clearInterval((window as any).progressTimer); }
                            setProgress(Math.min(p, 100));
                          }, interval);
                        };
                        
                        ut.onend = () => {
                          setPlaying(false);
                          setProgress(100);
                          clearInterval((window as any).progressTimer);
                        };
                        
                        window.speechSynthesis.speak(ut);
                      }
                    }
                  }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center text-3xl glow-cyan hover:scale-105 transition-all text-white shadow-xl">
                  {playing ? "⏸" : "▶"}
                </button>
              </div>
            </div>

            {/* Transcript (Hidden by default) */}
            <div className="mb-6 flex flex-col items-center">
              <Button variant="ghost" size="sm" onClick={() => setShowTranscript(!showTranscript)}>
                {showTranscript ? "🙈 Hide Transcript" : "👀 Show Transcript"}
              </Button>
              {showTranscript && (
                <div className="glass border border-white/10 rounded-2xl p-5 mt-4 w-full">
                  <h3 className="text-sm font-bold text-white mb-3">📄 Transcript</h3>
                  <p className="text-slate-400 text-sm leading-relaxed italic">{selected.transcript}</p>
                </div>
              )}
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-violet-300">❓ Comprehension Questions</h3>
              {selected.questions.map((q: any, qi: number) => (
                <div key={q.id} className="glass border border-white/10 rounded-2xl p-5">
                  <p className="text-white font-semibold text-sm mb-3">{qi + 1}. {q.question}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt: string, oi: number) => {
                      const answered = answers[q.id] !== undefined;
                      const isSelected = answers[q.id] === oi;
                      const isCorrect = oi === q.correctAnswer;
                      let cls = "border-white/10 text-slate-300 hover:border-cyan-500/50 hover:text-white";
                      if (answered) {
                        if (isCorrect) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                        else if (isSelected) cls = "border-red-500 bg-red-500/10 text-red-300";
                      }
                      return (
                        <button key={oi} disabled={answered}
                          onClick={() => setAnswers(prev => ({...prev, [q.id]: oi}))}
                          className={`p-3 rounded-xl border text-xs text-left transition-all ${cls}`}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
