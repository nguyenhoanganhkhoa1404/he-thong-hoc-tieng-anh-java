// app/vocabulary/page.tsx — Nhóm 2: Vocabulary browser with level tabs and flashcards
"use client";
import { useState } from "react";
import { mockVocab } from "@/data/mockData";
import type { VocabItem } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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

function FlashCard({ word, isFlipped, onFlip }: { word: VocabItem; isFlipped: boolean; onFlip: () => void }) {
  return (
    <div className="perspective-1000 cursor-pointer" onClick={onFlip} style={{ perspective: "1000px", height: "180px" }}>
      <div className="relative w-full h-full transition-all duration-500" style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
        {/* Front */}
        <div className="absolute inset-0 glass border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: "hidden" }}>
          <p className="text-2xl font-extrabold text-white mb-1">{word.word}</p>
          <p className="text-slate-400 text-sm mb-3">{word.phonetic}</p>
          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border bg-gradient-to-r ${levelColors[word.level as Level]}`}>{word.level}</span>
          <p className="text-xs text-slate-500 mt-4">Click to flip</p>
        </div>
        {/* Back */}
        <div className="absolute inset-0 glass border border-violet-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <span className="text-xs text-slate-400 mb-1 uppercase tracking-wider">{word.type}</span>
          <p className="text-xl font-bold text-violet-300 mb-3">{word.meaning}</p>
          <p className="text-slate-400 text-xs italic">&ldquo;{word.example}&rdquo;</p>
        </div>
      </div>
    </div>
  );
}

export default function VocabularyPage() {
  const [selectedLevel, setSelectedLevel] = useState<Level | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const filtered = mockVocab.filter(v =>
    (selectedLevel === "ALL" || v.level === selectedLevel) &&
    (v.word.toLowerCase().includes(search.toLowerCase()) || v.meaning.includes(search))
  );

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Nhóm 2 — Vocabulary</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Word <span className="gradient-text">Galaxy</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">Khám phá 5,000+ từ vựng tiếng Anh theo chuẩn CEFR. Click vào thẻ để xem nghĩa.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedLevel("ALL")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${selectedLevel === "ALL" ? "bg-violet-600/30 border-violet-500 text-violet-200" : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"}`}
            >All Levels</button>
            {levels.map(l => (
              <button key={l} onClick={() => setSelectedLevel(l)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${selectedLevel === l ? `bg-gradient-to-r ${levelColors[l]} bg-opacity-30` : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="md:ml-auto w-full md:w-64">
            <Input placeholder="Search words..." icon="🔍" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="glass border border-white/10 rounded-xl px-4 py-2 text-sm">
            <span className="text-slate-400">Showing </span>
            <span className="text-violet-300 font-bold">{filtered.length}</span>
            <span className="text-slate-400"> words</span>
          </div>
        </div>

        {/* Vocabulary Grid — Flashcards */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(word => (
              <FlashCard key={word.id} word={word} isFlipped={flippedCards.has(word.id)} onFlip={() => toggleFlip(word.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            <div className="text-4xl mb-4">🔍</div>
            <p>No words found for &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center glass border border-violet-500/20 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-3">Want More Words? 📚</h2>
          <p className="text-slate-400 mb-5">Đăng nhập để truy cập toàn bộ 5,000+ từ vựng và ghi nhớ với Spaced Repetition.</p>
          <Button variant="neon" size="lg">🚀 Start Learning</Button>
        </div>
      </div>
    </div>
  );
}
