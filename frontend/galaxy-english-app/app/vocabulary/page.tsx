// app/vocabulary/page.tsx — Nhóm 2: Vocabulary page connected to real Spring Boot API
"use client";
import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// Shape returned by GET /api/v1/vocab/items
interface ApiVocabItem {
  id: string;
  word: string;
  translation: string;   // Vietnamese meaning from DB
  example: string;
  topic: string;
  level: string;
  learned: boolean;
}

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type Level = typeof levels[number];

const levelColors: Record<Level, string> = {
  A1: "from-emerald-600/20 to-emerald-800/10 border-emerald-500/30 text-emerald-400",
  A2: "from-teal-600/20 to-teal-800/10 border-teal-500/30 text-teal-400",
  B1: "from-yellow-600/20 to-yellow-800/10 border-yellow-500/30 text-yellow-400",
  B2: "from-orange-600/20 to-orange-800/10 border-orange-500/30 text-orange-400",
  C1: "from-red-600/20 to-red-800/10 border-red-500/30 text-red-400",
  C2: "from-pink-600/20 to-pink-800/10 border-pink-500/30 text-pink-400",
};

function FlashCard({ word, isFlipped, onFlip }: { word: ApiVocabItem; isFlipped: boolean; onFlip: () => void }) {
  const lvl = word.level as Level;

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utter = new SpeechSynthesisUtterance(word.word);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="cursor-pointer relative group w-full h-full min-h-[180px]" onClick={onFlip} style={{ perspective: "1000px" }}>
      <div className="relative w-full h-full transition-all duration-500" style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
        {/* Front */}
        <div className="absolute inset-0 glass border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: "hidden" }}>
          <button 
            onClick={playAudio} 
            className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/20 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
            title="Pronounce"
          >
            🔊
          </button>
          <p className="text-2xl font-extrabold text-white mb-1">{word.word}</p>
          {word.topic && <p className="text-slate-500 text-xs mb-2 uppercase tracking-wider">{word.topic}</p>}
          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border bg-gradient-to-r ${levelColors[lvl] ?? "border-violet-500/30 text-violet-400"}`}>{word.level}</span>
          <p className="text-xs text-slate-500 mt-4">Click to flip</p>
        </div>
        {/* Back */}
        <div className="absolute inset-0 glass border border-violet-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <p className="text-xl font-bold text-violet-300 mb-3">{word.translation}</p>
          {word.example && <p className="text-slate-400 text-xs italic">"{word.example}"</p>}
          {word.learned && <span className="mt-3 text-xs text-emerald-400">✓ Learned</span>}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="glass border border-white/10 rounded-2xl p-6 h-44 animate-pulse">
          <div className="h-6 w-3/4 bg-slate-700 rounded-lg mx-auto mb-3" />
          <div className="h-3 w-1/2 bg-slate-800 rounded mx-auto mb-4" />
          <div className="h-5 w-12 bg-slate-700 rounded-lg mx-auto" />
        </div>
      ))}
    </div>
  );
}

export default function VocabularyPage() {
  const [selectedLevel, setSelectedLevel] = useState<Level | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [studyMode, setStudyMode] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [words, setWords] = useState<ApiVocabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [userLevel, setUserLevel] = useState<string>("A1");
  const [userStreak, setUserStreak] = useState<number>(0);
  const PAGE_SIZE = 48;

  const fetchWords = useCallback(async (lvl: Level | "ALL") => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (lvl !== "ALL") params.append("level", lvl);
      const res = await fetch(`/api/v1/vocab/items?${params.toString()}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: ApiVocabItem[] = await res.json();
      setWords(data);
      setPage(0);
      setStudyIndex(0);
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Unknown error";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWords(selectedLevel); }, [selectedLevel, fetchWords]);

  const filtered = words.filter(v =>
    v.word.toLowerCase().includes(search.toLowerCase()) ||
    (v.translation ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (v.topic ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(0, (page + 1) * PAGE_SIZE);

  const toggleFlip = useCallback((id: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!studyMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setStudyIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowLeft") {
        setStudyIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === " ") {
        e.preventDefault();
        const wordId = filtered[studyIndex]?.id;
        if (wordId) toggleFlip(wordId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [studyMode, studyIndex, filtered, toggleFlip]);

  const [levelChangeMsg, setLevelChangeMsg] = useState<string | null>(null);

  const report = async (correct: boolean) => {
    try {
      const res = await fetch("/api/v1/vocab/report-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correct })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.levelChanged) {
          const msg = data.newStreak >= 0 ? 
            `🚀 PROMOTED TO ${data.newLevel}!` : 
            `📚 ADAPTED TO ${data.newLevel}`;
          setLevelChangeMsg(msg);
          setTimeout(() => setLevelChangeMsg(null), 5000);
        }
        setUserLevel(data.newLevel);
        setUserStreak(data.newStreak);
      }
      setStudyIndex(p => Math.min(filtered.length-1, p+1));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Animated Level Change Notification */}
        {levelChangeMsg && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
             <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-1 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                <div className="bg-black/80 backdrop-blur-xl px-8 py-4 rounded-xl text-white font-black text-xl tracking-tighter flex items-center gap-4">
                   <span className="text-3xl animate-bounce">✨</span>
                   {levelChangeMsg}
                   <span className="text-3xl animate-bounce" style={{ animationDelay: '200ms' }}>✨</span>
                </div>
             </div>
          </div>
        )}
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Nhóm 2 — Vocabulary</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Word <span className="gradient-text">Galaxy</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">Khám phá từ vựng tiếng Anh theo chuẩn CEFR. Click vào thẻ để xem nghĩa.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex gap-2 flex-wrap items-center">
            <Button variant="neon" onClick={() => { setStudyMode(!studyMode); setStudyIndex(0); }}>
              {studyMode ? "🔙 Exit Study Mode" : "🎓 Enter Study Mode"}
            </Button>
            
            <button onClick={() => setSelectedLevel("ALL")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${selectedLevel === "ALL" ? "bg-violet-600/30 border-violet-500 text-violet-200" : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"}`}>
              All Levels
            </button>
            {levels.map(l => (
              <button key={l} onClick={() => setSelectedLevel(l)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${selectedLevel === l ? `bg-gradient-to-r ${levelColors[l]} border-opacity-50` : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="md:ml-auto w-full md:w-64">
            <Input placeholder="Search words..." icon="🔍" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="glass border border-white/10 rounded-xl px-4 py-2 text-sm">
            <span className="text-slate-400">Showing </span>
            <span className="text-violet-300 font-bold">{loading ? "..." : paginated.length}</span>
            <span className="text-slate-400"> / </span>
            <span className="text-violet-300 font-bold">{loading ? "..." : filtered.length}</span>
            <span className="text-slate-400"> words</span>
          </div>
          {selectedLevel !== "ALL" && !loading && (
            <div className="glass border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-400">
              Level: <span className="text-cyan-300 font-bold">{selectedLevel}</span>
            </div>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="glass border border-red-500/30 rounded-2xl p-6 text-center mb-6">
            <p className="text-red-400 text-sm mb-3">⚠️ Could not load words: {error}</p>
            <Button variant="ghost" size="sm" onClick={() => fetchWords(selectedLevel)}>🔄 Try Again</Button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <LoadingSkeleton />}

        {/* Vocabulary Grid */}
        {!loading && !error && (
          filtered.length > 0 ? (
            studyMode ? (
              <div className="flex flex-col items-center justify-center py-10 w-full">
                 <div className="flex items-center gap-8 mb-8">
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Level</p>
                       <p className="text-2xl font-black text-white">{userLevel}</p>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Performance Streak</p>
                       <p className={`text-2xl font-black ${userStreak >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {userStreak > 0 ? `+${userStreak}` : userStreak}
                       </p>
                    </div>
                 </div>

                 <div className="w-full max-w-xl aspect-video md:h-[350px]">
                   <FlashCard 
                     word={filtered[studyIndex]} 
                     isFlipped={flippedCards.has(filtered[studyIndex].id)} 
                     onFlip={() => toggleFlip(filtered[studyIndex].id)} 
                   />
                 </div>

                 <div className="flex flex-col items-center gap-6 mt-10">
                    <div className="flex gap-4">
                       <button 
                          onClick={() => report(false)}
                          className="px-8 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold hover:bg-red-500/20 transition-all"
                       >
                          I don't know this ❌
                       </button>
                       <button 
                          onClick={() => report(true)}
                          className="px-8 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold hover:bg-emerald-500/20 transition-all"
                       >
                          Mastered it! ✅
                       </button>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                      <Button variant="ghost" onClick={() => setStudyIndex(p => Math.max(0, p-1))} disabled={studyIndex === 0}>← Prev</Button>
                      <span className="text-slate-400 font-medium">{studyIndex + 1} / {filtered.length}</span>
                      <Button variant="ghost" onClick={() => setStudyIndex(p => Math.min(filtered.length-1, p+1))} disabled={studyIndex === filtered.length - 1}>Next →</Button>
                    </div>
                 </div>
                 <p className="text-xs text-slate-500 mt-6 hidden md:block">Tip: Mastered items help you level up. Incorrect items may lower difficulty.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginated.map(word => (
                    <FlashCard key={word.id} word={word} isFlipped={flippedCards.has(word.id)} onFlip={() => toggleFlip(word.id)} />
                  ))}
                </div>
                {filtered.length > paginated.length && (
                  <div className="text-center mt-10">
                    <Button variant="neon" onClick={() => setPage(p => p + 1)}>
                      Load More ({filtered.length - paginated.length} remaining)
                    </Button>
                  </div>
                )}
              </>
            )
          ) : (
            <div className="text-center py-20 text-slate-500">
              <div className="text-4xl mb-4">{search ? "🔍" : "📭"}</div>
              <p>{search ? `No words found for "${search}"` : "No words found for this level."}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
